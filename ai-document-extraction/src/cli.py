#!/usr/bin/env python3
import os
import sys
import argparse
import logging
from datetime import datetime

# Add project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.document_processor import DocumentProcessor
from utils.ai_extractor import AIExtractor
from config.config import INPUT_DIR, OUTPUT_DIR, DOCUMENT_TYPES, OUTPUT_FORMATS

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def process_document(input_path, document_type, output_format, use_ai=False):
    """
    Process a document and extract information
    
    Args:
        input_path: Path to the input document
        document_type: Type of document (invoice or contract)
        output_format: Output format (json, csv)
        use_ai: Whether to use AI for extraction
        
    Returns:
        Path to the output file
    """
    if not os.path.exists(input_path):
        logger.error(f"Input file not found: {input_path}")
        return None
    
    if document_type not in DOCUMENT_TYPES:
        logger.error(f"Unsupported document type: {document_type}. Supported types: {list(DOCUMENT_TYPES.keys())}")
        return None
    
    if output_format not in OUTPUT_FORMATS:
        logger.error(f"Unsupported output format: {output_format}. Supported formats: {OUTPUT_FORMATS}")
        return None
    
    try:
        # Create document processor
        processor = DocumentProcessor(document_type)
        
        # Process document to extract text and basic data
        extracted_data = processor.process_document(input_path)
        
        # If AI extraction is enabled and we have text
        if use_ai:
            logger.info("Using AI for enhanced extraction")
            text = ""
            
            # Get the file extension
            file_extension = os.path.splitext(input_path)[1].lower()
            
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
        
        # Generate output file path
        input_filename = os.path.basename(input_path)
        input_name = os.path.splitext(input_filename)[0]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"{input_name}_{document_type}_{timestamp}.{output_format}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        # Save output
        processor.save_output(extracted_data, output_path, output_format)
        
        logger.info(f"Successfully processed {input_path} and saved to {output_path}")
        return output_path
    
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        return None

def main():
    """Main entry point for the CLI"""
    parser = argparse.ArgumentParser(description="AI-Powered Document Processing & Data Extraction System")
    
    parser.add_argument("--input", "-i", help="Path to the input document", required=True)
    parser.add_argument("--type", "-t", help="Document type (invoice, contract)", choices=list(DOCUMENT_TYPES.keys()), required=True)
    parser.add_argument("--output", "-o", help="Output format", choices=OUTPUT_FORMATS, default="json")
    parser.add_argument("--use-ai", "-a", help="Use AI for enhanced extraction", action="store_true")
    
    args = parser.parse_args()
    
    # Process the document
    output_path = process_document(args.input, args.type, args.output, args.use_ai)
    
    if output_path:
        print(f"Document processed successfully. Output saved to: {output_path}")
        return 0
    else:
        print("Document processing failed. Check the logs for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 