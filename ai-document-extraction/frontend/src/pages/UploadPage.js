import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FileUpload from '../components/FileUpload';
import { checkApiHealth, uploadFileAndExtract } from '../utils/api';

const PageContainer = styled.div`
  padding: 4rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

const PageDescription = styled(motion.p)`
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
`;

const UploadContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  padding: 2rem;
`;

const ApiTestButton = styled.button`
  background-color: var(--secondary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: var(--secondary-hover);
  }
`;

const TestResult = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
`;

const UploadPage = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      // Test health endpoint
      const isHealthy = await checkApiHealth();
      
      if (isHealthy) {
        setTestResult(prev => prev + `\nHealth check response: API is healthy`);
        
        // Create a sample text file for testing
        const dummyFile = new File(
          ['Test invoice\nCompany: Test Corp\nAmount: $100.00'], 
          'test.txt', 
          { type: 'text/plain' }
        );
        
        setTestResult(prev => prev + `\nCreated test file: ${dummyFile.name} (${dummyFile.size} bytes)`);
        setTestResult(prev => prev + '\nSending test file to API...');
        
        // Use our API function
        const resultData = await uploadFileAndExtract(dummyFile);
        
        setTestResult(prev => prev + `\nAPI extraction successful!\nResult: ${JSON.stringify(resultData, null, 2)}`);
        toast.success('API test successful!');
      } else {
        setTestResult(prev => prev + `\nHealth check failed: API is not responding`);
        toast.error('API server is not running');
      }
    } catch (error) {
      console.error('API test error:', error);
      let errorMessage = error.message || 'API test failed';
      
      setTestResult(prev => prev + `\nError: ${errorMessage}`);
      toast.error(`API test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Upload Your Document
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Select a file to extract data using our AI-powered document processing system
          </PageDescription>
        </PageHeader>
        
        <UploadContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FileUpload />
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <ApiTestButton onClick={testApiConnection} disabled={isLoading}>
              {isLoading ? 'Testing...' : 'Test API Connection'}
            </ApiTestButton>
            
            {testResult && <TestResult>{testResult}</TestResult>}
          </div>
        </UploadContainer>
      </div>
    </PageContainer>
  );
};

export default UploadPage; 