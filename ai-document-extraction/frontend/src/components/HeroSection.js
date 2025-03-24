import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFileAlt } from 'react-icons/fa';

const HeroContainer = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
  color: white;
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroText = styled.div`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: white;
  color: var(--primary-color);
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const SecondaryButton = styled(Link)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const HeroImage = styled(motion.div)`
  flex: 1;
  max-width: 550px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const Shapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
`;

const Shape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const Shape1 = styled(Shape)`
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
`;

const Shape2 = styled(Shape)`
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
`;

const Shape3 = styled(Shape)`
  width: 150px;
  height: 150px;
  top: 50%;
  right: 15%;
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <Shapes>
        <Shape1 />
        <Shape2 />
        <Shape3 />
      </Shapes>
      
      <div className="container">
        <HeroContent>
          <HeroText>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Extract Document Data with AI
            </HeroTitle>
            
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Automatically extract and process key information from invoices, receipts, and other documents using advanced AI technology.
            </HeroSubtitle>
            
            <ButtonGroup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PrimaryButton to="/upload">
                Get Started <FaArrowRight />
              </PrimaryButton>
              <SecondaryButton to="/about">
                <FaFileAlt /> Learn More
              </SecondaryButton>
            </ButtonGroup>
          </HeroText>
          
          <HeroImage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1589330273594-fade1ee91647?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
              alt="Document Extraction" 
            />
          </HeroImage>
        </HeroContent>
      </div>
    </HeroContainer>
  );
};

export default HeroSection; 