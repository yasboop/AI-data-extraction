#!/usr/bin/env python3
import os
import sys
import logging
import shutil
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from mangum import Mangum
import uvicorn
from pydantic import BaseModel

# Add project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.document_processor import DocumentProcessor
from utils.ai_extractor import AIExtractor
from utils.quickbooks_integration import QuickBooksIntegration
from utils.database import DatabaseManager
from config.config import (
    INPUT_DIR, OUTPUT_DIR, API_HOST, API_PORT, 
    DOCUMENT_TYPES, OUTPUT_FORMATS, IS_VERCEL, 
    VERCEL_ENV, S3_BUCKET_NAME
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize database
db_manager = DatabaseManager()
if not IS_VERCEL:
    db_manager.create_tables()

# Initialize QuickBooks integration
quickbooks = QuickBooksIntegration()

# Create FastAPI app
app = FastAPI(
    title="AI Document Extraction API",
    description="API for extracting data from invoices and contracts using AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Create necessary directories if not in Vercel environment
if not IS_VERCEL:
    os.makedirs(INPUT_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

# Define response models
class ExtractionResponse(BaseModel):
    document_id: int
    output_file: str
    data: Dict[str, Any]

class QuickBooksResponse(BaseModel):
    document_id: int
    quickbooks_id: str
    sync_status: str
    record_type: str

class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    processed_at: datetime
    file_extension: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    environment: str

@app.get("/", response_model=HealthCheckResponse)
async def root():
    """Root endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": VERCEL_ENV if IS_VERCEL else "development"
    }

@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": VERCEL_ENV if IS_VERCEL else "development"
    }

@app.post("/extract", response_model=ExtractionResponse)
async def extract_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    output_format: str = Form("json"),
    use_ai: bool = Form(False),
    send_to_quickbooks: bool = Form(False)
):
    """
    Extract data from a document
    
    - **file**: Document file (PDF, DOCX, JPG, PNG)
    - **document_type**: Type of document (invoice, contract)
    - **output_format**: Output format (json, csv, pdf)
    - **use_ai**: Whether to use AI for extraction
    - **send_to_quickbooks**: Whether to send the data to QuickBooks
    
    Returns:
        JSON response with extracted data and output file path
    """
    # Validate input
    if document_type not in DOCUMENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported document type: {document_type}. Supported types: {list(DOCUMENT_TYPES.keys())}")
    
    if output_format not in OUTPUT_FORMATS:
        raise HTTPException(status_code=400, detail=f"Unsupported output format: {output_format}. Supported formats: {OUTPUT_FORMATS}")
    
    try:
        # Save the uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        input_filename = f"{timestamp}_{file.filename}"
        input_path = os.path.join(INPUT_DIR, input_filename)
        
        # Get file info
        file_size = file.size
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        # Add document to database
        document = db_manager.add_document(
            filename=file.filename,
            document_type=document_type,
            file_path=input_path,
            file_size=file_size,
            file_extension=file_extension
        )
        
        # Save file to disk (or S3 if in Vercel environment)
        if IS_VERCEL and S3_BUCKET_NAME:
            # TODO: Implement S3 file storage for Vercel environment
            # For now, we'll raise an error
            raise HTTPException(status_code=501, detail="S3 storage not implemented yet for Vercel environment")
        else:
            with open(input_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        
        # Create document processor
        processor = DocumentProcessor(document_type)
        
        # Process document to extract text and basic data
        extracted_data = processor.process_document(input_path)
        
        # If AI extraction is enabled
        if use_ai:
            logger.info("Using AI for enhanced extraction")
            text = ""
            
            # Extract text based on file type
            if file_extension == '.pdf':
                text = processor._extract_text_from_pdf(input_path)
            elif file_extension in ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']:
                text = processor._extract_text_from_image(input_path)
            elif file_extension in ['.docx', '.doc']:
                text = processor._extract_text_from_docx(input_path)
            
            if text:
                # Use AI to extract data
                ai_extractor = AIExtractor()
                ai_data = ai_extractor.extract_data(text, document_type)
                
                # Update extracted_data with AI results (prefer AI results when available)
                if ai_data:
                    for field, value in ai_data.items():
                        if value:  # Only update if the AI found a non-empty value
                            extracted_data[field] = value
        
        # Add extracted data to database
        extraction_method = "ai" if use_ai else "rule-based"
        db_manager.add_extracted_data(document.id, extracted_data, extraction_method)
        
        # Generate output file path
        input_name = os.path.splitext(input_filename)[0]
        output_filename = f"{input_name}_{document_type}.{output_format}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        # Save output
        processor.save_output(extracted_data, output_path, output_format)
        
        # Send to QuickBooks if requested
        if send_to_quickbooks:
            if document_type == "invoice":
                quickbooks_id = quickbooks.create_invoice(extracted_data)
                if quickbooks_id:
                    db_manager.add_quickbooks_record(document.id, quickbooks_id, "invoice")
            elif document_type == "contract":
                quickbooks_id = quickbooks.create_contract(extracted_data)
                if quickbooks_id:
                    db_manager.add_quickbooks_record(document.id, quickbooks_id, "contract")
        
        logger.info(f"Successfully processed {input_path} and saved to {output_path}")
        
        return {
            "document_id": document.id,
            "output_file": output_path,
            "data": extracted_data
        }
    
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents", response_model=List[DocumentResponse])
async def get_documents(document_type: Optional[str] = Query(None)):
    """
    Get all documents
    
    - **document_type**: Filter by document type (optional)
    
    Returns:
        List of documents
    """
    documents = db_manager.get_all_documents(document_type)
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "document_type": doc.document_type,
            "processed_at": doc.processed_at,
            "file_extension": doc.file_extension
        }
        for doc in documents
    ]

@app.get("/documents/{document_id}", response_model=Dict[str, Any])
async def get_document_data(document_id: int = Path(...)):
    """
    Get data for a specific document
    
    - **document_id**: ID of the document
    
    Returns:
        Document data
    """
    document = db_manager.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail=f"Document not found: {document_id}")
    
    extracted_data = db_manager.get_extracted_data(document_id)
    
    return {
        "id": document.id,
        "filename": document.filename,
        "document_type": document.document_type,
        "processed_at": document.processed_at,
        "file_extension": document.file_extension,
        "data": extracted_data or {}
    }

@app.post("/quickbooks/send/{document_id}", response_model=QuickBooksResponse)
async def send_to_quickbooks(document_id: int = Path(...)):
    """
    Send document data to QuickBooks
    
    - **document_id**: ID of the document
    
    Returns:
        QuickBooks integration status
    """
    document = db_manager.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail=f"Document not found: {document_id}")
    
    extracted_data = db_manager.get_extracted_data(document_id)
    if not extracted_data:
        raise HTTPException(status_code=404, detail=f"Extracted data not found for document: {document_id}")
    
    if document.document_type == "invoice":
        quickbooks_id = quickbooks.create_invoice(extracted_data)
        record_type = "invoice"
    elif document.document_type == "contract":
        quickbooks_id = quickbooks.create_contract(extracted_data)
        record_type = "contract"
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported document type for QuickBooks: {document.document_type}")
    
    if not quickbooks_id:
        raise HTTPException(status_code=500, detail="Failed to send data to QuickBooks")
    
    # Add QuickBooks record to database
    quickbooks_record = db_manager.add_quickbooks_record(document_id, quickbooks_id, record_type)
    
    return {
        "document_id": document_id,
        "quickbooks_id": quickbooks_id,
        "sync_status": "success",
        "record_type": record_type
    }

@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a processed file
    
    - **filename**: Name of the file to download
    
    Returns:
        File response
    """
    file_path = os.path.join(OUTPUT_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {filename}")
    
    return FileResponse(file_path, filename=filename)

@app.get("/document-types")
async def get_document_types():
    """
    Get supported document types
    
    Returns:
        List of supported document types
    """
    return {"document_types": list(DOCUMENT_TYPES.keys())}

@app.get("/output-formats")
async def get_output_formats():
    """
    Get supported output formats
    
    Returns:
        List of supported output formats
    """
    return {"output_formats": OUTPUT_FORMATS}

# Create a handler for AWS Lambda / Vercel
handler = Mangum(app)

def start():
    """Start the API server"""
    uvicorn.run("api:app", host=API_HOST, port=API_PORT, reload=True)

if __name__ == "__main__":
    start() 