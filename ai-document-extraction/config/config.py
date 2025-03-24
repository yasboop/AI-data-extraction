import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_DIR = os.path.join(PROJECT_ROOT, "data", "input")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data", "output")

# Document types and their required fields
DOCUMENT_TYPES = {
    "invoice": {
        "fields": [
            "invoice_number",
            "supplier_name",
            "invoice_date",
            "total_amount",
            "vat_amount",
            "payment_due_date"
        ]
    },
    "contract": {
        "fields": [
            "contract_number",
            "client_name",
            "start_date",
            "end_date",
            "payment_terms",
            "renewal_clause",
            "key_obligations"
        ]
    }
}

# Available AI models
AVAILABLE_MODELS = ["mistral", "pixtral"]

# Default AI model (if not specified)
DEFAULT_AI_MODEL = "pixtral"  # Change to pixtral to use multimodal capabilities

# Output formats
OUTPUT_FORMATS = ["json", "csv", "txt"]

# API Settings
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))

# QuickBooks Settings
QUICKBOOKS_API_KEY = os.getenv("QUICKBOOKS_API_KEY")
QUICKBOOKS_CLIENT_ID = os.getenv("QUICKBOOKS_CLIENT_ID")
QUICKBOOKS_CLIENT_SECRET = os.getenv("QUICKBOOKS_CLIENT_SECRET")
QUICKBOOKS_COMPANY_ID = os.getenv("QUICKBOOKS_COMPANY_ID")
QUICKBOOKS_REDIRECT_URI = os.getenv("QUICKBOOKS_REDIRECT_URI")

# Database Settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_document_extraction.db")  # Default to SQLite for development

# Vercel Settings
IS_VERCEL = os.getenv("VERCEL", False)
VERCEL_ENV = os.getenv("VERCEL_ENV", "development")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")  # For file storage in production 