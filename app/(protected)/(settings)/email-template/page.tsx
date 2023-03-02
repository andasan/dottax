import EmailTemplatePage from '@/screens/email-template';
import { config } from '@/lib/config';

export default async function EmailTemplate() {
  return <EmailTemplatePage />
}

async function getData() {
  const tempClientUrl = process.env.VERCEL_URL;
  const apiUrl = config.clientUrl || `https://${tempClientUrl}`;
  const response = await fetch(apiUrl + '/api/email/template');

  if (!response.ok) {
    console.error('Failed to fetch data')
    return []
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

