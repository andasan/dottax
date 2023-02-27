import { config } from '@/lib/config';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';

export default function EmailTemplate({ studentName = "Student" }: { studentName: string }) {
  const baseUrl = config.assetsUrl ? config.assetsUrl : '@/email/static';

  return (
    <Html>
      <Head />
      <Preview>Cornerstone International Community College Admin</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section>
            <Section style={headerBlue}>
              <Img
                src={`${baseUrl}/ciccc-header_omyhrd.png`}
                width="305"
                height="28"
                alt="CICCC header blue transparent"
              />
            </Section>
            <Section style={sectionLogo}>
              <Img
                src={`${baseUrl}/ciccc-logo_xg9dv1.png`}
                width="320"
                height="75"
                alt="CICCC logo"
              />
            </Section>
          </Section>

          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>Tuition Enrolment Certificate (T2202)</Text>
            <Text style={paragraph}>
              Do Not Reply. This is an automated email using a third-party secure portal.

              Dear student

              Please find attached your confidential tax form.

              Your tax form contains sensitive personal information. Download it using a trusted, secure connection instead of over free, public wi-fi, such as at airports or coffee shops, etc.

              If you need assistance to file your tax, please contact our preferred partner, Phoenix Accounting Services: <a href="https://phoenixcanada.ca/file-your-taxes/">https://phoenixcanada.ca/file-your-taxes/</a>
            </Text>

          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>Thank you</Text>
          </Section>

          <Section style={containerContact}>
            <Section
              style={{
                padding: '20px 20px',
              }}
            >
              <Text style={paragraph}>Connect with us</Text>
              <table>
                <tr>
                  <td>
                    <Link href="https://ciccc.ca/">
                      <Img
                        width="22"
                        height="22"
                        src={`${baseUrl}/ciccc-logo-square_j1wswd.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.facebook.com/cicccvancouver">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-facebook-48_jqtzhc.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.linkedin.com/school/cornerstone-international-community-college-of-canada/?originalSubdomain=ca">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-linkedin-48_swmk5q.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://twitter.com/cicccvancouver">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-twitter-squared-48_migqpq.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.youtube.com/channel/UCDj9ILg0V9aAF0NxCVDUlww">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-youtube-48_bgvguv.png`}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link href="https://www.instagram.com/cicccvancouver/?hl=en">
                      <Img
                        width="28"
                        height="28"
                        src={`${baseUrl}/icons8-instagram-48_y60vni.png`}
                      />
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>
            <Img width="540" height="48" src={`${baseUrl}/ciccc-footer_bjxn0x.png`} />
          </Section>

          <Section style={{ ...paragraphContent, paddingBottom: 30 }}>
            <Text
              style={{
                ...paragraph,
                fontSize: '12px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              © 2023 Cornerstone International College of Canada 609 West Hastings St, Vancouver, BC, Canada V6B 4W4
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
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