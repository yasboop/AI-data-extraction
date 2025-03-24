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

@app.post("/extract")
async def extract_data(file: UploadFile = File(...), document_type: str = Form("invoice")):
    """
    Extract data from an uploaded document using AI
    """
    try:
        # Get the file extension
        _, extension = os.path.splitext(file.filename)
        extension = extension.lower()
        
        # Validate file type
        valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt']
        if extension not in valid_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Please upload {', '.join(valid_extensions)}"
            )
        
        # Validate document type
        if document_type not in DOCUMENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported document type. Please use one of: {', '.join(DOCUMENT_TYPES.keys())}"
            )
            
        # Save the file with a unique timestamp-based name
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{document_type}_{timestamp}{extension}"
        file_path = os.path.join("uploads", filename)
        
        # Create uploads directory if it doesn't exist
        if not os.path.exists("uploads"):
            os.makedirs("uploads")
        
        # Save the file
        try:
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            logger.info(f"Saved uploaded file to {file_path}")
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
        
        # Extract text based on file type
        extracted_text = ""
        
        if extension == ".pdf":
            logger.info(f"Processing PDF file: {file_path}")
            # Use the helper function instead of duplicating code
            extracted_text = extract_text_from_pdf(file_path)
            if extracted_text.startswith("Error processing PDF"):
                logger.error(f"PDF extraction error: {extracted_text}")
                # Continue with limited text rather than raising exception
                extracted_text = f"Limited text from PDF: {filename}"
                
        elif extension in [".jpg", ".jpeg", ".png"]:
            logger.info(f"Processing image file: {file_path}")
            # For images, we'll use the multimodal capabilities
            extracted_text = f"[Image file: {file.filename}]"
            # The extractor will handle the image directly
            
        elif extension == ".txt":
            logger.info(f"Processing text file: {file_path}")
            # Read the text file
            try:
                with open(file_path, "r") as f:
                    extracted_text = f.read()
            except Exception as e:
                logger.error(f"Error reading text file: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error reading text file: {str(e)}")
        
        # Choose the appropriate extractor based on document type
        extraction_method = "text-only"
        if extension in [".jpg", ".jpeg", ".png"]:
            extraction_method = "multimodal"
            
        # Use the appropriate extractor based on document type
        if document_type == "contract":
            logger.info("Using enhanced contract extractor")
            extracted_data = contract_extractor.extract_data(
                extracted_text, 
                document_type,
                file_path if extraction_method == "multimodal" else None
            )
        else:
            extracted_data = extractor.extract_data(
                extracted_text, 
                document_type,
                file_path if extraction_method == "multimodal" else None
            )
        
        # Add metadata
        extracted_data["filename"] = filename
        extracted_data["document_type"] = document_type
        extracted_data["extraction_method"] = extraction_method
        
        return extracted_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

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