import os
import sys
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import DOCUMENT_TYPES

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SimpleExtractor:
    """
    Simple mock extractor that returns placeholder data for testing purposes
    """
    
    def __init__(self):
        """Initialize the simple extractor"""
        self.name = "SimpleExtractor"
        logger.info("SimpleExtractor initialized")
    
    def extract_data(self, text: str, document_type: str) -> Dict[str, Any]:
        """
        Extract data from text (mock implementation)
        
        Args:
            text: Text to extract data from
            document_type: Type of document (invoice or contract)
            
        Returns:
            Dictionary containing extracted information
        """
        if document_type not in DOCUMENT_TYPES:
            raise ValueError(f"Unsupported document type: {document_type}")
        
        fields = DOCUMENT_TYPES[document_type]["fields"]
        logger.info(f"Extracting data for document type: {document_type} with {len(fields)} fields")
        
        # Create mock data based on document type
        mock_data = self._create_mock_data(document_type, fields)
        
        return mock_data
    
    def _create_mock_data(self, document_type: str, fields: List[str]) -> Dict[str, Any]:
        """
        Create mock data for testing purposes
        
        Args:
            document_type: Type of document
            fields: List of fields to extract
            
        Returns:
            Dictionary containing mock extracted data
        """
        mock_data = {
            "document_type": document_type,
            "extracted_at": datetime.now().isoformat(),
            "confidence_score": 0.85,
        }
        
        # Add mock values for each field
        if document_type == "invoice":
            mock_data.update({
                "invoice_number": "INV-2023-001",
                "supplier_name": "Sample Supplier Ltd.",
                "invoice_date": "2023-03-01",
                "total_amount": "1250.00",
                "vat_amount": "250.00",
                "payment_due_date": "2023-03-31"
            })
        elif document_type == "contract":
            mock_data.update({
                "contract_number": "CTR-2023-001",
                "client_name": "Sample Client Inc.",
                "start_date": "2023-04-01",
                "end_date": "2024-03-31",
                "payment_terms": "Net 30 days",
                "renewal_clause": "Automatic renewal for 12 months unless terminated with 30 days notice",
                "key_obligations": "Deliver services as specified in Appendix A"
            })
        
        return mock_data 