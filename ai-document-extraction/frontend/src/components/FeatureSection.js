import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMagic, FaCloudUploadAlt, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';

const FeaturesContainer = styled.div`
  padding: 4rem 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: 1rem;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-hover-shadow);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  text-align: center;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 1.125rem;
`;

const features = [
  {
    icon: <FaMagic />,
    title: 'AI-Powered Extraction',
    description: 'Our state-of-the-art AI technology automatically extracts key information from your documents with high accuracy.',
  },
  {
    icon: <FaCloudUploadAlt />,
    title: 'Simple Upload Process',
    description: 'Just drag and drop your documents. We support various formats including PDF, JPG, PNG, and TXT files.',
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: 'Multi-Document Support',
    description: 'Process various document types including invoices, receipts, purchase orders, and more.',
  },
  {
    icon: <FaChartLine />,
    title: 'Instant Results',
    description: 'Get your data extracted immediately. Download results as JSON or integrate with your systems.',
  },
];

const FeatureSection = () => {
  return (
    <FeaturesContainer>
      <div className="container">
        <SectionTitle>Powerful Features</SectionTitle>
        <SectionSubtitle>
          Simplify your document processing workflow with our advanced AI-powered extraction tools
        </SectionSubtitle>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </div>
    </FeaturesContainer>
  );
};

export default FeatureSection; 