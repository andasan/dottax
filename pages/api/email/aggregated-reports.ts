const SibApiV3Sdk = require('@sendinblue/client');
import { default as dayjs } from 'dayjs';

import { NextApiRequest, NextApiResponse } from 'next';

import { AggregatedReport } from '@/types/api.types';
import { config } from '@/lib/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = config.sibApiKey;


    const startDate = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().format('YYYY-MM-DD');
    console.log(config.sibApiKey, startDate, endDate)

    apiInstance.getAggregatedSmtpReport(startDate, endDate).then(function(data: any) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data.body));
      res.status(200).json(data);
    }, function(error: any) {
      console.error(error);
    });
}
