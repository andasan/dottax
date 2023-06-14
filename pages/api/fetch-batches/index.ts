import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      const data = await prisma.studentproto.findMany({ select: { batch: true }})

      //create unique array of batches
      const batches = [...new Set(data.map((item: any) => item.batch))]

      res.status(200).json(batches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}