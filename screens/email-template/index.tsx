'use client';

import { useEffect, useState } from 'react';
import {
  Paper,
  Container,
  Box,
  Group,
  Title,
  Text,
  useMantineTheme,
  Button,
  SimpleGrid,
} from '@mantine/core';

import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text as TxT } from '@react-email/text';

import { useStoreDispatch, useStoreSelector } from '@/lib/hooks';
import { studentAction, studentState } from '@/store/index';
import { formatBytes } from '@/utils/formatBytes';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconX, IconFileDelta } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import EmailTemplate from '@/email/emails/ciccc-t2202';

interface AddStudentProps {
  data: any;
}

type FormValues = {
  name: string;
  header: string;
  body: string;
};

export default function EmailTemplatePage({ data }: AddStudentProps) {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(studentAction.loadStudents(data));
    dispatch(studentAction.loadBatches(data));
  }, [data]);

  const [templateState, setTemplateState] = useState<FormValues>({
    name: 'John Doe',
    header: 'Header',
    body: 'Body',
  });

  const baseUrl = '/static';


  return (
    <Paper shadow="xs" p="xl">
      <Container p="xl" size={400}>
        <Title order={3} weight={100} align="center" py={10}>
          Modify email message
        </Title>
        <Box mx="auto">
          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 1, spacing: 'xl' },
              { minWidth: 'md', cols: 2, spacing: 'xl' },
            ]}
          >
            <div>1</div>
            <>

          <Box>
            <Section style={headerBlue}>
              <Img
                src={`${baseUrl}/ciccc-header.png`}
                width="305"
                height="28"
                alt="CICCC header blue transparent"
              />
            </Section>
            <Section style={sectionLogo}>
              <Img
                src={`${baseUrl}/ciccc-logo.png`}
                width="320"
                height="75"
                alt="CICCC logo"
              />
            </Section>
          </Box>

          <Box style={paragraphContent}>
            <Hr style={hr} />
            <TxT style={heading}>Tuition Enrolment Certificate (T2202)</TxT>
            <TxT style={{ ...paragraph, fontSize: '18px' }}>Hello {templateState.name},</TxT>
            <TxT style={paragraph}>
              A digital Tuition Enrolment Certificate (T2202) has been issued to you
              and is ready for viewing.
            </TxT>

            <TxT style={paragraph}>
              Please see the attached file for your T2202.
            </TxT>

            <TxT style={paragraph}>
              If you have any queries, please contact{' '}
              <Link href="mailto:info@ciccc.ca">here</Link>
            </TxT>
          </Box>

          <Box style={paragraphContent}>
            <TxT style={paragraph}>Thank you,</TxT>
            <TxT style={paragraph}>
              Cornerstone International Community College Admin
            </TxT>
          </Box>

          <Box style={containerContact}>
            <Section
              style={{
                padding: '20px 20px',
              }}
            >
              <TxT style={paragraph}>Connect with us</TxT>
              <table>
                <tr>
                  <td>
                    <Link href="https://ciccc.ca/">
                      <Img
                        width="22"
                        height="22"
                        src={`${baseUrl}/ciccc-logo-square.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.facebook.com/cicccvancouver">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-facebook-48.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.linkedin.com/school/cornerstone-international-community-college-of-canada/?originalSubdomain=ca">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-linkedin-48.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://twitter.com/cicccvancouver">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-twitter-squared-48.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.youtube.com/channel/UCDj9ILg0V9aAF0NxCVDUlww">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-youtube-48.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.instagram.com/cicccvancouver/?hl=en">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-instagram-48.png`}
                      />
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>
            <Img width="540" height="48" src={`${baseUrl}/ciccc-footer.png`} />
          </Box>

          <Box style={{ ...paragraphContent, paddingBottom: 30 }}>
            <TxT
              style={{
                ...paragraph,
                fontSize: '12px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              © 2023 Cornerstone International College of Canada 609 West Hastings St, Vancouver, BC, Canada V6B 4W4
            </TxT>
          </Box>




            </>
          </SimpleGrid>
        </Box>
      </Container>
    </Paper>
  );
}



const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const main = {
  backgroundColor: '#dbddde',
};

const sectionLogo = {
  padding: '0 40px',
};

const headerBlue = {
  width: 0,
  marginRight: 0,
};

const container = {
  margin: '30px auto',
  width: '610px',
  backgroundColor: '#fff',
  borderRadius: 5,
  overflow: 'hidden',
  maxWidth: '100%',
};

const containerContact = {
  backgroundColor: '#f0fcff',
  width: '90%',
  borderRadius: '5px',
  overflow: 'hidden',
  marginBottom: 20,
};

const heading = {
  fontFamily,
  fontSize: '14px',
  lineHeight: '26px',
  fontWeight: 700,
  color: '#004dcf',
};

const paragraphContent = {
  padding: '0 40px',
};

const paragraphList = {
  paddingLeft: 40,
};

const paragraph = {
  fontFamily,
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3c4043',
};

const link = {
  ...paragraph,
  color: '#004dcf',
};

const hr = {
  borderColor: '#e8eaed',
  margin: '20px 0',
};