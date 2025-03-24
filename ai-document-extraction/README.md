# AI Document Extraction System

This system extracts structured data from documents (invoices and contracts) using AI (Pixtral model) with regex pattern augmentation for enhanced accuracy.

## Features

- Extract invoice data including invoice number, issue date, due date, total amount, etc.
- Extract contract information including contract number, parties, dates, terms, etc.
- Generate comprehensive contract summaries
- Process PDF, text, and image files
- Web-based frontend for easy document upload
- RESTful API for programmatic access

## Quick Start

### Running on macOS

1. Open Terminal (not PowerShell) by searching for "Terminal" in Spotlight
2. Run the server:

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction"
./start_server.sh
```

3. In a new terminal window, start the frontend:

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction/frontend"
npm start
```

4. Access the web interface at http://localhost:3000

### API Usage

The main API endpoint is available at http://localhost:9003/extract

You can test it with:

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction"
python test_api.py
```

## Files in this Project

- `start_server.sh` - Script to reliably start the API server
- `run_server.py` - Server initialization script
- `src/simple_api.py` - FastAPI implementation for document extraction
- `utils/contract_extractor.py` - Enhanced contract extraction logic
- `utils/ai_extractor.py` - Base AI extraction capabilities
- `test_api.py` - Test script for API endpoints

## Troubleshooting

If you encounter "no such group" errors or other issues:

1. Check that the server is running with `curl http://localhost:9003/health`
2. Verify the API logs at `api_server.log`
3. Make sure your contract documents are in a standard format
4. Run the `test_api.py` script to check extraction capabilities
5. Kill any existing server processes and restart if needed

## Technical Details

- The system uses the Pixtral model for AI extraction and generates summaries
- Regex patterns augment (not replace) AI extraction results
- Error handling is robust to prevent "no such group" errors and other issues
- PDF processing uses pypdf library with intelligent error handling
- Server management includes port checking and process cleanup

## Project Structure

```
ai-document-extraction/
├── config/               # Configuration files
├── data/                 # Data storage
│   ├── input/            # Uploaded document storage
│   └── output/           # Extraction results
├── frontend/             # React frontend application
├── models/               # Database models
├── src/                  # API source code
├── utils/                # Utility functions
├── .env                  # Environment variables (private)
├── .env.example          # Example environment file
├── requirements.txt      # Python dependencies
├── run_server.py         # API server runner
├── run_webapp.py         # Flask web app runner
└── vercel.json           # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-document-extraction.git
   cd ai-document-extraction
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy the example environment file and fill in your API keys:
   ```
   cp .env.example .env
   ```

5. Run the API server:
   ```
   python run_server.py
   ```

   The API server will start at http://localhost:9001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The frontend will be available at http://localhost:3000

## Using the Application

1. Access the web interface at http://localhost:3000
2. Upload a document (invoice, receipt, or purchase order)
3. Select the document type
4. Click "Extract Data"
5. View and download the extracted information

## API Endpoints

- `GET /health` - Check API health
- `POST /extract` - Extract data from a document

## Technologies Used

- **Backend**:
  - FastAPI
  - Mistral AI
  - SQLAlchemy
  - Python

- **Frontend**:
  - React
  - styled-components
  - React Router
  - Framer Motion
  - React Dropzone

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mistral AI for their powerful AI models
- The Python and React communities for their excellent libraries 