import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:9003';

/**
 * Check if the API server is healthy
 * @returns {Promise<Object>} The health check response
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

/**
 * Uploads a file to the server and extracts data from it
 * @param {File} file - The file to upload
 * @param {string} documentType - The type of document (invoice or contract)
 * @returns {Promise<Object>} The extracted data
 */
export const uploadFileAndExtract = async (file, documentType = 'invoice') => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);

  try {
    // Make the API request
    const response = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      body: formData,
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Server returned ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error('Error extracting data:', error);
    throw new Error(error.message || 'Failed to extract data from document');
  }
};

/**
 * Process a document with demo data (used for testing without API)
 * @param {File} file - The file to process
 * @returns {Promise<Object>} Demo data for testing
 */
export const processDemoDocument = async (file) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return different data based on file type
  const fileType = file.type;
  
  if (fileType.includes('pdf')) {
    return {
      filename: file.name,
      document_type: 'invoice',
      invoice_number: 'INV-2023-4721',
      supplier_name: 'TECH SOLUTIONS INC.',
      invoice_date: 'November 15, 2023',
      total_amount: '2,500.00',
      vat_amount: '250.00',
      payment_due_date: 'December 15, 2023',
      extraction_method: 'demo'
    };
  } else if (fileType.includes('image')) {
    return {
      filename: file.name,
      document_type: 'receipt',
      merchant_name: 'COFFEE SHOP',
      date: 'March 20, 2025',
      total_amount: '12.85',
      items: ['Cappuccino - $4.50', 'Croissant - $3.75', 'Fruit Salad - $4.60'],
      payment_method: 'Credit Card',
      extraction_method: 'demo'
    };
  } else {
    return {
      filename: file.name,
      document_type: 'document',
      extracted_text: 'Sample extracted text from document',
      date: 'January 1, 2025',
      extraction_method: 'demo'
    };
  }
}; 