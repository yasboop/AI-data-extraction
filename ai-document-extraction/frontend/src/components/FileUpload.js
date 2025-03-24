import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './FileUpload.css';
import { useNavigate } from 'react-router-dom';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
`;

const DocumentTypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TypeButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #3498db;
  background: ${props => props.selected ? '#3498db' : 'white'};
  color: ${props => props.selected ? 'white' : '#3498db'};
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.selected ? '#2980b9' : '#f0f8ff'};
  }
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s;
  
  &:hover {
    border-color: #3498db;
    background: #f8fbff;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #3498db;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 1rem;
  background: ${props => props.disabled ? '#cccccc' : '#3498db'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.disabled ? '#cccccc' : '#2980b9'};
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 2rem;
`;

const FileInfo = styled.div`
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 5px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const FileIcon = styled.div`
  margin-right: 1rem;
  font-size: 2rem;
  color: #3498db;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const FileSize = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docType, setDocType] = useState('invoice'); // Default doc type
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload PDF, JPG, PNG, or TXT files.`);
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError(`File is too large. Maximum size is 10MB.`);
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create file preview (for images only)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF and text files, don't create preview
      setPreview(null);
    }
  };
  
  // Handle file upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    return (bytes / 1024).toFixed(1) + ' KB';
  };
  
  // Handle document type selection
  const handleDocTypeSelect = (type) => {
    setDocType(type);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', docType);
    
    try {
      console.log('Uploading file to backend...');
      
      // Upload file to API with improved error handling
      const response = await axios.post('http://localhost:9003/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout
      });
      
      console.log('Upload successful:', response.data);
      
      // Add validation to ensure we have data
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }
      
      // Store the results in session storage with more detailed logging
      try {
        const dataToStore = JSON.stringify(response.data);
        console.log('Storing data in session storage:', dataToStore.substring(0, 100) + '...');
        
        // First clear any existing data
        sessionStorage.removeItem('extractionResult');
        
        // Then store the new data
        sessionStorage.setItem('extractionResult', dataToStore);
        
        // Force a small delay to ensure storage is complete
        console.log('Navigating to results page after short delay...');
        setTimeout(() => {
          console.log('About to navigate to /results');
          navigate('/results');
          console.log('Navigation command issued');
        }, 500);
      } catch (storageError) {
        console.error('Error storing data in session storage:', storageError);
        throw new Error('Failed to store extraction results');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        // Server responded with an error status
        console.error('Server error response:', error.response.data);
        setError(error.response.data?.detail || 'Server error: ' + error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Error setting up the request
        setError(error.message || 'An error occurred while uploading the file. Please try again.');
      }
      setLoading(false);
    }
  };
  
  return (
    <Container>
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <div>Processing document...</div>
        </LoadingOverlay>
      )}
      
      <Title>Upload Document for AI Extraction</Title>
      <Subtitle>Our AI system will extract structured data from your document</Subtitle>
      
      {/* Document Type Selection */}
      <DocumentTypeSelector>
        <TypeButton 
          selected={docType === 'invoice'} 
          onClick={() => handleDocTypeSelect('invoice')}
        >
          Invoice
        </TypeButton>
        <TypeButton 
          selected={docType === 'contract'} 
          onClick={() => handleDocTypeSelect('contract')}
        >
          Contract
        </TypeButton>
      </DocumentTypeSelector>
      
      {/* File Drop Zone */}
      <DropZone
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadButtonClick}
      >
        {!selectedFile ? (
          <>
            <UploadIcon>📄</UploadIcon>
            <p>Drag & drop a file or click to browse</p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Accepted file types: PDF, JPG, PNG, TXT (Max size: 10MB)
            </p>
          </>
        ) : (
          <FileInfo>
            <FileIcon>📄</FileIcon>
            <FileDetails>
              <FileName>{selectedFile.name}</FileName>
              <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
            </FileDetails>
          </FileInfo>
        )}
        <FileInput 
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.jpg,.jpeg,.png,.txt"
        />
      </DropZone>
      
      {/* Preview for image files */}
      {preview && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              borderRadius: '5px' 
            }} 
          />
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      
      {/* Submit Button */}
      <UploadButton
        onClick={handleSubmit}
        disabled={!selectedFile}
      >
        {loading ? 'Processing...' : 'Upload & Extract'}
      </UploadButton>
    </Container>
  );
}

export default FileUpload; 