# AI Document Extraction - FINAL INSTRUCTIONS

Follow these exact steps to get everything working:

## Step 1: Quit PowerShell and Open Terminal

1. First, completely quit PowerShell
2. Open Terminal.app from Applications/Utilities or using Spotlight (Command+Space, type "Terminal")

## Step 2: Run the Fix Script

Once in Terminal, run these commands:

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction"
chmod +x fixeverything.sh
./fixeverything.sh
```

This script will:
- Kill any existing server processes
- Free up port 9003
- Check for required Python packages and install if needed
- Create a test contract file if missing
- Start the server
- Run tests to verify everything works

## Step 3: Start the Frontend

In a new Terminal window, run:

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction/frontend"
npm start
```

This will start the React frontend at http://localhost:3000

## Step 4: Using the System

1. Access the web interface at http://localhost:3000
2. Upload contract documents (PDF, TXT, JPG, PNG)
3. Select "contract" as the document type
4. View the extracted data including:
   - Contract number
   - Client name
   - Service provider
   - Dates
   - Payment terms
   - Renewal terms
   - Legal obligations
   - And more!

## What We Fixed

1. Regex "no such group" errors in the contract extractor
2. PDF extraction issues with proper error handling
3. Server port management issues
4. PowerShell rendering problems (by switching to bash)

## Troubleshooting

If you encounter any issues:

1. Check the logs in `api_server.log`
2. Make sure the server is running (curl http://localhost:9003/health)
3. Run the test script manually to check extraction: `python test_api.py`

## Additional Resources

- Contract extraction logic is in `utils/contract_extractor.py`
- API implementation is in `src/simple_api.py`
- Test data is available in the `uploads` folder 