import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      const data = await prisma.emailTemplate.findMany();

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = await prisma.emailTemplate.create({
        data: {
          header: "Certificate",
          body: `<p><em>Do Not Reply. This is an automated email using a third-party secure portal.</em></p><p>Hello Student,</p><p>Please find attached your confidential tax form.</p><p>Your tax form contains sensitive personal information. Download it using a trusted, secure connection instead of over free, public wi-fi, such as at airports or coffee shops, etc.</p><p>If you need assistance to file your tax, please contact our preferred partner, Phoenix Accounting Services: <a target="_blank" rel="noopener noreferrer nofollow" href="https://phoenixcanada.ca/file-your-taxes">https://phoenixcanada.ca/file-your-taxes</a></p><p>Thank you</p>`,
          footer: "© 2023 Cornerstone International College of Canada 609 West Hastings St, Vancouver, BC, Canada V6B 4W4",
        },
      });

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {

    const { id, header, body, footer } = JSON.parse(req.body);

    try {
      const data = await prisma.emailTemplate.update({
        where: {
          id: +id,
        },
        data: {
          header,
          body,
          footer
        },
      });

      res.status(200).json(data);
    } catch (error) {

      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

}