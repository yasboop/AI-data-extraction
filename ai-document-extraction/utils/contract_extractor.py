import os
import json
import logging
import re
from typing import Dict, Any, Optional, List, Tuple
import httpx

from utils.ai_extractor import AIExtractor

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedContractExtractor(AIExtractor):
    """
    Enhanced extractor class for contracts with specialized extraction and summary generation.
    Extends the base AIExtractor with contract-specific capabilities.
    """
    
    def extract_data(self, document_content: str, document_type: str, image_path: str = None) -> Dict[str, Any]:
        """
        Override the base extraction method to add contract-specific enhancements
        
        Parameters:
        - document_content: Text content of the document
        - document_type: Type of document (contract in this case)
        - image_path: Optional path to the document image for multimodal extraction
        
        Returns:
        - Dictionary of extracted fields including summary for contracts
        """
        # Only apply special handling for contracts
        if document_type != "contract":
            return super().extract_data(document_content, document_type, image_path)
        
        logger.info("Using enhanced contract extraction with AI as primary method and regex augmentation")
        
        # First perform AI extraction as the primary method
        extracted_data = {}
        
        # Always attempt AI extraction
        try:
            # Select the appropriate AI model based on configuration
            if self.model == "pixtral" and image_path and os.path.exists(image_path):
                extracted_data = self._extract_with_pixtral(document_content, document_type, image_path)
                logger.info("Successfully extracted contract data with Pixtral multimodal model")
            elif self.model == "pixtral":
                extracted_data = self._extract_with_pixtral(document_content, document_type)
                logger.info("Successfully extracted contract data with Pixtral text model")
            else:
                extracted_data = self._extract_with_mistral(document_content, document_type)
                logger.info("Successfully extracted contract data with Mistral model")
                
        except Exception as e:
            logger.error(f"Error in AI contract extraction: {str(e)}")
            # Initialize a basic empty dictionary - will be augmented with regex results
            extracted_data = {
                "contract_number": None,
                "client_name": None,
                "service_provider": None,
                "start_date": None,
                "end_date": None,
                "payment_terms": {"amount": None, "schedule": None, "methods": None},
                "renewal_clause": None,
                "legal_obligations": {"client": [], "service_provider": []},
                "termination_conditions": None,
                "signatures": {"signing_date": None}
            }
        
        # Use regex as augmentation to enhance the AI extraction results
        logger.info("Applying regex pattern augmentation to enhance AI extraction results")
        regex_extracted_data = self._extract_contract_with_regex(document_content)
        
        # Apply regex augmentation to fill gaps and enhance AI results
        self._augment_with_regex(extracted_data, regex_extracted_data)
        
        # Generate a summary of the contract
        extracted_data["summary"] = self._generate_contract_summary(document_content, extracted_data)
        
        return extracted_data
    
    def _augment_with_regex(self, ai_data: Dict[str, Any], regex_data: Dict[str, Any]) -> None:
        """
        Augment AI extraction results with regex extraction results
        Regex is used to fill in gaps or enhance existing fields, not to replace AI results
        
        Parameters:
        - ai_data: Data extracted by AI (modified in place)
        - regex_data: Data extracted by regex patterns
        """
        logger.debug("Augmenting AI extraction with regex patterns")
        
        for key, value in regex_data.items():
            # Skip null regex values
            if value is None:
                continue
                
            # For complex fields like payment_terms, legal_obligations, signatures
            if isinstance(value, dict) and key in ai_data and isinstance(ai_data[key], dict):
                for subkey, subvalue in value.items():
                    # Augment if AI didn't extract this subfield
                    if subkey not in ai_data[key] or not ai_data[key][subkey]:
                        ai_data[key][subkey] = subvalue
                        logger.debug(f"Augmented AI data with regex for {key}.{subkey}")
                    
            # For list fields within dictionaries (e.g., legal_obligations)
            elif isinstance(value, dict) and key == "legal_obligations" and key in ai_data:
                for party, obligations in value.items():
                    if party in ai_data[key] and isinstance(obligations, list):
                        # Add any regex-detected obligations not already in the AI results
                        ai_obligations = set(ai_data[key][party]) if ai_data[key][party] else set()
                        for obligation in obligations:
                            if obligation and obligation not in ai_obligations:
                                ai_data[key][party].append(obligation)
                                logger.debug(f"Added regex-detected obligation for {party}")
                                
            # For simple fields, use regex only if AI didn't find a value
            elif key not in ai_data or ai_data[key] is None or ai_data[key] == "":
                ai_data[key] = value
                logger.debug(f"Filled missing AI field {key} with regex result")
    
    def _extract_contract_with_regex(self, text: str) -> Dict[str, Any]:
        """Extract contract data using regular expressions for common patterns"""
        logger.debug("Attempting direct regex extraction for contract")
        
        # Initialize result dictionary with contract fields
        result = {
            "contract_number": None,
            "client_name": None,
            "service_provider": None,
            "start_date": None,
            "end_date": None,
            "payment_terms": {"amount": None, "schedule": None, "methods": None},
            "renewal_clause": None,
            "legal_obligations": {"client": [], "service_provider": []},
            "termination_conditions": None,
            "signatures": {"signing_date": None}
        }
        
        try:
            # Common regex patterns for contract fields
            patterns = {
                "contract_number": [
                    r"(?i)CONTRACT\s+NUMBER:?\s*([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)",
                    r"(?i)CONTRACT\s+(?:NO|NUMBER|#):?\s*([A-Z0-9\-]+)"
                ],
                "client_name": [
                    r"(?i)Between:[\s\n]*([A-Za-z0-9\s]+)(?:\s*\(.*?Client.*?\))?",
                    r"(?i)CLIENT:?\s*([A-Za-z0-9\s,\.]+)",
                    r"(?i)(?:CLIENT|CUSTOMER):?\s*([A-Za-z0-9\s]+(?:Ltd\.?|LLC|Inc\.?|Corporation|Corp\.?|GmbH)?)"
                ],
                "service_provider": [
                    r"(?i)And:[\s\n]*([A-Za-z0-9\s]+)(?:\s*\(.*?Service Provider.*?\))?",
                    r"(?i)SERVICE\s+PROVIDER:?\s*([A-Za-z0-9\s,\.]+)",
                    r"(?i)(?:SERVICE\s+PROVIDER|VENDOR|SUPPLIER):?\s*([A-Za-z0-9\s]+(?:Ltd\.?|LLC|Inc\.?|Corporation|Corp\.?|GmbH)?)"
                ],
                "start_date": [
                    r"(?i)START\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
                    r"(?i)EFFECTIVE\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
                    r"(?i)COMMENCEMENT\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})"
                ],
                "end_date": [
                    r"(?i)END\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
                    r"(?i)EXPIRATION\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
                    r"(?i)TERMINATION\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})"
                ],
                "payment_terms_text": [
                    r"(?i)PAYMENT\s+TERMS:?\s*([^\n.]+(?:\n[^\n.]+)*)",
                    r"(?i)PAYMENT:?\s*([^\n.]+(?:\n[^\n.]+)*)"
                ],
                "renewal_clause": [
                    r"(?i)RENEWAL(?:\s+CLAUSE)?:?\s*([^\n.]+(?:\n[^\n.]+)*)",
                    r"(?i)CONTRACT\s+RENEWAL:?\s*([^\n.]+(?:\n[^\n.]+)*)"
                ],
                "termination_conditions": [
                    r"(?i)TERMINATION(?:\s+CONDITIONS)?:?\s*([^\n.]+(?:\n[^\n.]+)*)",
                    r"(?i)(?:CONTRACT\s+)?TERMINATION:?\s*([^\n.]+(?:\n[^\n.]+)*)"
                ],
                "client_obligations": [
                    r"(?i)CLIENT\s+OBLIGATIONS:?\s*([^\n.]+(?:\n[^\n.]+)*)",
                    r"(?i)OBLIGATIONS\s+OF\s+(?:THE\s+)?CLIENT:?\s*([^\n.]+(?:\n[^\n.]+)*)"
                ],
                "service_provider_obligations": [
                    r"(?i)(?:SERVICE\s+PROVIDER|SUPPLIER|VENDOR)\s+OBLIGATIONS:?\s*([^\n.]+(?:\n[^\n.]+)*)",
                    r"(?i)OBLIGATIONS\s+OF\s+(?:THE\s+)?(?:SERVICE\s+PROVIDER|SUPPLIER|VENDOR):?\s*([^\n.]+(?:\n[^\n.]+)*)"
                ],
                "signatures_client": [
                    r"(?i)(?:CLIENT|CUSTOMER)\s+SIGNATURE:?\s*([A-Za-z\s,\.]+)",
                    r"(?i)FOR\s+(?:THE\s+)?(?:CLIENT|CUSTOMER):?\s*([A-Za-z\s,\.]+)"
                ],
                "signatures_provider": [
                    r"(?i)(?:SERVICE\s+PROVIDER|SUPPLIER|VENDOR)\s+SIGNATURE:?\s*([A-Za-z\s,\.]+)",
                    r"(?i)FOR\s+(?:THE\s+)?(?:SERVICE\s+PROVIDER|SUPPLIER|VENDOR):?\s*([A-Za-z\s,\.]+)"
                ],
                "signatures_date": [
                    r"(?i)(?:SIGNING|SIGNATURE)\s+DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
                    r"(?i)DATE:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})"
                ]
            }
            
            # Extract simple fields using regex patterns
            for field, field_patterns in patterns.items():
                for pattern in field_patterns:
                    try:
                        match = re.search(pattern, text)
                        if match and match.groups():  # Ensure there are capture groups
                            if field == "payment_terms_text":
                                # Process payment terms into structured data
                                payment_text = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if payment_text:
                                    result["payment_terms"] = self._extract_payment_terms(payment_text)
                            elif field == "client_obligations":
                                # Add to obligations list
                                obligations = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if obligations:
                                    # Split by commas, semicolons, or line breaks
                                    items = re.split(r'[,;\n]', obligations)
                                    result["legal_obligations"]["client"] = [item.strip() for item in items if item.strip()]
                            elif field == "service_provider_obligations":
                                # Add to obligations list
                                obligations = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if obligations:
                                    # Split by commas, semicolons, or line breaks
                                    items = re.split(r'[,;\n]', obligations)
                                    result["legal_obligations"]["service_provider"] = [item.strip() for item in items if item.strip()]
                            elif field == "signatures_client":
                                signature = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if signature:
                                    if not isinstance(result["signatures"], dict):
                                        result["signatures"] = {"signing_date": None}
                                    result["signatures"]["client"] = signature
                            elif field == "signatures_provider":
                                signature = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if signature:
                                    if not isinstance(result["signatures"], dict):
                                        result["signatures"] = {"signing_date": None}
                                    result["signatures"]["service_provider"] = signature
                            elif field == "signatures_date":
                                date = match.group(1).strip() if len(match.groups()) >= 1 else ""
                                if date:
                                    if not isinstance(result["signatures"], dict):
                                        result["signatures"] = {}
                                    result["signatures"]["signing_date"] = date
                            else:
                                # For simple fields, just extract the value
                                if len(match.groups()) >= 1:  # Make sure there's at least one group
                                    result[field] = match.group(1).strip()
                            break
                    except (IndexError, re.error) as e:
                        # Regex error - log and continue
                        logger.warning(f"Regex error for pattern '{pattern}': {str(e)}")
                        continue
            
            # Fallback to extract client and service provider from the beginning of the contract if not found
            if not result["client_name"] or not result["service_provider"]:
                try:
                    # Look for "Between: [Company A] ... And: [Company B]" pattern
                    between_and_pattern = r"(?i)Between:[\s\n]*([A-Za-z0-9\s,\.]+)[\s\S]*?And:[\s\n]*([A-Za-z0-9\s,\.]+)"
                    match = re.search(between_and_pattern, text[:500])  # Only search in the first 500 chars
                    if match and len(match.groups()) >= 2:
                        if not result["client_name"] and len(match.groups()) >= 1:
                            result["client_name"] = match.group(1).strip()
                        if not result["service_provider"] and len(match.groups()) >= 2:
                            result["service_provider"] = match.group(2).strip()
                except (IndexError, re.error) as e:
                    logger.warning(f"Regex error in between-and fallback: {str(e)}")
        
        except Exception as e:
            logger.error(f"Unexpected error in regex extraction: {str(e)}")
            # Return empty results to prevent breaking the extraction process
        
        logger.info(f"Regex extraction results for contract: {result}")
        return result
        
    def _extract_payment_terms(self, payment_text: str) -> Dict[str, str]:
        """Extract structured payment information from text"""
        result = {
            "amount": None,
            "schedule": None,
            "methods": None
        }
        
        try:
            # Extract amount
            amount_pattern = r"(?i)(?:amount|fee|cost|price)(?:\s+of)?:?\s*(\$?[\d,]+(?:\.\d+)?(?:\s*[A-Za-z]+)?|\w+\s+(?:thousand|million|billion)(?:\s+dollars)?)"
            amount_match = re.search(amount_pattern, payment_text)
            if amount_match and amount_match.groups() and len(amount_match.groups()) >= 1:
                result["amount"] = amount_match.group(1).strip()
            
            # Extract schedule
            schedule_pattern = r"(?i)(?:schedule|frequency|payment\s+terms|payment\s+schedule|paid):?\s*(\w+(?:\s+\w+){0,5})"
            schedule_match = re.search(schedule_pattern, payment_text)
            if schedule_match and schedule_match.groups() and len(schedule_match.groups()) >= 1:
                result["schedule"] = schedule_match.group(1).strip()
            
            # Extract payment methods
            methods_pattern = r"(?i)(?:method|payment\s+method|pay(?:able)?\s+by):?\s*(\w+(?:\s+\w+){0,5})"
            methods_match = re.search(methods_pattern, payment_text)
            if methods_match and methods_match.groups() and len(methods_match.groups()) >= 1:
                result["methods"] = methods_match.group(1).strip()
        except Exception as e:
            logger.warning(f"Error extracting payment terms: {str(e)}")
            
        return result
    
    def _generate_extraction_prompt(self, document_type: str) -> str:
        """Override to provide enhanced contract extraction prompt"""
        if document_type == "contract":
            return """
            Extract the following information from this contract document and return it as a JSON object:
            - contract_number: The unique identifier for this contract
            - client_name: The name of the client or customer organization
            - service_provider: The name of the service provider or vendor
            - start_date: The date the contract begins
            - end_date: The date the contract ends or expires
            - payment_terms: Full details about payment amounts, schedule, and methods
            - renewal_clause: The specific terms for contract renewal
            - legal_obligations: Key legal obligations for both parties
            - termination_conditions: Details about how the contract can be terminated
            - signatures: Information about the signatories and signing date
            
            Ensure all fields are returned in the JSON structure. If a field is not found, set its value to null.
            Pay special attention to:
            1. The contract details at the beginning of the document
            2. Sections specifically labeled with terms, payment, renewal, etc.
            3. Obligations of each party
            4. Termination and renewal conditions
            
            For complex fields like legal_obligations and payment_terms, provide detailed information.
            Return ONLY the JSON object and nothing else.
            """
        else:
            return super()._generate_extraction_prompt(document_type)
    
    def _generate_contract_summary(self, document_content: str, extracted_data: Dict[str, Any]) -> str:
        """
        Generate a human-readable summary of the contract
        
        Parameters:
        - document_content: The original document text
        - extracted_data: The extracted structured data
        
        Returns:
        - A concise summary of the key contract points
        """
        logger.info("Generating contract summary")
        
        try:
            # Prepare prompt for summary generation
            prompt = f"""
            Generate a clear, concise executive summary of this contract in 3-5 paragraphs.
            Focus on the most important elements of the agreement:
            
            1. Who are the parties involved and what is the purpose of this contract?
            2. What are the key deliverables or services?
            3. What are the financial terms and payment schedule?
            4. What is the timeframe (start and end dates)?
            5. What are the most important obligations for each party?
            6. What are the key termination and renewal conditions?
            
            Make the summary actionable for business stakeholders by highlighting any important deadlines, 
            required actions, and potential risks. Keep your summary objective and fact-based.
            
            Here's the data extracted from the contract:
            {json.dumps(extracted_data, indent=2)}
            
            Original contract text:
            {document_content[:3000]}  # Truncate if too long
            """
            
            # Use the appropriate model for summary generation
            if self.model == "pixtral" and self.mistral_api_key:
                # Use Pixtral for summary generation if available
                response = httpx.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.mistral_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "pixtral-12b",
                        "messages": [
                            {"role": "system", "content": "You are a legal expert who creates clear, professional contract summaries for business executives."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.1,  # Lower temperature for more factual output
                        "max_tokens": 1000
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                result = response.json()
                summary = result["choices"][0]["message"]["content"]
            else:
                # Fallback to Mistral
                response = httpx.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.mistral_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "mistral-large-latest",
                        "messages": [
                            {"role": "system", "content": "You are a legal expert who creates clear, professional contract summaries for business executives."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.1,
                        "max_tokens": 1000
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                result = response.json()
                summary = result["choices"][0]["message"]["content"]
                
            logger.info("Successfully generated contract summary")
            return summary
            
        except Exception as e:
            logger.error(f"Error generating contract summary: {str(e)}")
            # Provide a basic summary based on extracted data if AI summarization fails
            basic_summary = f"""
            Contract {extracted_data.get('contract_number', 'unknown')} between 
            {extracted_data.get('service_provider', 'unknown')} and {extracted_data.get('client_name', 'unknown')}.
            Valid from {extracted_data.get('start_date', 'unknown')} to {extracted_data.get('end_date', 'unknown')}.
            """
            return basic_summary.strip() 