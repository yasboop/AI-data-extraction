import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFileInvoice, FaFileDownload, FaFileAlt, FaImage, FaInfoCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ResultContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const ResultHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const ResultContent = styled.div`
  margin-bottom: 30px;
`;

const ExtractedDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DataCard = styled(motion.div)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 16px;
    color: #888;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  p {
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    word-break: break-word;
  }
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const DocumentTypeLabel = styled.div`
  display: inline-block;
  padding: 6px 16px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 0 auto 20px;
  
  svg {
    margin-right: 8px;
  }
`;

const ExtractionMethodLabel = styled.div`
  display: inline-block;
  padding: 6px 16px;
  background-color: ${props => props.multimodal ? '#f6ffed' : '#fff7e6'};
  color: ${props => props.multimodal ? '#52c41a' : '#fa8c16'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 10px auto 20px;
  
  svg {
    margin-right: 8px;
  }
`;

const MetadataRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const KeyField = styled.span`
  color: #1890ff;
  font-weight: 600;
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const RawDataSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const RawDataContent = styled.pre`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 14px;
  max-height: 500px;
  overflow-y: auto;
`;

const MarkdownContainer = styled.div`
  line-height: 1.6;
  
  h3 {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #333;
  }
  
  h4 {
    font-size: 18px;
    margin-top: 18px;
    margin-bottom: 8px;
    color: #444;
  }
  
  p {
    margin-bottom: 12px;
  }
  
  ul, ol {
    margin-left: 20px;
    margin-bottom: 16px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  strong {
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #3498db;
  color: white;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f1f2f6;
  color: #333;
  
  &:hover {
    background-color: #dfe4ea;
  }
`;

const InfoBox = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #e3f2fd;
  color: #0d47a1;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 10px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const ContractSection = styled.div`
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #3498db;
`;

const ContractSubSection = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #3498db;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 6px;
    }
  }
`;

const EntityItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  span.label {
    font-weight: 600;
    margin-right: 5px;
    color: #555;
  }
`;

const ResultDisplay = ({ data, onReset }) => {
  const [showRawData, setShowRawData] = useState(false);
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  
  // Use useEffect hook (always placed at the top level of the component, not conditionally)
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setExtractionCompleted(true);
      }, 800); // Delay summary appearance by 800ms
      
      // Cleanup function
      return () => {
        clearTimeout(timer);
      };
    }
  }, [data]); // Only re-run if data changes
  
  // Return null early if no data
  if (!data) {
    return null;
  }
  
  // Improve the renderValue function to better handle complex nested objects
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return 'None';
        }
        return (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {value.map((item, i) => (
              <li key={i}>{renderValue(item)}</li>
            ))}
          </ul>
        );
      } else {
        return (
          <div style={{ marginTop: '8px' }}>
            {Object.entries(value).map(([k, v]) => (
              <div key={k} style={{ marginBottom: '6px' }}>
                <strong>{k.replace(/_/g, ' ')}:</strong>{' '}
                {renderValue(v)}
              </div>
            ))}
          </div>
        );
      }
    }
    
    return JSON.stringify(value);
  };
  
  const { 
    filename, 
    document_type = "invoice", 
    extraction_method = "text-only",
    invoice_number,
    supplier_name,
    invoice_date,
    total_amount,
    vat_amount,
    payment_due_date,
    currency = "$",
    purchase_order,
    tax_id,
    line_items,
    billing_address,
    shipping_address,
    payment_terms,
    summary,
    contract_number,
    effective_date,
    expiration_date,
    entities,
    terms_and_conditions,
    signatures,
    client_name,
    ...restData
  } = data;
  
  // Remove the summary from restData to avoid duplicate rendering
  if (summary && 'summary' in restData) {
    delete restData.summary;
  }
  
  const getDocumentTypeIcon = () => {
    switch(document_type?.toLowerCase()) {
      case 'invoice':
        return <FaFileInvoice />;
      case 'receipt':
        return <FaFileAlt />;
      case 'image':
        return <FaImage />;
      case 'contract':
        return <FaFileAlt />;
      default:
        return <FaFileAlt />;
    }
  };
  
  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${filename || "extraction"}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const handleResetClick = () => {
    if (onReset && typeof onReset === 'function') {
      onReset();
    }
  };
  
  return (
    <ResultContainer>
      <ResultHeader>
        <Title>Extraction Results</Title>
        <Subtitle>AI-powered data extraction from your document</Subtitle>
      </ResultHeader>
      
      <ResultContent>
        <MetadataRow>
          <DocumentTypeLabel>
            {getDocumentTypeIcon()}
            {document_type ? document_type.charAt(0).toUpperCase() + document_type.slice(1) : 'Document'}
          </DocumentTypeLabel>
          
          <ExtractionMethodLabel multimodal={extraction_method === 'multimodal'}>
            {extraction_method === 'multimodal' ? 'Multimodal Extraction' : 'Text-Only Extraction'}
          </ExtractionMethodLabel>
        </MetadataRow>
        
        <InfoBox>
          <FaInfoCircle />
          <p>
            File <KeyField>{filename || "invoice_file.pdf"}</KeyField> was processed using <KeyField>{extraction_method}</KeyField> extraction.
          </p>
        </InfoBox>
        
        {/* Display invoice data if document type is invoice */}
        {document_type === 'invoice' && (
          <ExtractedDataGrid>
            {invoice_number && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3>Invoice Number</h3>
                <p>{invoice_number}</p>
              </DataCard>
            )}
            
            {supplier_name && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <h3>Supplier Name</h3>
                <p>{supplier_name}</p>
              </DataCard>
            )}
            
            {invoice_date && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3>Invoice Date</h3>
                <p>{invoice_date}</p>
              </DataCard>
            )}
            
            {total_amount && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <h3>Total Amount</h3>
                <p>{typeof total_amount === 'number' ? `${currency}${total_amount.toLocaleString()}` : total_amount}</p>
              </DataCard>
            )}
            
            {vat_amount && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h3>VAT/Tax Amount</h3>
                <p>{typeof vat_amount === 'number' ? `${currency}${vat_amount.toLocaleString()}` : vat_amount}</p>
              </DataCard>
            )}
            
            {payment_due_date && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <h3>Payment Due Date</h3>
                <p>{payment_due_date}</p>
              </DataCard>
            )}
            
            {purchase_order && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3>Purchase Order</h3>
                <p>{purchase_order}</p>
              </DataCard>
            )}
            
            {tax_id && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <h3>Tax ID / VAT Number</h3>
                <p>{tax_id}</p>
              </DataCard>
            )}
            
            {billing_address && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <h3>Billing Address</h3>
                <p>{billing_address}</p>
              </DataCard>
            )}
            
            {payment_terms && (
              <DataCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 }}
              >
                <h3>Payment Terms</h3>
                <p>{renderValue(payment_terms)}</p>
              </DataCard>
            )}
            
            {/* Display any other fields that weren't explicitly handled */}
            {Object.entries(restData).map(([key, value], index) => {
              // Skip empty values
              if (value === null || value === undefined) {
                return null;
              }
              
              // Skip summary field as it's handled separately
              if (key === 'summary') {
                return null;
              }
              
              // Format the key for display
              const formattedKey = key
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              // Check if the value looks like markdown (contains ### or **)
              const isMarkdownLike = typeof value === 'string' && 
                                    (value.includes('###') || 
                                     value.includes('**') || 
                                     value.includes('- '));
              
              return (
                <DataCard
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                >
                  <h3>{formattedKey}</h3>
                  {isMarkdownLike ? (
                    <MarkdownContainer>
                      <ReactMarkdown>{value}</ReactMarkdown>
                    </MarkdownContainer>
                  ) : (
                    <p>{renderValue(value)}</p>
                  )}
                </DataCard>
              );
            })}
          </ExtractedDataGrid>
        )}
        
        {/* Display contract data if document type is contract */}
        {document_type === 'contract' && (
          <>
            <ExtractedDataGrid>
              {contract_number && (
                <DataCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3>Contract Number</h3>
                  <p>{contract_number}</p>
                </DataCard>
              )}
              
              {effective_date && (
                <DataCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <h3>Effective Date</h3>
                  <p>{effective_date}</p>
                </DataCard>
              )}
              
              {expiration_date && (
                <DataCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3>Expiration Date</h3>
                  <p>{expiration_date}</p>
                </DataCard>
              )}
            </ExtractedDataGrid>
            
            {entities && (
              <ContractSection>
                <h3>Entities</h3>
                {entities.service_provider && (
                  <ContractSubSection>
                    <h4>Service Provider</h4>
                    {Object.entries(entities.service_provider).map(([key, value]) => (
                      <EntityItem key={key}>
                        <span className="label">{key.replace(/_/g, ' ')}:</span> {renderValue(value)}
                      </EntityItem>
                    ))}
                  </ContractSubSection>
                )}
                
                {entities.client && (
                  <ContractSubSection>
                    <h4>Client</h4>
                    {Object.entries(entities.client).map(([key, value]) => (
                      <EntityItem key={key}>
                        <span className="label">{key.replace(/_/g, ' ')}:</span> {renderValue(value)}
                      </EntityItem>
                    ))}
                  </ContractSubSection>
                )}
              </ContractSection>
            )}
            
            {terms_and_conditions && (
              <ContractSection>
                <h3>Terms And Conditions</h3>
                {Object.entries(terms_and_conditions).map(([key, value]) => (
                  <ContractSubSection key={key}>
                    <h4>{key.replace(/_/g, ' ')}</h4>
                    {renderValue(value)}
                  </ContractSubSection>
                ))}
              </ContractSection>
            )}
            
            {signatures && (
              <ContractSection>
                <h3>Signatures</h3>
                {Object.entries(signatures).map(([key, value]) => (
                  <ContractSubSection key={key}>
                    <h4>{key.replace(/_/g, ' ')}</h4>
                    {typeof value === 'object' ? 
                      Object.entries(value).map(([subKey, subValue]) => (
                        <EntityItem key={subKey}>
                          <span className="label">{subKey.replace(/_/g, ' ')}:</span> {renderValue(subValue)}
                        </EntityItem>
                      ))
                      : <p>{value}</p>
                    }
                  </ContractSubSection>
                ))}
              </ContractSection>
            )}
          </>
        )}
        
        {summary && extractionCompleted && (
          <DataCard
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              marginBottom: '30px', 
              marginTop: '20px',
              gridColumn: '1 / -1',
              backgroundColor: '#f0f7ff',
              border: '1px solid #e0edff'
            }}
            className="full-width"
          >
            <h3 style={{ fontSize: '18px', color: '#0066cc' }}>Executive Summary</h3>
            <MarkdownContainer>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </MarkdownContainer>
          </DataCard>
        )}
        
        {line_items && line_items.length > 0 && (
          <DataCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{ marginBottom: '30px' }}
          >
            <h3>Line Items</h3>
            <ItemsList>
              {line_items.map((item, index) => (
                <li key={index}>
                  {renderValue(item)}
                </li>
              ))}
            </ItemsList>
          </DataCard>
        )}
        
        {showRawData && (
          <RawDataSection>
            <h3>Raw Extracted Data</h3>
            <RawDataContent>{JSON.stringify(data, null, 2)}</RawDataContent>
          </RawDataSection>
        )}
      </ResultContent>
      
      <ActionButtons>
        <PrimaryButton
          onClick={downloadJson}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFileDownload />
          Download JSON
        </PrimaryButton>
        
        <SecondaryButton
          onClick={handleResetClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Extract Another Document
        </SecondaryButton>
        
        <SecondaryButton
          onClick={() => setShowRawData(!showRawData)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
        </SecondaryButton>
      </ActionButtons>
    </ResultContainer>
  );
};

export default ResultDisplay; 