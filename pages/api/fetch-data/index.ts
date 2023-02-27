import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

type QueryParams = {
  query: {
    batch: string;

  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { batch } = req.query as QueryParams['query'];

  if (req.method === 'GET') {
    try {
      let data = []
      if(!batch) {
        data = await prisma.student.findMany();
      }else{
        data = await prisma.student.findMany({
          where: {
            batch: Number(batch),
          }
        });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}