import React from 'react';
import styled from 'styled-components';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import { Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </>
  );
};

// CTA Section
const CTAContainer = styled.div`
  background-color: var(--light-color);
  padding: 5rem 0;
`;

const CTACard = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  color: white;
  box-shadow: var(--card-shadow);
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CTAText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: white;
  color: var(--primary-color);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CTASection = () => {
  return (
    <CTAContainer>
      <div className="container">
        <CTACard>
          <CTATitle>Ready to Extract Your Document Data?</CTATitle>
          <CTAText>
            Start using our AI-powered document extraction tool today and save hours of manual data entry.
          </CTAText>
          <CTAButton to="/upload">
            <FaUpload />
            Upload Your Document
          </CTAButton>
        </CTACard>
      </div>
    </CTAContainer>
  );
};

export default HomePage; 