# Contract Extraction API Enhancements

## Recent Improvements

The contract extraction system has been enhanced with the following improvements:

1. **Robust Error Handling** 
   - All regex operations now have comprehensive error handling to prevent "no such group" errors
   - PDF extraction has been improved to handle extraction failures gracefully
   - Server startup and shutdown have been enhanced with proper port management

2. **Improved Regex Patterns**
   - Added safety checks for all regex group access
   - Made capturing groups optional where appropriate
   - Added robust validation of group existence before accessing

3. **Enhanced Contract Summary**
   - The system now generates detailed contract summaries 
   - Extracts key information like contract number, parties, dates, payment terms, etc.
   - Using Pixtral model for high-quality extraction

4. **AI First, Regex Augmentation**
   - Primary extraction is performed using the Pixtral AI model
   - Regex is used only as enhancement/augmentation, not as a fallback
   - The system merges AI and regex extraction for optimal results

## Using the API

### Starting the Server

```bash
cd "/Users/yashverma/AI data extraction/ai-document-extraction"
python run_server.py
```

The server will run on `http://localhost:9003`.

### Testing the API

You can test the API using the included test scripts:

```bash
python test_api.py
```

This will extract data from a contract file and save results to `api_test_result.json`.

### Frontend Access

The web frontend is available at `http://localhost:3000` and is configured to communicate with the API.

## Endpoints

- `GET /health` - Check API status
- `POST /extract` - Extract data from documents
  - Parameters:
    - `file`: The document file (PDF, TXT)
    - `document_type`: Type of document ("contract" or "invoice")

## Troubleshooting

If you encounter any issues:

1. Check server logs in `api_server.log`
2. Verify that the server is running with `curl http://localhost:9003/health`
3. Make sure you have all required libraries installed
4. For PDF extraction issues, ensure `pypdf` is properly installed

## Development Notes

The regex patterns used for contract extraction can be found in `utils/contract_extractor.py` in the `_extract_contract_with_regex` method. Enhance these patterns if you find specific fields aren't being extracted properly. 