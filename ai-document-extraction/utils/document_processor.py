import os
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import docx
import json
import csv
import pandas as pd
from paddleocr import PaddleOCR
import pypdf
import logging
from typing import Dict, List, Any, Optional, Tuple
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import TESSERACT_CMD, OCR_ENGINE, DOCUMENT_TYPES

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

class DocumentProcessor:
    """
    Main class for processing documents and extracting information
    """
    
    def __init__(self, document_type: str):
        """
        Initialize the document processor
        
        Args:
            document_type: Type of document (invoice or contract)
        """
        if document_type not in DOCUMENT_TYPES:
            raise ValueError(f"Unsupported document type: {document_type}. Supported types: {list(DOCUMENT_TYPES.keys())}")
        
        self.document_type = document_type
        self.ocr_engine = OCR_ENGINE
        
        if self.ocr_engine == "paddleocr":
            self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang='en')
    
    def process_document(self, file_path: str) -> Dict[str, Any]:
        """
        Process a document and extract information
        
        Args:
            file_path: Path to the document file
            
        Returns:
            Dictionary containing extracted information
        """
        logger.info(f"Processing {self.document_type}: {file_path}")
        
        # Determine file type
        file_extension = os.path.splitext(file_path)[1].lower()
        
        # Extract text based on file type
        if file_extension == '.pdf':
            text = self._extract_text_from_pdf(file_path)
        elif file_extension in ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']:
            text = self._extract_text_from_image(file_path)
        elif file_extension in ['.docx', '.doc']:
            text = self._extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Extract information based on document type
        if self.document_type == "invoice":
            return self._extract_invoice_data(text, file_path)
        elif self.document_type == "contract":
            return self._extract_contract_data(text, file_path)
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from a PDF file"""
        logger.info(f"Extracting text from PDF: {file_path}")
        
        try:
            # First try to extract text directly from PDF
            reader = pypdf.PdfReader(file_path)
            logger.debug(f"PDF has {len(reader.pages)} pages")
            text = ""
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                text += page_text + "\n"
                logger.debug(f"Page {i+1} extracted {len(page_text)} characters")
            
            logger.debug(f"Total text extracted directly: {len(text)} characters")
            logger.debug(f"Sample text (first 200 chars): {text[:200]}")
            
            # If text extraction yields meaningful content, return it
            if len(text.strip()) > 100:  # Arbitrary threshold
                logger.info("Successfully extracted text directly from PDF")
                return text
            
            # Otherwise, use OCR on the PDF images
            logger.info("PDF text extraction yielded limited content, falling back to OCR")
            return self._ocr_pdf(file_path)
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            # Fallback to OCR
            return self._ocr_pdf(file_path)
    
    def _ocr_pdf(self, file_path: str) -> str:
        """Apply OCR to a PDF file"""
        logger.info("Converting PDF to images for OCR")
        images = convert_from_path(file_path)
        logger.debug(f"Converted PDF to {len(images)} images")
        text = ""
        
        for i, image in enumerate(images):
            logger.info(f"Processing page {i+1}")
            if self.ocr_engine == "tesseract":
                page_text = pytesseract.image_to_string(image)
            else:  # paddleocr
                result = self.paddle_ocr.ocr(image)
                page_text = "\n".join([line[1][0] for line in result[0]])
            
            logger.debug(f"Page {i+1} OCR extracted {len(page_text)} characters")
            text += page_text + "\n\n"
        
        logger.debug(f"Total OCR text extracted: {len(text)} characters")
        logger.debug(f"OCR sample text (first 200 chars): {text[:200]}")
        return text
    
    def _extract_text_from_image(self, file_path: str) -> str:
        """Extract text from an image using OCR"""
        logger.info("Extracting text from image")
        image = Image.open(file_path)
        
        if self.ocr_engine == "tesseract":
            return pytesseract.image_to_string(image)
        else:  # paddleocr
            result = self.paddle_ocr.ocr(file_path)
            return "\n".join([line[1][0] for line in result[0]])
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from a DOCX file"""
        logger.info("Extracting text from DOCX")
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    
    def _extract_invoice_data(self, text: str, file_path: str) -> Dict[str, Any]:
        """
        Extract invoice data from text
        
        In a production environment, this would use AI/NLP models for extraction.
        This is a simplified version that uses basic text parsing.
        """
        logger.info("Extracting invoice data")
        
        # Initialize with empty values
        invoice_data = {field: "" for field in DOCUMENT_TYPES["invoice"]["fields"]}
        
        # Simple rule-based extraction (in production, use AI/NLP)
        lines = text.split('\n')
        for line in lines:
            line = line.lower().strip()
            
            # Invoice number
            if "invoice" in line and "no" in line and ":" in line:
                invoice_data["invoice_number"] = line.split(":")[1].strip()
            
            # Supplier
            if "from:" in line or "supplier:" in line or "vendor:" in line:
                invoice_data["supplier_name"] = line.split(":")[1].strip()
            
            # Invoice date
            if "invoice date" in line or "date:" in line:
                invoice_data["invoice_date"] = line.split(":")[1].strip()
            
            # Total amount
            if "total" in line and ("amount" in line or "due" in line):
                # Extract numeric value
                invoice_data["total_amount"] = self._extract_amount(line)
            
            # VAT/GST
            if "vat" in line or "gst" in line or "tax" in line:
                invoice_data["vat_amount"] = self._extract_amount(line)
            
            # Due date
            if "due date" in line or "payment due" in line:
                invoice_data["payment_due_date"] = line.split(":")[1].strip()
        
        return invoice_data
    
    def _extract_contract_data(self, text: str, file_path: str) -> Dict[str, Any]:
        """
        Extract contract data from text
        
        In a production environment, this would use AI/NLP models for extraction.
        This is a simplified version that uses basic text parsing.
        """
        logger.info("Extracting contract data")
        
        # Initialize with empty values
        contract_data = {field: "" for field in DOCUMENT_TYPES["contract"]["fields"]}
        
        # Simple rule-based extraction (in production, use AI/NLP)
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line = line.lower().strip()
            
            # Contract number
            if "contract" in line and "no" in line and ":" in line:
                contract_data["contract_number"] = line.split(":")[1].strip()
            
            # Client name
            if "client:" in line or "customer:" in line or "between" in line and "and" in line:
                contract_data["client_name"] = line.split(":")[1].strip() if ":" in line else line.split("and")[1].strip()
            
            # Start date
            if "start date" in line or "effective date" in line or "commencement date" in line:
                contract_data["start_date"] = line.split(":")[1].strip() if ":" in line else self._extract_date(line)
            
            # End date
            if "end date" in line or "termination date" in line or "expiry date" in line:
                contract_data["end_date"] = line.split(":")[1].strip() if ":" in line else self._extract_date(line)
            
            # Payment terms
            if "payment terms" in line or "payment schedule" in line:
                contract_data["payment_terms"] = self._extract_paragraph(lines, i)
            
            # Renewal clause
            if "renewal" in line or "extension" in line or "auto-renewal" in line:
                contract_data["renewal_clause"] = self._extract_paragraph(lines, i)
            
            # Key obligations
            if "obligations" in line or "responsibilities" in line or "duties" in line:
                contract_data["key_obligations"] = self._extract_paragraph(lines, i)
        
        return contract_data
    
    def _extract_amount(self, text: str) -> str:
        """Extract an amount from text"""
        import re
        # Match patterns like $1,234.56 or 1,234.56 or 1234.56
        amount_pattern = r'\$?\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?'
        match = re.search(amount_pattern, text)
        if match:
            return match.group(0).strip()
        return ""
    
    def _extract_date(self, text: str) -> str:
        """Extract a date from text"""
        import re
        # Match common date formats
        date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}'
        match = re.search(date_pattern, text, re.IGNORECASE)
        if match:
            return match.group(0).strip()
        return ""
    
    def _extract_paragraph(self, lines: List[str], start_index: int, max_lines: int = 3) -> str:
        """Extract a paragraph starting from a specific line"""
        result = []
        for i in range(start_index, min(start_index + max_lines, len(lines))):
            if lines[i].strip():  # Skip empty lines
                result.append(lines[i].strip())
            else:
                break  # Stop at first empty line
        
        return " ".join(result)
    
    def save_output(self, data: Dict[str, Any], output_file: str, format_type: str = "json"):
        """
        Save extracted data to a file
        
        Args:
            data: Extracted data
            output_file: Output file path
            format_type: Output format (json, csv)
        """
        logger.info(f"Saving output to {output_file} in {format_type} format")
        
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        if format_type == "json":
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
        
        elif format_type == "csv":
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=data.keys())
                writer.writeheader()
                writer.writerow(data)
        
        else:
            raise ValueError(f"Unsupported output format: {format_type}")
        
        logger.info(f"Successfully saved output to {output_file}") 