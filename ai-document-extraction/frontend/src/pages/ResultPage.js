import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ResultDisplay from '../components/ResultDisplay';

const ResultPageContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 18px;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
`;

const ResultPage = () => {
  // Get extraction data from location state
  const location = useLocation();
  const extractedData = location.state?.extractedData;
  
  // If there's no extraction data, redirect to upload page
  if (!extractedData) {
    return <Navigate to="/upload" replace />;
  }
  
  return (
    <ResultPageContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle>Document Extraction Results</PageTitle>
        <PageDescription>
          View the structured data extracted from your document using AI and multimodal analysis.
        </PageDescription>
      </PageHeader>
      
      <ResultDisplay data={extractedData} />
    </ResultPageContainer>
  );
};

export default ResultPage; 