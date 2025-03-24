import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaFileAlt, FaRobot } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.75rem;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    transition: right 0.3s ease-in-out;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const NavItem = styled(Link)`
  margin: 0 1rem;
  font-weight: 500;
  color: var(--text-color);
  position: relative;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    margin: 1.5rem 0;
    font-size: 1.125rem;
  }
`;

const UploadButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: var(--primary-hover);
    color: white;
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const MobileIcon = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--primary-color);
  }
`;

const CloseIcon = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--primary-color);
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer>
      <div className="container">
        <NavContainer>
          <Logo to="/">
            <FaRobot />
            <span>AI Document Extraction</span>
          </Logo>
          
          <MobileIcon onClick={toggleMenu}>
            <FaBars />
          </MobileIcon>
          
          <NavMenu isOpen={isOpen}>
            <CloseIcon onClick={toggleMenu}>
              <FaTimes />
            </CloseIcon>
            
            <NavItem to="/" onClick={() => setIsOpen(false)}>
              Home
            </NavItem>
            <NavItem to="/about" onClick={() => setIsOpen(false)}>
              About
            </NavItem>
            
            <UploadButton to="/upload" onClick={() => setIsOpen(false)}>
              <FaFileAlt />
              Upload Document
            </UploadButton>
          </NavMenu>
        </NavContainer>
      </div>
    </HeaderContainer>
  );
};

export default Header; 