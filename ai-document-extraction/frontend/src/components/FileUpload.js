import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFileUpload, FaFileAlt, FaFileImage, FaFilePdf, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadFileAndExtract, processDemoDocument } from '../utils/api';
import ResultDisplay from './ResultDisplay';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  position: relative;
`;

const UploadArea = styled.div`
  width: 100%;
  height: 300px;
  border: 2px dashed ${props => props.isDragActive ? '#3498db' : '#cccccc'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  cursor: pointer;
  background-color: ${props => props.isDragActive ? 'rgba(52, 152, 219, 0.05)' : 'transparent'};
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #3498db;
    background-color: rgba(52, 152, 219, 0.05);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled(motion.div)`
  font-size: 48px;
  color: #3498db;
  margin-bottom: 20px;
`;

const UploadText = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 10px;
`;

const AcceptedFiles = styled.p`
  font-size: 14px;
  color: #888;
  text-align: center;
`;

const SelectedFileContainer = styled.div`
  width: 100%;
  padding: 15px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
`;

const FileIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
  color: #3498db;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 350px;
`;

const FileSize = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
`;

const PreviewContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeaea;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  background-color: #f9f9f9;
`;

const PdfPreview = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const PdfIcon = styled(FaFilePdf)`
  font-size: 64px;
  color: #e74c3c;
  margin-bottom: 10px;
`;

const PdfText = styled.p`
  font-size: 16px;
  color: #666;
`;

const ProcessButton = styled(motion.button)`
  padding: 14px 30px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.span`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 10px;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size: 48px;
  color: #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #333;
  font-weight: 500;
`;

const ProgressText = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

const DocumentTypeSelector = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const DocumentTypeLabel = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const DocumentTypeOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const DocumentTypeOption = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.selected ? '#3498db' : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : '#666'};
  border: 1px solid ${props => props.selected ? '#3498db' : '#ddd'};
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? '#2980b9' : '#e9e9e9'};
  }
`;

const FileUpload = ({ onUploadSuccess, useDemoData = false }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [documentType, setDocumentType] = useState('invoice'); // Default to invoice
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleSelectedFile(file);
    }
  };
  
  const handleSelectedFile = (file) => {
    // Validate file type
    const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, JPG, PNG, or TXT file');
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };
  
  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleSelectedFile(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = () => {
    if (!selectedFile) return <FaFileAlt />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FaFilePdf />;
    } else if (selectedFile.type.startsWith('image/')) {
      return <FaFileImage />;
    } else {
      return <FaFileAlt />;
    }
  };
  
  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setLoadingStatus('Uploading document...');
    setExtractedData(null); // Reset any previous results
    
    try {
      let data;
      
      if (useDemoData) {
        // Use demo data for testing
        setLoadingStatus('Processing with demo data...');
        data = await processDemoDocument(selectedFile);
      } else {
        // Use real API
        setLoadingStatus(`Extracting data from ${documentType} document...`);
        data = await uploadFileAndExtract(selectedFile, documentType);
      }
      
      if (data) {
        // Handle successful extraction
        toast.success('Document processed successfully!');
        
        // Set the data for display directly on this page
        setExtractedData(data);
        
        // Also call the callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(data);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Failed to process document');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setExtractedData(null);
    setIsLoading(false);
    setLoadingStatus('');
  };
  
  // If we have results, show them
  if (extractedData) {
    return (
      <div>
        <ResultDisplay 
          data={extractedData} 
          onReset={resetForm}
        />
      </div>
    );
  }
  
  return (
    <UploadContainer>
      {isLoading && (
        <LoadingOverlay>
          <SpinnerIcon />
          <LoadingText>Processing Document</LoadingText>
          <ProgressText>{loadingStatus}</ProgressText>
        </LoadingOverlay>
      )}
      
      <UploadArea
        isDragActive={isDragActive}
        onClick={handleUploadClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.txt"
        />
        <UploadIcon
          animate={{ y: isDragActive ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaFileUpload />
        </UploadIcon>
        <UploadText>
          {isDragActive ? 'Drop file here' : 'Drag & drop a file or click to browse'}
        </UploadText>
        <AcceptedFiles>
          Accepted file types: PDF, JPG, PNG, TXT (Max size: 10MB)
        </AcceptedFiles>
      </UploadArea>
      
      {selectedFile && (
        <>
          <SelectedFileContainer>
            <FileIcon>{getFileIcon()}</FileIcon>
            <FileDetails>
              <FileName>{selectedFile.name}</FileName>
              <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
            </FileDetails>
          </SelectedFileContainer>
          
          {/* Document Type Selector */}
          <DocumentTypeSelector>
            <DocumentTypeLabel>Select Document Type:</DocumentTypeLabel>
            <DocumentTypeOptions>
              <DocumentTypeOption 
                selected={documentType === 'invoice'} 
                onClick={() => setDocumentType('invoice')}
              >
                Invoice
              </DocumentTypeOption>
              <DocumentTypeOption 
                selected={documentType === 'contract'} 
                onClick={() => setDocumentType('contract')}
              >
                Contract
              </DocumentTypeOption>
            </DocumentTypeOptions>
          </DocumentTypeSelector>
          
          {/* File Preview */}
          {selectedFile.type.startsWith('image/') && filePreview && (
            <PreviewContainer>
              <ImagePreview src={filePreview} alt="Preview" />
            </PreviewContainer>
          )}
          
          {selectedFile.type === 'application/pdf' && (
            <PreviewContainer>
              <PdfPreview>
                <PdfIcon />
                <PdfText>PDF Document Preview</PdfText>
              </PdfPreview>
            </PreviewContainer>
          )}
          
          <ProcessButton
            onClick={processFile}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ButtonIcon>
              {isLoading ? <FaSpinner /> : <FaFileAlt />}
            </ButtonIcon>
            Process {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
          </ProcessButton>
        </>
      )}
    </UploadContainer>
  );
};

export default FileUpload; 