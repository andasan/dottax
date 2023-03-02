'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Paper,
  Container,
  Box,
  Title,
  Text,
  TextInput,
  SimpleGrid,
  Stack,
  Divider,
  Image,
  TypographyStylesProvider,
} from '@mantine/core';

import { useForm } from '@mantine/form';

import { CustomTextArea } from '@/components/common';

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const sectionLogo = {
  marginLeft: 0,
  padding: '0 40px',
};

const headerBlue = {
  // width: 0,
  marginRight: 0,
  padding: '0 40px',
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

const paragraph = {
  fontFamily,
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3c4043',
};

export type FormValues = {
  header: string;
  body: string;
  footer: string;
};

export default function EmailTemplatePage() {

  const [templateState, setTemplateState] = useState<FormValues>({
    header: 'Tuition Enrolment Certificate (T2202)',
    body: `
    <p><i>Do Not Reply. This is an automated email using a third-party secure portal. </i></p>
    <p>Hello Student,</p>
    <p>Please find attached your confidential tax form.</p>
    <p>Your tax form contains sensitive personal information. Download it using a trusted, secure connection instead of over free, public wi-fi, such as at airports or coffee shops, etc.</p>
    <p>If you need assistance to file your tax, please contact our preferred partner, Phoenix Accounting Services: <a href="https://phoenixcanada.ca/file-your-taxes">https://phoenixcanada.ca/file-your-taxes</a></p>
    <p>Thank you</p>
      `,
    footer:
      '© 2023 Cornerstone International College of Canada 609 West Hastings St, Vancouver, BC, Canada V6B 4W4',
  });


  const form = useForm({
    initialValues: {
      header: templateState.header,
      body: templateState.body,
      footer: templateState.footer,
    },

    validate: {
      header: (value: string) => (value.length > 0 ? null : 'Header is required'),
      body: (value: string) => (value.length > 0 ? null : 'Body is required'),
      footer: (value: string) => (value.length > 0 ? null : 'Footer is required'),
    },
  });

  const baseUrl = '/static';

  return (
    <Paper shadow="xs" p="xl">
      <Container p="xs" size="lg">
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
            <Stack align="stretch" spacing="xs" mt={25}>
              <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                  mt={20}
                  placeholder="Header Title here"
                  label="Header Title"
                  withAsterisk
                  size="md"
                  {...form.getInputProps('header')}
                />

                <CustomTextArea label={"Message Body"} templateState={templateState} setTemplateState={setTemplateState} />

                <TextInput
                  mt={20}
                  placeholder="Write a footer here"
                  label="Footer"
                  withAsterisk
                  size="md"
                  {...form.getInputProps('footer')}
                />
              </form>
            </Stack>

            <Stack
              align="flex-end"
              spacing="xs"
              mt={25}
              sx={(theme) => ({
                backgroundColor: theme.colorScheme !== 'dark' ? theme.colors.dark[1] : 'white',
                textAlign: 'left',
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
              })}
            >
              <Box>
                <Box style={headerBlue}>
                  <Image
                    src={`${baseUrl}/ciccc-header.png`}
                    width="305"
                    height="28"
                    alt="CICCC header blue transparent"
                  />
                </Box>
                <Box style={sectionLogo}>
                  <Image
                    src={`${baseUrl}/ciccc-logo.png`}
                    width="320"
                    height="75"
                    alt="CICCC logo"
                  />
                </Box>
              </Box>

              <Box style={paragraphContent}>
                <Divider size="xs" style={{ opacity: 0.2 }} />
                <Text style={heading}>{form.values.header}</Text>
                <TypographyStylesProvider my={20} style={paragraph}>
                  <div dangerouslySetInnerHTML={{ __html: `${templateState.body}` }} />
                </TypographyStylesProvider>
              </Box>

              <Box style={containerContact}>
                <Box
                  style={{
                    padding: '20px 20px',
                  }}
                >
                  <Text style={paragraph}>Connect with us</Text>
                  <table>
                    <thead />
                    <tbody>
                      <tr>
                        <td>
                          <Link href="https://ciccc.ca/">
                            <Image
                              width="22px"
                              height="22px"
                              src={`${baseUrl}/ciccc-logo-square.png`}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link href="https://www.facebook.com/cicccvancouver">
                            <Image
                              width="28px"
                              height="28px"
                              src={`${baseUrl}/icons8-facebook-48.png`}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link href="https://www.linkedin.com/school/cornerstone-international-community-college-of-canada/?originalSubdomain=ca">
                            <Image
                              width="28px"
                              height="28px"
                              src={`${baseUrl}/icons8-linkedin-48.png`}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link href="https://twitter.com/cicccvancouver">
                            <Image
                              width="28px"
                              height="28px"
                              src={`${baseUrl}/icons8-twitter-squared-48.png`}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link href="https://www.youtube.com/channel/UCDj9ILg0V9aAF0NxCVDUlww">
                            <Image
                              width="28px"
                              height="28px"
                              src={`${baseUrl}/icons8-youtube-48.png`}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link href="https://www.instagram.com/cicccvancouver/?hl=en">
                            <Image
                              width="28px"
                              height="28px"
                              src={`${baseUrl}/icons8-instagram-48.png`}
                            />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
                <Image width="540" height="48" src={`${baseUrl}/ciccc-footer.png`} />
              </Box>

              <Box style={{ ...paragraphContent, paddingBottom: 30 }}>
                <Text
                  style={{
                    ...paragraph,
                    fontSize: '12px',
                    textAlign: 'center',
                    margin: 0,
                  }}
                >
                  {form.values.footer}
                </Text>
              </Box>
            </Stack>
          </SimpleGrid>
        </Box>
      </Container>
    </Paper>
  );
}