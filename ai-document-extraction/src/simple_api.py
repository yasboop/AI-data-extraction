#!/usr/bin/env python3
import os
import sys
import logging
import shutil
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from pydantic import BaseModel
import re
import pypdf  # Add import for PDF processing
import traceback

# Add project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ai_extractor import AIExtractor
from utils.contract_extractor import EnhancedContractExtractor
from config.config import (
    INPUT_DIR, OUTPUT_DIR, API_HOST, API_PORT, 
    DOCUMENT_TYPES, OUTPUT_FORMATS, DEFAULT_AI_MODEL
)

# Ensure directories exist
os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(INPUT_DIR, "uploads"), exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Document Extraction API",
    description="API for extracting data from documents using AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize extractors
extractor = AIExtractor(model=DEFAULT_AI_MODEL)
contract_extractor = EnhancedContractExtractor(model=DEFAULT_AI_MODEL)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file with detailed logging"""
    try:
        # Use the global import that's already at the top of the file
        logger.debug(f"Extracting text from PDF: {file_path}")
        
        try:
            import pypdf  # Try importing locally to ensure it's available
            logger.debug("Successfully imported pypdf")
            
            # Try to extract text directly from PDF
            reader = pypdf.PdfReader(file_path)
            logger.debug(f"PDF has {len(reader.pages)} pages")
            text = ""
            for i, page in enumerate(reader.pages):
                try:
                    page_text = page.extract_text() or ""
                    text += page_text + "\n"
                    logger.debug(f"Page {i+1} extracted {len(page_text)} characters")
                except Exception as page_error:
                    logger.error(f"Error extracting text from page {i+1}: {str(page_error)}")
                    text += f"[Error extracting page {i+1}]\n"
            
            logger.debug(f"Total text extracted: {len(text)} characters")
            return text
        except Exception as pdf_error:
            logger.error(f"Error in PDF extraction: {str(pdf_error)}")
            return f"Error processing PDF document: {str(pdf_error)}"
            
    except ImportError:
        logger.warning("pypdf module not available, using fallback approach")
        return "This is a PDF document that requires the pypdf module for text extraction."
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return f"Error processing PDF document: {str(e)}"

class ExtractionResponse(BaseModel):
    filename: str
    document_type: str
    data: Dict[str, Any]

class ErrorResponse(BaseModel):
    error: str

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    model: str

@app.get("/", response_model=HealthCheckResponse)
async def root():
    return {
        "status": "running",
        "version": "1.0.0",
        "model": extractor.model
    }

@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "model": extractor.model
    }

def detect_document_type(filename: str) -> str:
    """
    Detect document type based on filename
    """
    filename = filename.lower()
    
    if any(term in filename for term in ["invoice", "inv", "bill"]):
        return "invoice"
    elif any(term in filename for term in ["contract", "agreement", "legal"]):
        return "contract"
    elif any(term in filename for term in ["receipt", "payment"]):
        return "receipt"
    else:
        # Default to invoice if we can't determine
        return "invoice"

@app.post("/extract")
async def extract_document(file: UploadFile = File(...), doc_type: str = Form("auto")):
    """
    Extract structured data from uploaded document
    """
    try:
        logger.info(f"Received file: {file.filename}, type: {doc_type}")
        
        # Determine document type if auto-detection is requested
        if doc_type == "auto":
            doc_type = detect_document_type(file.filename)
            logger.info(f"Auto-detected document type: {doc_type}")
        
        # Create uploads directory if it doesn't exist
        if not os.path.exists("uploads"):
            os.makedirs("uploads")
        
        # Generate a unique filename to prevent overwrites
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_ext = os.path.splitext(file.filename)[1]
        safe_filename = f"{doc_type}_{timestamp}{file_ext}"
        file_path = os.path.join("uploads", safe_filename)
        
        # Save the uploaded file
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        logger.info(f"Saved uploaded file to {file_path}")
        
        # Extract text from PDF
        logger.info(f"Processing PDF file: {file_path}")
        text_content = extract_text_from_pdf(file_path)
        
        # Create the extractor
        extractor = AIExtractor()
        
        # Extract structured data using AI
        # Always pass the file_path for potential multimodal extraction
        extracted_data = extractor.extract_data(
            document_content=text_content,
            document_type=doc_type,
            image_path=file_path
        )
        
        # Log detailed extracted data for debugging
        logger.info(f"Extracted data fields: {list(extracted_data.keys())}")
        logger.info(f"Document type: {doc_type}")
        
        # Add metadata about extraction method
        # Check if the file is a PDF since we're using multimodal for PDFs
        is_pdf = file_path.lower().endswith('.pdf')
        use_multimodal = is_pdf and "pixtral" in extractor.model and os.path.exists(file_path)
        
        # Force extraction_method to "multimodal" for all PDFs (both invoices and contracts) when using Pixtral
        if use_multimodal:
            extraction_method = "multimodal"
            logger.info(f"Using multimodal extraction for {doc_type}")
        else:
            extraction_method = "text-only"
            logger.info(f"Using text-only extraction for {doc_type}")
        
        logger.info(f"Extraction complete using {extraction_method} extraction")
        
        # Return the extracted data with metadata
        response_data = {
            "success": True,
            "document_type": doc_type,
            "extraction_method": extraction_method,  # This should match what the frontend expects
            "filename": file.filename,
            "data": {
                # Add extraction_method to the data object as well, which is what ResultDisplay.js uses
                "extraction_method": extraction_method,
                "document_type": doc_type,
                **extracted_data
            }
        }
        
        # Log the final response structure to verify
        logger.info(f"Response data structure: {list(response_data.keys())}")
        logger.info(f"Response data['data'] structure: {list(response_data['data'].keys())}")
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error extracting data: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/document-types")
async def get_document_types():
    return {"document_types": DOCUMENT_TYPES}

@app.get("/output-formats")
async def get_output_formats():
    return {"output_formats": OUTPUT_FORMATS}

@app.get("/model-info")
async def get_model_info():
    return {
        "current_model": extractor.model,
        "available_models": ["mistral", "pixtral"],
        "multimodal_support": extractor.model == "pixtral",
        "supported_files": [".pdf", ".jpg", ".jpeg", ".png", ".txt"] if extractor.model == "pixtral" else [".txt"]
    }

if __name__ == "__main__":
    uvicorn.run("simple_api:app", host=API_HOST, port=API_PORT, reload=True) 