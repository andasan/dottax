import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import async from 'async';
import path from 'path';
import fs from 'fs';

import EmailTemplate from '@/email/emails/ciccc-t2202';
import cloudinary from '@/utils/cloudinary';

type SendBulkEmailReturnType = {
  message: string;
  status: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const studentsEmailList = await prisma.student.findMany({
    where: {
      batch: Number(req.body.batch),
      status: 'idle',
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      studentId: true,
    },
    take: 10,
  });

  if (studentsEmailList.length > 0) {
    const result = await sendBulkEmail(studentsEmailList);

    res.status(200).json({ message: 'Email has been sent', status: 250, data: result.data });
    // const { message, status }: SendBulkEmailReturnType = await sendBulkEmail(studentsEmailList);
    // res.status(status).json({ message, status });
  } else {
    res.status(200).json({ message: 'All students have received an email blast' });
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
};

async function sendBulkEmail(studentsEmailList: StudentEmailProps) {
  //Retrieve a list of emails with attachments
  const batchEmailWithAttachments = await getAttachments(studentsEmailList);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
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
        from: `CICCC <${process.env.EMAIL_FROM || ''}>`,
        to: recipient.email,
        subject: process.env.EMAIL_SUBJECT || '',
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

        const identifier = `${firstName.split(' ').join('_')}_${lastName.split(' ').join('_')}`
        cloudinary.v2.api.resource(identifier, function (error, result) {
          if (error) {
            resolve(acc)
          }else{
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