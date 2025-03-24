# AI Document Extraction System

This project is an AI-powered document extraction system that can analyze and extract structured information from various types of documents, particularly invoices and contracts.

## Features

- AI-powered document analysis using Pixtral and Mistral models
- Support for both text and image-based documents
- Structured data extraction from invoices and contracts
- Browser extension integration for web-based document processing
- MCP (Message Control Protocol) server for communication

## Project Structure

```
.
├── ai-document-extraction/     # Main AI extraction module
├── browsertools_extension/     # Chrome extension for browser integration
├── sample_documents/          # Sample documents for testing
├── test_document_extraction.py # Test suite for document extraction
└── browser_tools_setup.html   # Setup guide for browser tools
```

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   - Create a `.env` file with your API keys:
     ```
     MISTRAL_API_KEY=your_mistral_api_key
     ANTHROPIC_API_KEY=your_anthropic_api_key
     ```

3. Install the Chrome extension:
   - Follow the instructions in `browser_tools_setup.html`

4. Start the MCP server:
   ```bash
   npx @agentdeskai/browser-tools-server@1.2.0
   ```

## Usage

1. Run the test suite:
   ```bash
   python test_document_extraction.py
   ```

2. Use the Chrome extension to process web-based documents

## License

MIT License 