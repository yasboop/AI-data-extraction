import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ResultDisplay from '../components/ResultDisplay';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f7f9fc;
`;

const ResultsContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ErrorContainer = styled.div`
  background-color: #fff3f0;
  border: 1px solid #ffccc7;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  color: #ff4d4f;
`;

const ResultsPage = () => {
  const [extractionData, setExtractionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('ResultsPage: Loading data from session storage');
    
    try {
      // Get data from session storage
      const storedData = sessionStorage.getItem('extractionResult');
      
      if (!storedData) {
        console.error('No extraction data found in session storage');
        setError('No extraction data found. Please upload a document first.');
        return;
      }
      
      console.log('Retrieved data from session storage');
      
      try {
        // Parse the JSON data
        const parsedData = JSON.parse(storedData);
        
        // Check if the data has the expected structure
        if (!parsedData || !parsedData.data) {
          console.error('Invalid data format in session storage');
          setError('The extraction data is in an invalid format. Please try again.');
          return;
        }
        
        console.log('Successfully parsed extraction data');
        setExtractionData(parsedData.data);
      } catch (parseError) {
        console.error('Error parsing JSON from session storage:', parseError);
        setError('Error loading results. Please try again.');
      }
    } catch (err) {
      console.error('Error accessing session storage:', err);
      setError('Could not access stored results. Please try again.');
    }
  }, []);
  
  const handleReset = () => {
    navigate('/');
  };
  
  return (
    <PageContainer>
      <ResultsContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NavigationBar>
          <Button onClick={handleReset}>← Upload New Document</Button>
        </NavigationBar>
        
        {error && (
          <ErrorContainer>
            <h3>Error</h3>
            <p>{error}</p>
          </ErrorContainer>
        )}
        
        {extractionData && (
          <ResultDisplay data={extractionData} onReset={handleReset} />
        )}
      </ResultsContainer>
    </PageContainer>
  );
};

export default ResultsPage; 