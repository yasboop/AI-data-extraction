#!/usr/bin/env python3
"""
Enhanced Document Extractor for AI Document Extraction System
"""

import os
import fitz  # PyMuPDF
import re
import json
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("extraction.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("DocumentExtractor")

class EnhancedDocumentExtractor:
    """Handles extraction from various document types with error handling"""
    
    def __init__(self, upload_dir="uploads", output_dir="extracted"):
        """Initialize the document extractor with directories"""
        self.upload_dir = upload_dir
        self.output_dir = output_dir
        
        # Create directories if they don't exist
        Path(upload_dir).mkdir(exist_ok=True)
        Path(output_dir).mkdir(exist_ok=True)
        
        logger.info(f"Document extractor initialized with upload dir: {upload_dir}")
        
    def extract_from_pdf(self, filename):
        """Extract text and metadata from PDF files"""
        try:
            filepath = os.path.join(self.upload_dir, filename)
            logger.info(f"Processing PDF file: {filepath}")
            
            # Open the document
            doc = fitz.open(filepath)
            
            # Initialize results dictionary
            results = {
                "metadata": self._extract_metadata(doc),
                "pages": []
            }
            
            # Process each page
            for page_num in range(len(doc)):
                try:
                    page = doc[page_num]
                    page_data = {
                        "page_number": page_num + 1,
                        "text": page.get_text(),
                        "layout": self._analyze_layout(page)
                    }
                    
                    # Check if page has text content
                    if not page_data["text"].strip():
                        logger.warning(f"Page {page_num+1} appears to be scanned or has no text. Attempting OCR.")
                        # In a production system, you'd implement OCR here
                        page_data["text"] = "Scanned page detected - OCR processing required"
                        page_data["is_scanned"] = True
                    
                    results["pages"].append(page_data)
                    
                except Exception as e:
                    logger.error(f"Error processing page {page_num+1}: {str(e)}")
                    results["pages"].append({
                        "page_number": page_num + 1,
                        "error": str(e),
                        "text": f"Error extracting text from page {page_num+1}"
                    })
            
            # Save the extraction results
            output_path = os.path.join(self.output_dir, f"{os.path.splitext(filename)[0]}.json")
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
                
            logger.info(f"Extraction complete: {output_path}")
            return results
            
        except Exception as e:
            logger.error(f"Failed to extract from PDF {filename}: {str(e)}")
            return {
                "error": str(e),
                "message": f"Failed to extract from PDF {filename}"
            }
    
    def extract_from_text(self, filename):
        """Extract from plain text files"""
        try:
            filepath = os.path.join(self.upload_dir, filename)
            logger.info(f"Processing text file: {filepath}")
            
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Parse the contract text (example regex pattern)
            results = self._parse_contract_data(content)
            
            # Save the extraction results
            output_path = os.path.join(self.output_dir, f"{os.path.splitext(filename)[0]}.json")
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
                
            logger.info(f"Extraction complete: {output_path}")
            return results
            
        except Exception as e:
            logger.error(f"Failed to extract from text file {filename}: {str(e)}")
            return {
                "error": str(e),
                "message": f"Failed to extract from text file {filename}"
            }
    
    def _extract_metadata(self, doc):
        """Extract metadata from PDF document"""
        metadata = doc.metadata
        if metadata:
            return {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "keywords": metadata.get("keywords", ""),
                "creator": metadata.get("creator", ""),
                "producer": metadata.get("producer", ""),
                "creation_date": metadata.get("creationDate", ""),
                "modification_date": metadata.get("modDate", ""),
                "pages": len(doc)
            }
        return {"pages": len(doc)}
    
    def _analyze_layout(self, page):
        """Analyze the layout of a PDF page"""
        # Get blocks that represent the rough layout
        blocks = page.get_text("blocks")
        
        # Check for images
        images = page.get_images()
        
        # Check for tables (simplified detection)
        # In a production system, you'd use a more sophisticated table detection algorithm
        has_tables = len(page.find_tables()) > 0 if hasattr(page, 'find_tables') else False
        
        return {
            "block_count": len(blocks),
            "has_images": len(images) > 0,
            "image_count": len(images),
            "has_tables": has_tables
        }
    
    def _parse_contract_data(self, text):
        """Parse common contract fields from text using regex patterns"""
        # Initialize results with full text
        results = {
            "full_text": text,
            "extracted_fields": {}
        }
        
        # Extract contract fields using regex
        # These patterns are examples and should be customized for your specific contracts
        patterns = {
            "contract_number": r"CONTRACT\s+NUMBER[:\s]+([A-Za-z0-9\-]+)",
            "effective_date": r"EFFECTIVE\s+DATE[:\s]+([A-Za-z0-9,\s]+)",
            "expiration_date": r"EXPIRATION\s+DATE[:\s]+([A-Za-z0-9,\s]+)",
            "parties": r"BETWEEN[:\s]+(.*?)AND[:\s]+(.*?)(?=TERMS|==)",
            "payment_terms": r"PAYMENT\s+TERMS(.*?)(?=\d+\.\s+[A-Z]+|$)",
        }
        
        # Apply each pattern
        for field, pattern in patterns.items():
            try:
                match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if match:
                    if field == "parties":
                        results["extracted_fields"]["service_provider"] = match.group(1).strip()
                        results["extracted_fields"]["client"] = match.group(2).strip()
                    else:
                        results["extracted_fields"][field] = match.group(1).strip()
            except Exception as e:
                logger.warning(f"Error extracting {field}: {str(e)}")
                results["extracted_fields"][field] = None
        
        return results

    def process_file(self, filename):
        """Process a file based on its extension"""
        _, ext = os.path.splitext(filename)
        ext = ext.lower()
        
        if ext in ['.pdf']:
            return self.extract_from_pdf(filename)
        elif ext in ['.txt', '.text']:
            return self.extract_from_text(filename)
        else:
            logger.error(f"Unsupported file type: {ext}")
            return {
                "error": f"Unsupported file type: {ext}",
                "message": "Only PDF and text files are supported"
            }

# Example usage
if __name__ == "__main__":
    extractor = EnhancedDocumentExtractor()
    
    # Test with sample files
    test_files = [f for f in os.listdir("uploads") if os.path.isfile(os.path.join("uploads", f))]
    
    if not test_files:
        print("No files found in uploads directory. Please add files to test.")
    else:
        for file in test_files:
            print(f"Processing {file}...")
            result = extractor.process_file(file)
            if "error" in result:
                print(f"Error: {result['error']}")
            else:
                print(f"Successfully processed {file} with {len(result.get('pages', []))} pages") 