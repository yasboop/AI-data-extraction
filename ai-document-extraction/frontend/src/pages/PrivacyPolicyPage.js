import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

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

const PolicyContainer = styled.div`
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

const PrivacyPolicyPage = () => {
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
              <FaShieldAlt />
              Privacy Policy
            </Title>
            <LastUpdated>Last Updated: November 1, 2023</LastUpdated>
          </PageHeader>
          
          <PolicyContainer>
            <Section>
              <SectionTitle>1. Introduction</SectionTitle>
              <Content>
                <p>
                  Welcome to AI Document Extraction. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our website and 
                  use our document extraction services, regardless of where you visit it from.
                </p>
                <p>
                  This policy applies to all users of AI Document Extraction services, including the website, API, and any related applications.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>2. Data We Collect</SectionTitle>
              <Content>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul>
                  <li><strong>Identity Data</strong> includes username or similar identifier.</li>
                  <li><strong>Contact Data</strong> includes email address.</li>
                  <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                  <li><strong>Document Data</strong> includes the documents you upload for processing and the extracted information from those documents.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>3. How We Use Your Data</SectionTitle>
              <Content>
                <p>We use your personal data for the following purposes:</p>
                <ul>
                  <li>To provide and maintain our service, including to monitor the usage of our service.</li>
                  <li>To manage your account.</li>
                  <li>To process and extract information from your documents.</li>
                  <li>To contact you regarding updates or informative communications related to the functionalities, products or contracted services.</li>
                  <li>To provide customer support.</li>
                  <li>To gather analysis or valuable information so that we can improve our service.</li>
                  <li>To detect, prevent and address technical issues.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>4. Document Data Processing</SectionTitle>
              <Content>
                <p>
                  When you upload documents to our service for information extraction, we process these documents through our AI systems. 
                  Here's how we handle your document data:
                </p>
                <ul>
                  <li>Documents are processed in secure, isolated environments.</li>
                  <li>We retain documents only for the time necessary to complete the extraction process, typically less than 24 hours.</li>
                  <li>All document data is encrypted during transmission and storage.</li>
                  <li>We do not use the content of your documents for purposes other than providing the extraction service to you.</li>
                  <li>Our AI systems may learn from document patterns to improve extraction accuracy, but this learning is based on anonymized structural patterns, not specific document content.</li>
                </ul>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>5. Data Security</SectionTitle>
              <Content>
                <p>
                  We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, 
                  accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those 
                  employees, agents, contractors and other third parties who have a business need to know.
                </p>
                <p>
                  We have procedures in place to deal with any suspected personal data breach and will notify you and any applicable 
                  regulator of a breach where we are legally required to do so.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>6. Data Retention</SectionTitle>
              <Content>
                <p>
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
                  including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
                <p>
                  For documents uploaded for processing, we typically delete these within 24 hours after processing is complete, 
                  unless you have explicitly requested we retain them for troubleshooting purposes.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>7. Your Legal Rights</SectionTitle>
              <Content>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                <ul>
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request restriction of processing your personal data.</li>
                  <li>Request transfer of your personal data.</li>
                  <li>Right to withdraw consent.</li>
                </ul>
                <p>
                  If you wish to exercise any of these rights, please contact us. You will not have to pay a fee to access your 
                  personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is 
                  clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>8. Cookies</SectionTitle>
              <Content>
                <p>
                  We use cookies and similar tracking technologies to track the activity on our service and store certain information. 
                  Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not 
                  accept cookies, you may not be able to use some portions of our service.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>9. Changes to This Privacy Policy</SectionTitle>
              <Content>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                <p>
                  We will let you know via email and/or a prominent notice on our service, prior to the change becoming effective and update 
                  the "Last updated" date at the top of this Privacy Policy.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective 
                  when they are posted on this page.
                </p>
              </Content>
            </Section>
            
            <Section>
              <SectionTitle>10. Contact Us</SectionTitle>
              <Content>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                  <li>By email: privacy@aidocextract.com</li>
                  <li>By visiting the contact page on our website</li>
                </ul>
              </Content>
            </Section>
          </PolicyContainer>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default PrivacyPolicyPage; 