import os
import sys
import logging
import json
from typing import Dict, Any, Optional

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import (
    QUICKBOOKS_API_KEY, 
    QUICKBOOKS_CLIENT_ID, 
    QUICKBOOKS_CLIENT_SECRET,
    QUICKBOOKS_COMPANY_ID,
    QUICKBOOKS_REDIRECT_URI
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QuickBooksIntegration:
    """
    Integration with QuickBooks accounting software for invoice and contract data
    """
    
    def __init__(self):
        """Initialize the QuickBooks integration"""
        self.api_key = QUICKBOOKS_API_KEY
        self.client_id = QUICKBOOKS_CLIENT_ID
        self.client_secret = QUICKBOOKS_CLIENT_SECRET
        self.company_id = QUICKBOOKS_COMPANY_ID
        self.redirect_uri = QUICKBOOKS_REDIRECT_URI
        
        if not all([self.api_key, self.client_id, self.client_secret, self.company_id]):
            logger.warning("QuickBooks credentials not complete. Integration will not be available.")
            self.is_available = False
        else:
            self.is_available = True
            # In a production environment, we would initialize the QuickBooks SDK here
            # For now, we'll simulate the connection
            logger.info("QuickBooks integration initialized")
    
    def create_invoice(self, invoice_data: Dict[str, Any]) -> Optional[str]:
        """
        Create an invoice in QuickBooks
        
        Args:
            invoice_data: Dictionary containing invoice data
            
        Returns:
            Invoice ID if successful, None otherwise
        """
        if not self.is_available:
            logger.error("QuickBooks integration not available")
            return None
        
        try:
            # Validate required fields
            required_fields = ["invoice_number", "supplier_name", "invoice_date", "total_amount"]
            for field in required_fields:
                if not invoice_data.get(field):
                    logger.error(f"Missing required field for QuickBooks invoice: {field}")
                    return None
            
            # In a production environment, we would use the QuickBooks SDK to create the invoice
            # For now, we'll simulate the API call
            logger.info(f"Creating invoice in QuickBooks: {invoice_data['invoice_number']}")
            
            # Simulate successful invoice creation
            invoice_id = f"QB-{invoice_data['invoice_number']}"
            
            logger.info(f"Successfully created invoice in QuickBooks: {invoice_id}")
            return invoice_id
            
        except Exception as e:
            logger.error(f"Error creating invoice in QuickBooks: {str(e)}")
            return None
    
    def create_vendor(self, vendor_name: str) -> Optional[str]:
        """
        Create a vendor in QuickBooks
        
        Args:
            vendor_name: Name of the vendor
            
        Returns:
            Vendor ID if successful, None otherwise
        """
        if not self.is_available:
            logger.error("QuickBooks integration not available")
            return None
        
        try:
            # In a production environment, we would use the QuickBooks SDK to create the vendor
            # For now, we'll simulate the API call
            logger.info(f"Creating vendor in QuickBooks: {vendor_name}")
            
            # Simulate successful vendor creation
            vendor_id = f"QBV-{vendor_name.replace(' ', '')}"
            
            logger.info(f"Successfully created vendor in QuickBooks: {vendor_id}")
            return vendor_id
            
        except Exception as e:
            logger.error(f"Error creating vendor in QuickBooks: {str(e)}")
            return None
    
    def create_customer(self, customer_name: str) -> Optional[str]:
        """
        Create a customer in QuickBooks
        
        Args:
            customer_name: Name of the customer
            
        Returns:
            Customer ID if successful, None otherwise
        """
        if not self.is_available:
            logger.error("QuickBooks integration not available")
            return None
        
        try:
            # In a production environment, we would use the QuickBooks SDK to create the customer
            # For now, we'll simulate the API call
            logger.info(f"Creating customer in QuickBooks: {customer_name}")
            
            # Simulate successful customer creation
            customer_id = f"QBC-{customer_name.replace(' ', '')}"
            
            logger.info(f"Successfully created customer in QuickBooks: {customer_id}")
            return customer_id
            
        except Exception as e:
            logger.error(f"Error creating customer in QuickBooks: {str(e)}")
            return None
    
    def create_contract(self, contract_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a contract-related record in QuickBooks
        
        Args:
            contract_data: Dictionary containing contract data
            
        Returns:
            Contract ID if successful, None otherwise
        """
        if not self.is_available:
            logger.error("QuickBooks integration not available")
            return None
        
        try:
            # Validate required fields
            required_fields = ["contract_number", "client_name", "start_date", "end_date"]
            for field in required_fields:
                if not contract_data.get(field):
                    logger.error(f"Missing required field for QuickBooks contract: {field}")
                    return None
            
            # In a production environment, we would use the QuickBooks SDK
            # Since QuickBooks doesn't directly support contracts, we would likely create
            # a customer and a project/job for the customer
            logger.info(f"Processing contract in QuickBooks: {contract_data['contract_number']}")
            
            # Create customer first
            customer_id = self.create_customer(contract_data["client_name"])
            if not customer_id:
                return None
            
            # Simulate successful contract creation (as a project/job in QuickBooks)
            contract_id = f"QBP-{contract_data['contract_number']}"
            
            logger.info(f"Successfully processed contract in QuickBooks: {contract_id}")
            return contract_id
            
        except Exception as e:
            logger.error(f"Error processing contract in QuickBooks: {str(e)}")
            return None 