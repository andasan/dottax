import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import prisma from '@/lib/prisma';
import async from 'async';
import cron from 'node-cron';

import EmailTemplate from '@/email/emails/ciccc-t2202';
import cloudinary from '@/utils/cloudinary';
import { config } from '@/lib/config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import apiInstance, { sendSmtpEmail } from '@/lib/sendinblue';

const cronJobSchedule = {
  oneMinute: '*/1 * * * * *',
  twoMinutes: '*/2 * * * * *',
  oneHour: '0 0 */1 * * *',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  try {
    const studentsEmailList = async (BATCH_NUMBER: number, BULK_LIMIT: number) => await prisma.studentproto.findMany({
      where: {
        batch: Number(BATCH_NUMBER),
        status: 'idle',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        studentId: true,
      },
      take: Number(BULK_LIMIT),
    });

    const cronJob = cron.schedule(cronJobSchedule.oneHour, async () => {

      const BULK_LIMIT = req.body?.take
      const BATCH_NUMBER = req.body?.batch

      const getList = await studentsEmailList(BATCH_NUMBER, BULK_LIMIT)

      if (getList.length > 0) {
        const result = await sendBulkEmail(getList, BULK_LIMIT);
      } else {
        cronJob.stop();
      }
    }, {
      scheduled: true,
      timezone: 'America/Vancouver'
    });
    cronJob.start();

    res.status(250).json({ message: `Bulk email is currently tasked to send ${req.body.take} emails every hour starting from ${dayjs().tz('America/Vancouver').hour() + 1}:00`, status: 250 });
  } catch (err) {
    res.status(500).json(err)
  }
}

type StudentType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  attachmentPath?: string;
};

type StudentEmailProps = StudentType[];
type MailOptionsProps = {
  id: number;
  from: string;
  subject: string;
  to?: string;
  text?: string;
  attachments?: any[];
  html?: string;
  firstName?: string;
  lastName?: string;
};

async function sendBulkEmail(studentsEmailList: StudentEmailProps, take: number) {
  //Retrieve a list of emails with attachments
  const batchEmailWithAttachments = await getAttachments(studentsEmailList);

  try {

    const emailQueue = async.queue((mailOptions: MailOptionsProps, callback) => {
      const { to, id, from, subject, attachments, html, firstName, lastName } = mailOptions;

      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.sender = { "name": "Tax CICCC", "email": from };
      sendSmtpEmail.to = [{ "email": to, "name": `${firstName} ${lastName}` }];
      sendSmtpEmail.replyTo = { "email": "tax@ciccc.ca", "name": "Tax CICCC" };
      sendSmtpEmail.attachment = attachments;

      apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data: any) {
        // console.info('API called successfully. Returned data: ' + JSON.stringify(data));
        console.log('API called successfully: ' + to);

        //update the status of the student
        await prisma.studentproto.update({
          where: {
            id: id,
          },
          data: {
            status: 'sent',
          },
        });

      }, function (error: any) {
        console.error(error);
        throw new Error('LOG ERROR: ' + error);
      });
    }, take);

    // send the emails with unique attachments
    batchEmailWithAttachments.forEach((recipient, i) => {
      const emailHtml = render(<EmailTemplate studentName={recipient.firstName} />, {
        pretty: true,
      });
      // create the email options
      emailQueue.push({
        id: recipient.id,
        from: config.email.from || 'tax@ciccc.ca',
        to: recipient.email,
        subject: config.email.subject || 'T2202 Form',
        attachments: [
          {
            name: 't2202-fill-21e.pdf',
            url: recipient.attachmentPath,
          },
        ],
        html: emailHtml,
        firstName: recipient.firstName,
        lastName: recipient.lastName,
      });
    });

    const emailAmount = emailQueue.length();

    emailQueue.drain(function () {
      return { message: 'All emails have been processed', status: 250 };
    });

    emailQueue.error((err) => {
      console.log(err);
      return { message: err.message, status: 500 };
    });

    // return emailQueue.drain();
    return {
      message: `Email sending in process...\nNumber of emails to send: ${emailAmount}`,
      data: batchEmailWithAttachments,
      status: 200,
    };
  } catch (err: any) {
    // Handle the error.
    console.log(err);
    return { message: err.message, status: 500 };
  }
}

// type AccType = { [key: string]: string };
type AccType = { id: number; firstName: string; lastName: string, email: string; attachmentPath: string };
type Acc = AccType[];

async function getAttachments(data: StudentEmailProps) {

  const accumulatedStudentsWithPDF = await asyncReduce(
    data,
    async (acc: Acc, val: StudentType) => {
      const { id, email, studentId, firstName, lastName } = val;

      return new Promise((resolve) => {

        const identifier = `${firstName.trim().split(' ').join('_')}_${lastName.trim().split(' ').join('_')}`
        console.log(identifier)
        cloudinary.v2.api.resource(identifier, function (error, result) {
          if (error) {
            resolve(acc)
          } else {
            resolve([...acc, { id, firstName, lastName, email, attachmentPath: result.secure_url }])
          }
        });
      })
    },
    []
  );

  return accumulatedStudentsWithPDF;
}

const asyncReduce = async (array: StudentEmailProps, reducer: any, initialValue: Acc) => {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i]);
  }
  return accumulator;
};