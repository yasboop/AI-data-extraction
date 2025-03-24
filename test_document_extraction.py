#!/usr/bin/env python3
import os
import logging
import json
import sys
import time
from dotenv import load_dotenv

# Add project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the AIExtractor
from utils.ai_extractor import AIExtractor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def read_sample_document(filename):
    """Read a sample document from the sample_documents directory."""
    file_path = os.path.join("sample_documents", filename)
    if not os.path.exists(file_path):
        logger.error(f"Sample document not found: {file_path}")
        return None
    
    with open(file_path, "r") as file:
        return file.read()

def test_invoice_extraction():
    """Test invoice extraction capabilities."""
    logger.info("=== TESTING INVOICE EXTRACTION ===")
    
    # Load the sample invoice document
    invoice_text = read_sample_document("invoice_sample.txt")
    if not invoice_text:
        return
    
    logger.info(f"Loaded invoice sample document, length: {len(invoice_text)}")
    
    # Initialize the AIExtractor with Pixtral model
    extractor = AIExtractor(model="pixtral")
    
    # Extract data from the invoice
    start_time = time.time()
    result = extractor.extract_data(invoice_text, "invoice")
    extraction_time = time.time() - start_time
    
    logger.info(f"Extraction completed in {extraction_time:.2f} seconds")
    
    # Print the extraction results
    logger.info("=== INVOICE EXTRACTION RESULTS ===")
    
    # Check for required fields from the assignment
    required_fields = [
        "invoice_number", 
        "supplier_name", 
        "invoice_date", 
        "total_amount", 
        "vat_amount", 
        "payment_due_date"
    ]
    
    # Check which required fields were extracted
    extracted_fields = []
    missing_fields = []
    
    for field in required_fields:
        if field in result and result[field]:
            extracted_fields.append(field)
        else:
            missing_fields.append(field)
    
    logger.info(f"Successfully extracted: {extracted_fields}")
    
    if missing_fields:
        logger.warning(f"Missing required fields: {missing_fields}")
    
    # Print the full extraction result
    print(json.dumps(result, indent=2))
    
    return result

def test_contract_extraction():
    """Test contract extraction capabilities."""
    logger.info("\n=== TESTING CONTRACT EXTRACTION ===")
    
    # Load the sample contract document
    contract_text = read_sample_document("contract_sample.txt")
    if not contract_text:
        return
    
    logger.info(f"Loaded contract sample document, length: {len(contract_text)}")
    
    # Initialize the AIExtractor with Pixtral model
    extractor = AIExtractor(model="pixtral")
    
    # Extract data from the contract
    start_time = time.time()
    result = extractor.extract_data(contract_text, "contract")
    extraction_time = time.time() - start_time
    
    logger.info(f"Extraction completed in {extraction_time:.2f} seconds")
    
    # Print the extraction results
    logger.info("=== CONTRACT EXTRACTION RESULTS ===")
    
    # Check for required fields from the assignment
    required_fields = [
        "contract_number", 
        "client_name", 
        "start_date", 
        "end_date", 
        "payment_terms", 
        "renewal_clause", 
        "legal_obligations"
    ]
    
    # Check which required fields were extracted
    extracted_fields = []
    missing_fields = []
    
    for field in required_fields:
        if field in result and result[field]:
            extracted_fields.append(field)
        else:
            missing_fields.append(field)
    
    logger.info(f"Successfully extracted: {extracted_fields}")
    
    if missing_fields:
        logger.warning(f"Missing required fields: {missing_fields}")
    
    # Print the full extraction result
    print(json.dumps(result, indent=2))
    
    return result

def main():
    """Run all the tests."""
    logger.info("Starting document extraction tests for the assignment requirements")
    
    # Test invoice extraction
    invoice_result = test_invoice_extraction()
    
    # Test contract extraction
    contract_result = test_contract_extraction()
    
    # Summary
    logger.info("\n=== TEST SUMMARY ===")
    if invoice_result:
        logger.info("Invoice extraction: Success")
    else:
        logger.info("Invoice extraction: Failed")
    
    if contract_result:
        logger.info("Contract extraction: Success")
    else:
        logger.info("Contract extraction: Failed")

if __name__ == "__main__":
    main() 