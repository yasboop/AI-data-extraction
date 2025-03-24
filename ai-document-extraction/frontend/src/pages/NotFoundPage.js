import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  padding: 5rem 0;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundContent = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
`;

const Icon = styled.div`
  font-size: 5rem;
  color: var(--warning-color);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2.5rem;
`;

const HomeButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon>
          <FaExclamationTriangle />
        </Icon>
        <Title>404</Title>
        <Subtitle>Oops! The page you're looking for doesn't exist.</Subtitle>
        <HomeButton to="/">
          <FaHome /> Go Home
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage; 