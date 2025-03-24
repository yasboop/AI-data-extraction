import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 5rem;
  color: var(--warning-color);
  margin-bottom: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  color: var(--dark-color);
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 2.5rem;
`;

const GoHomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Oops! The page you're looking for doesn't exist.</ErrorMessage>
      <GoHomeButton to="/upload">
        <FaHome /> Go Home
      </GoHomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage; 