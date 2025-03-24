import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGavel } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 3rem 0;
  min-height: calc(100vh - 150px);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 1rem;
    color: var(--primary-color);
  }
`;

const LastUpdated = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const TermsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  strong {
    font-weight: 600;
  }
`;

const TermsPage = () => {
  return (
    <PageContainer>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader>
            <Title>
              <FaGavel />
              Terms of Service
            </Title>
            <LastUpdated>Last Updated: November 1, 2023</LastUpdated>
          </PageHeader>
          
          <TermsContainer>
            <Section>
              <SectionTitle>1. Acceptance of Terms</SectionTitle>
              <Content>
                <p>
                  By accessing or using the AI Document Extraction service, website, and applications (collectively, the "Service"), 
                  you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>2. Description of Service</SectionTitle>
              <Content>
                <p>
                  AI Document Extraction provides an artificial intelligence-powered document extraction service that allows users to upload 
                  documents and extract structured information from them.
                </p>
                <p>
                  The Service processes various document types, including but not limited to invoices, receipts, and purchase orders, 
                  and returns structured data in JSON format.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>3. User Accounts</SectionTitle>
              <Content>
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>4. Intellectual Property</SectionTitle>
              <Content>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of 
                  AI Document Extraction and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
                  United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or 
                  service without the prior written consent of AI Document Extraction.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>5. User Content</SectionTitle>
              <Content>
                <p>
                  You retain any and all of your rights to any content you submit, post or display on or through the Service ("User Content") 
                  and you are responsible for protecting those rights. We take no responsibility and assume no liability for User Content you 
                  or any third party posts on or through the Service.
                </p>
                <p>
                  By uploading documents to the Service, you grant us the right to process these documents for the purpose of providing the extraction Service.
                </p>
                <p>
                  You represent and warrant that:
                </p>
                <ul>
                  <li>You own the content you upload to the Service or otherwise have the right to grant the rights and licenses described in these Terms.</li>
                  <li>The uploading and processing of your content by the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, intellectual property rights, or any other rights of any person.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>6. Use Restrictions</SectionTitle>
              <Content>
                <p>
                  You agree not to use the Service:
                </p>
                <ul>
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service or expose them to liability.</li>
                  <li>To upload or transmit viruses or any other malicious code that will or may be used in any way that will affect the functionality or operation of the Service.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>7. Termination</SectionTitle>
              <Content>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                  including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, 
                  you may simply discontinue using the Service, or contact us to request account deletion.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>8. Limitation of Liability</SectionTitle>
              <Content>
                <p>
                  In no event shall AI Document Extraction, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
                  loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>Your access to or use of or inability to access or use the Service;</li>
                  <li>Any conduct or content of any third party on the Service;</li>
                  <li>Any content obtained from the Service; and</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content,</li>
                </ul>
                <p>
                  Whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have 
                  been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>9. Disclaimer</SectionTitle>
              <Content>
                <p>
                  Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. 
                  The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, 
                  implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                </p>
                <p>
                  AI Document Extraction makes no warranties or representations about the accuracy or completeness of the content provided 
                  by the Service or the content of any sites linked to the Service and assumes no liability or responsibility for any:
                </p>
                <ul>
                  <li>Errors, mistakes, or inaccuracies of content;</li>
                  <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to and use of the Service;</li>
                  <li>Any unauthorized access to or use of our secure servers and/or any and all personal information and/or financial information stored therein;</li>
                  <li>Any interruption or cessation of transmission to or from the Service;</li>
                  <li>Any bugs, viruses, trojan horses, or the like which may be transmitted to or through the Service by any third party;</li>
                  <li>Any errors or omissions in any content or for any loss or damage of any kind incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Service.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>10. Changes to Terms</SectionTitle>
              <Content>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material 
                  we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
                  will be determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. 
                  If you do not agree to the new terms, please stop using the Service.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>11. Contact Us</SectionTitle>
              <Content>
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul>
                  <li>By email: terms@aidocextract.com</li>
                  <li>By visiting the contact page on our website</li>
                </ul>
              </Content>
            </Section>
          </TermsContainer>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default TermsPage; 