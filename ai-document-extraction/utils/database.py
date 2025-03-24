import os
import sys
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List

import sqlalchemy as sa
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, scoped_session

# Add project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.config import DATABASE_URL

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

Base = declarative_base()

class Document(Base):
    """Document model for storing processed documents"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False)  # invoice or contract
    file_path = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)
    file_extension = Column(String(10), nullable=True)
    processed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    extracted_data = relationship("ExtractedData", back_populates="document", uselist=False, cascade="all, delete-orphan")
    quickbooks_record = relationship("QuickBooksRecord", back_populates="document", uselist=False, cascade="all, delete-orphan")

class ExtractedData(Base):
    """Model for storing extracted data from documents"""
    __tablename__ = "extracted_data"
    
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    data = Column(JSON, nullable=False)  # Store all extracted fields as JSON
    extraction_method = Column(String(50), nullable=True)  # rule-based, ai, or mixed
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    document = relationship("Document", back_populates="extracted_data")

class QuickBooksRecord(Base):
    """Model for storing QuickBooks integration records"""
    __tablename__ = "quickbooks_records"
    
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    quickbooks_id = Column(String(100), nullable=False)  # ID in QuickBooks
    record_type = Column(String(50), nullable=False)  # invoice, vendor, customer, contract
    sync_status = Column(String(50), nullable=False, default="pending")  # pending, success, failed
    sync_timestamp = Column(DateTime, nullable=True)
    sync_message = Column(Text, nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="quickbooks_record")

class DatabaseManager:
    """Database manager for handling database operations"""
    
    def __init__(self):
        """Initialize the database manager"""
        try:
            self.engine = create_engine(DATABASE_URL)
            self.Session = scoped_session(sessionmaker(bind=self.engine))
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Error connecting to database: {str(e)}")
            raise
    
    def create_tables(self):
        """Create database tables"""
        try:
            Base.metadata.create_all(self.engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}")
            raise
    
    def add_document(self, filename: str, document_type: str, file_path: str, file_size: int = None, file_extension: str = None) -> Document:
        """
        Add a document to the database
        
        Args:
            filename: Name of the document file
            document_type: Type of document (invoice or contract)
            file_path: Path to the document file
            file_size: Size of the file in bytes
            file_extension: File extension
            
        Returns:
            Document object
        """
        session = self.Session()
        try:
            document = Document(
                filename=filename,
                document_type=document_type,
                file_path=file_path,
                file_size=file_size,
                file_extension=file_extension
            )
            session.add(document)
            session.commit()
            logger.info(f"Document added to database: {filename}")
            return document
        except Exception as e:
            session.rollback()
            logger.error(f"Error adding document to database: {str(e)}")
            raise
        finally:
            session.close()
    
    def add_extracted_data(self, document_id: int, data: Dict[str, Any], extraction_method: str = "mixed", confidence_score: float = None) -> ExtractedData:
        """
        Add extracted data to the database
        
        Args:
            document_id: ID of the document
            data: Extracted data
            extraction_method: Method used for extraction
            confidence_score: Confidence score of extraction
            
        Returns:
            ExtractedData object
        """
        session = self.Session()
        try:
            extracted_data = ExtractedData(
                document_id=document_id,
                data=data,
                extraction_method=extraction_method,
                confidence_score=confidence_score
            )
            session.add(extracted_data)
            session.commit()
            logger.info(f"Extracted data added to database for document ID: {document_id}")
            return extracted_data
        except Exception as e:
            session.rollback()
            logger.error(f"Error adding extracted data to database: {str(e)}")
            raise
        finally:
            session.close()
    
    def add_quickbooks_record(self, document_id: int, quickbooks_id: str, record_type: str, sync_status: str = "success", sync_message: str = None) -> QuickBooksRecord:
        """
        Add QuickBooks record to the database
        
        Args:
            document_id: ID of the document
            quickbooks_id: ID in QuickBooks
            record_type: Type of record (invoice, vendor, customer, contract)
            sync_status: Status of synchronization
            sync_message: Message about synchronization
            
        Returns:
            QuickBooksRecord object
        """
        session = self.Session()
        try:
            quickbooks_record = QuickBooksRecord(
                document_id=document_id,
                quickbooks_id=quickbooks_id,
                record_type=record_type,
                sync_status=sync_status,
                sync_timestamp=datetime.utcnow(),
                sync_message=sync_message
            )
            session.add(quickbooks_record)
            session.commit()
            logger.info(f"QuickBooks record added to database for document ID: {document_id}")
            return quickbooks_record
        except Exception as e:
            session.rollback()
            logger.error(f"Error adding QuickBooks record to database: {str(e)}")
            raise
        finally:
            session.close()
    
    def get_document(self, document_id: int) -> Optional[Document]:
        """
        Get a document from the database
        
        Args:
            document_id: ID of the document
            
        Returns:
            Document object or None
        """
        session = self.Session()
        try:
            document = session.query(Document).filter(Document.id == document_id).first()
            return document
        except Exception as e:
            logger.error(f"Error getting document from database: {str(e)}")
            return None
        finally:
            session.close()
    
    def get_all_documents(self, document_type: str = None) -> List[Document]:
        """
        Get all documents from the database
        
        Args:
            document_type: Filter by document type (optional)
            
        Returns:
            List of Document objects
        """
        session = self.Session()
        try:
            query = session.query(Document)
            if document_type:
                query = query.filter(Document.document_type == document_type)
            documents = query.order_by(Document.processed_at.desc()).all()
            return documents
        except Exception as e:
            logger.error(f"Error getting all documents from database: {str(e)}")
            return []
        finally:
            session.close()
    
    def get_extracted_data(self, document_id: int) -> Optional[Dict[str, Any]]:
        """
        Get extracted data for a document
        
        Args:
            document_id: ID of the document
            
        Returns:
            Extracted data as dictionary or None
        """
        session = self.Session()
        try:
            extracted_data = session.query(ExtractedData).filter(ExtractedData.document_id == document_id).first()
            return extracted_data.data if extracted_data else None
        except Exception as e:
            logger.error(f"Error getting extracted data from database: {str(e)}")
            return None
        finally:
            session.close() 