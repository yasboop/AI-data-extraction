#!/usr/bin/env python3

import os
import sys
import json
import logging
import re
from traceback import format_exc

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("contract_debug.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("contract_debug")

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.contract_extractor import EnhancedContractExtractor
from utils.ai_extractor import AIExtractor

def debug_regex_extraction(text):
    """Test regex extraction patterns to find the error"""
    
    logger.info("Starting debug of regex extraction")
    
    # Initialize contract extractor (but we'll step through the regex manually)
    contract_extractor = EnhancedContractExtractor(model="pixtral")
    
    # This is the regex that's likely causing the issue
    patterns = {
        "contract_number": [
            r"(?i)CONTRACT\s+NUMBER:?\s*([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)",
            r"(?i)CONTRACT\s+(?:NO|NUMBER|#):?\s*([A-Z0-9\-]+)"
        ],
        "client_name": [
            r"(?i)Between:[\s\n]*([A-Za-z0-9\s]+)(?:\s*\(.*?Client.*?\))?",
            r"(?i)CLIENT:?\s*([A-Za-z0-9\s,\.]+)",
            r"(?i)(?:CLIENT|CUSTOMER):?\s*([A-Za-z0-9\s]+(?:Ltd\.?|LLC|Inc\.?|Corporation|Corp\.?|GmbH)?)"
        ],
        # ...and more fields
    }
    
    # Test each regex pattern individually
    for field, field_patterns in patterns.items():
        for pattern in field_patterns:
            try:
                logger.info(f"Testing pattern for {field}: {pattern}")
                match = re.search(pattern, text)
                if match:
                    logger.info(f"  Match found: {match.group(0)}")
                    # Try to access all groups
                    for i in range(1, len(match.groups()) + 1):
                        logger.info(f"  Group {i}: {match.group(i)}")
            except Exception as e:
                logger.error(f"ERROR in pattern '{pattern}': {str(e)}")
                logger.error(format_exc())
    
    # Now test the full extraction method with detailed try/except
    try:
        logger.info("Testing full _extract_contract_with_regex method")
        result = contract_extractor._extract_contract_with_regex(text)
        logger.info(f"Success! Results: {json.dumps(result, indent=2)}")
    except Exception as e:
        logger.error(f"ERROR in full extraction: {str(e)}")
        logger.error(format_exc())

    # Test the augmentation to see if that's where the error is happening
    try:
        logger.info("Testing _augment_with_regex method")
        ai_data = {
            "contract_number": None,
            "client_name": None,
            "service_provider": None,
            "start_date": None,
            "end_date": None,
            "payment_terms": {},
            "renewal_clause": None,
            "legal_obligations": {"client": [], "service_provider": []},
            "termination_conditions": None,
            "signatures": {}
        }
        regex_data = contract_extractor._extract_contract_with_regex(text)
        contract_extractor._augment_with_regex(ai_data, regex_data)
        logger.info(f"Success! Augmented data: {json.dumps(ai_data, indent=2)}")
    except Exception as e:
        logger.error(f"ERROR in augmentation: {str(e)}")
        logger.error(format_exc())
        
    # Finally test the end-to-end method
    try:
        logger.info("Testing complete extract_data method")
        result = contract_extractor.extract_data(text, "contract")
        logger.info(f"Success! Final results: {json.dumps(result, indent=2)}")
    except Exception as e:
        logger.error(f"ERROR in extract_data: {str(e)}")
        logger.error(format_exc())

def main():
    # Check if we have our test contract file
    uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    
    # Find the most recent contract PDF in the uploads directory
    contract_files = []
    for filename in os.listdir(uploads_dir):
        if filename.startswith("contract_") and filename.endswith(".pdf"):
            contract_files.append(os.path.join(uploads_dir, filename))
    
    if not contract_files:
        logger.error("No contract PDF files found in uploads directory")
        return
    
    # Get the most recent one
    contract_file = max(contract_files, key=os.path.getmtime)
    logger.info(f"Using contract file: {contract_file}")
    
    # Extract text from the PDF
    try:
        import pypdf
        with open(contract_file, "rb") as f:
            reader = pypdf.PdfReader(f)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text() or ""
                text += page_text + "\n\n"
        
        # Run the debug
        debug_regex_extraction(text)
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        logger.error(format_exc())

if __name__ == "__main__":
    main() 