import { NextApiRequest, NextApiResponse } from 'next';
import { default as dayjs } from 'dayjs';

import apiInstance from '@/lib/sendinblue';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { event } = req.body;

  const limit = 2500;
  const offset = 0;
  const startDate = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  const days = undefined;
  const email = undefined;

  apiInstance.getEmailEventReport(limit, offset, startDate, endDate, days, email, event).then(function (data: any) {
    // console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    return res.status(200).json(data);
  }, function (error: any) {
    console.error(error);
    return res.status(500).json(error);
  });
}
