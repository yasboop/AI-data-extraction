import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: white;
  padding: 2.5rem 0 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--dark-color);
`;

const FooterLink = styled(Link)`
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--light-color);
  color: var(--primary-color);
  margin-right: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: #6b7280;
  font-size: 0.875rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <SectionTitle>AI Document Extraction</SectionTitle>
            <p>
              Automatically extract important information from invoices, receipts, and other 
              documents using state-of-the-art AI technology.
            </p>
            <SocialIcons>
              <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </SocialIcon>
            </SocialIcons>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Quick Links</SectionTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/upload">Upload Document</FooterLink>
            <FooterLink to="/about">About</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Support</SectionTitle>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </FooterSection>
        </FooterContent>
        
        <Copyright>
          &copy; {currentYear} AI Document Extraction. All rights reserved.
        </Copyright>
      </div>
    </FooterContainer>
  );
};

export default Footer; 