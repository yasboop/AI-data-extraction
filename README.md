# AI Document Extraction System

A powerful AI-powered system for extracting structured information from documents, particularly invoices and contracts. The system uses advanced AI models (Pixtral and Mistral) to analyze documents and extract key information with high accuracy.

## Features

- **AI-Powered Extraction**: Uses state-of-the-art AI models (Pixtral and Mistral) for accurate information extraction
- **Multiple Document Types**: Supports various document types including invoices and contracts
- **Structured Output**: Extracts information in a structured format (JSON, CSV, TXT)
- **Flexible Input**: Works with both text and image-based documents
- **Configurable**: Easy to configure for different document types and fields

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-document-extraction.git
   cd ai-document-extraction
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with your API keys:
   ```
   MISTRAL_API_KEY=your_mistral_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

## Usage

### Basic Usage

```python
from utils.ai_extractor import AIExtractor

# Initialize the extractor
extractor = AIExtractor(model="pixtral")  # or "mistral"

# Extract data from a document
result = extractor.extract_data(
    document_content="Your document text here",
    document_type="invoice"  # or "contract"
)

# Print the extracted information
print(result)
```

### Supported Document Types

1. **Invoices**
   - Invoice number
   - Supplier name
   - Invoice date
   - Total amount
   - VAT amount
   - Payment due date

2. **Contracts**
   - Contract number
   - Client name
   - Start date
   - End date
   - Payment terms
   - Renewal clause
   - Key obligations

## Project Structure

```
.
├── ai-document-extraction/     # Main package directory
│   ├── utils/                 # Utility functions and core classes
│   ├── config/               # Configuration files
│   └── data/                 # Data directories
├── sample_documents/         # Sample documents for testing
└── test_document_extraction.py # Test suite
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 