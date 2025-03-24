import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRobot, FaFileInvoiceDollar, FaChartLine, FaCloudUploadAlt } from 'react-icons/fa';

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

const AboutSections = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
`;

const AboutSection = styled(motion.div)`
  background-color: white;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
`;

const SectionContent = styled.div`
  font-size: 1.05rem;
  color: var(--text-color);
  line-height: 1.7;
  
  p {
    margin-bottom: 1.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-top: 1.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const AboutPage = () => {
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About AI Document Extraction
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Learn how our advanced AI technology can save you time and reduce errors in document processing
          </PageDescription>
        </PageHeader>
        
        <AboutSections>
          <AboutSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionHeader>
              <IconWrapper>
                <FaRobot />
              </IconWrapper>
              <SectionTitle>Our Technology</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>
                AI Document Extraction uses state-of-the-art artificial intelligence and machine learning 
                technologies to automatically extract structured data from various document types.
              </p>
              <p>
                Our system is powered by the latest natural language processing models, including the 
                Mistral AI API, which enables us to understand the content and context of your documents 
                with unprecedented accuracy.
              </p>
              <p>
                Unlike traditional OCR solutions, our AI can understand the semantic meaning of text in 
                documents, recognize patterns, and consistently extract the correct information even from 
                documents with varying layouts.
              </p>
            </SectionContent>
          </AboutSection>
          
          <AboutSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionHeader>
              <IconWrapper>
                <FaFileInvoiceDollar />
              </IconWrapper>
              <SectionTitle>Supported Documents</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>
                Our system currently supports the following document types:
              </p>
              <ul>
                <li><strong>Invoices:</strong> Extract invoice numbers, dates, vendor information, line items, total amounts, and tax details.</li>
                <li><strong>Receipts:</strong> Capture merchant details, purchase dates, item descriptions, prices, and total amounts.</li>
                <li><strong>Purchase Orders:</strong> Extract PO numbers, supplier information, order details, pricing, and delivery terms.</li>
              </ul>
              <p>
                We're constantly expanding our capabilities to support additional document types. If you have 
                specific document extraction needs, please contact us for custom solutions.
              </p>
            </SectionContent>
          </AboutSection>
          
          <AboutSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SectionHeader>
              <IconWrapper>
                <FaChartLine />
              </IconWrapper>
              <SectionTitle>Benefits</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>
                Using our AI Document Extraction system provides numerous advantages:
              </p>
              <ul>
                <li><strong>Save Time:</strong> Reduce manual data entry by up to 95%, freeing your team to focus on higher-value tasks.</li>
                <li><strong>Increase Accuracy:</strong> Minimize human errors and ensure consistent, reliable data extraction.</li>
                <li><strong>Process Automation:</strong> Integrate with your existing systems to automate your document workflows.</li>
                <li><strong>Cost Reduction:</strong> Lower operational costs associated with document processing and data entry.</li>
                <li><strong>Scalability:</strong> Handle increasing document volumes without adding headcount.</li>
              </ul>
            </SectionContent>
          </AboutSection>
          
          <AboutSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SectionHeader>
              <IconWrapper>
                <FaCloudUploadAlt />
              </IconWrapper>
              <SectionTitle>Get Started</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>
                Ready to experience the power of AI Document Extraction? Getting started is easy:
              </p>
              <ol>
                <li>Upload your document (PDF, JPG, PNG, or TXT format)</li>
                <li>Select the document type</li>
                <li>Our AI will process your document and extract the data</li>
                <li>View and download the extracted information</li>
              </ol>
              <p>
                Try it now with your documents and see how our AI can transform your document processing workflow.
              </p>
              <ActionButton to="/upload">
                Try It For Free
              </ActionButton>
            </SectionContent>
          </AboutSection>
        </AboutSections>
      </div>
    </PageContainer>
  );
};

export default AboutPage; 