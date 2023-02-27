import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import async from 'async';
import cron from 'node-cron';

import EmailTemplate from '@/email/emails/ciccc-t2202';
import cloudinary from '@/utils/cloudinary';
import { config } from '@/lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const studentsEmailList = async (BATCH_NUMBER: number, BULK_LIMIT: number) => await prisma.student.findMany({
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

  const cronJob = cron.schedule('*/2 * * * *', async () => {

    cronJob.on('start', () => {
      console.log('Bulk email task started');
    });

    cronJob.on('run', (x) => {
      console.log('Cron job is now running: ', x);
    });

    const BULK_LIMIT = req.body?.take
    const BATCH_NUMBER = req.body?.batch

    const getList = await studentsEmailList(BATCH_NUMBER, BULK_LIMIT)

    if (getList.length > 0) {
      const result = await sendBulkEmail(getList);
      res.status(200).json({ message: `Bulk email is currently tasked to send ${req.body.take} email per 2 minutes`, status: 250, ...(result.data && { data: result?.data }) });
    } else {
      cronJob.stop();
      res.status(200).json({ message: 'All students have received an email blast' });
    }
  }, {
    scheduled: true,
    timezone: 'America/Vancouver'
  });

  cronJob.start();
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
};

async function sendBulkEmail(studentsEmailList: StudentEmailProps) {
  //Retrieve a list of emails with attachments
  const batchEmailWithAttachments = await getAttachments(studentsEmailList);

  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: 587,
      auth: {
        user: config.email.username,
        pass: config.email.password,
      },
    });

    // create a queue with a concurrency of 2
    const emailQueue = async.queue((mailOptions: MailOptionsProps, callback) => {
      const { to, id } = mailOptions;

      // send the email
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          // handle any errors
          throw new Error('LOG ERROR: ' + error);
        } else {
          // email was sent successfully
          console.info(`Email sent: ${info.response}. Recipient: ${to}`);

          //update the status of the student
          await prisma.student.update({
            where: {
              id: id,
            },
            data: {
              status: 'sent',
            },
          });
        }
        // call the callback to indicate that the task is complete
        callback();
      });
    }, 2);

    // send the emails with unique attachments
    batchEmailWithAttachments.forEach((recipient, i) => {
      const emailHtml = render(<EmailTemplate studentName={recipient.firstName} />, {
        pretty: true,
      });
      // create the email options
      emailQueue.push({
        id: recipient.id,
        from: `CICCC <${config.email.from || ''}>`,
        to: recipient.email,
        subject: config.email.subject || '',
        attachments: [
          {
            filename: 't2202-fill-21e.pdf',
            path: recipient.attachmentPath,
            contentType: 'application/pdf',
          },
        ],
        html: emailHtml,
      });
    });

    const emailAmount = emailQueue.length();

    emailQueue.drain(function () {
      console.log('all items have been processed');
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
            resolve([...acc, { id, firstName, email, attachmentPath: result.secure_url }])
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