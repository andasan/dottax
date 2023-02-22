import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import async from 'async';
import path from 'path';
import fs from 'fs';

import EmailTemplate from '@/email/emails/ciccc-t2202';

type SendBulkEmailReturnType = {
  message: string;
  status: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const studentsEmailList = await prisma.student.findMany({
    where: {
      batch: Number(req.body.batchNumber),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      studentId: true,
    },
  });

  if (studentsEmailList.length > 0) {
    const result = await sendBulkEmail(studentsEmailList);
    console.log('>>> studentsEmailList: ', result);
    res.status(200).json({ message: 'Email has been sent', status: 250 });
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

    return emailQueue.drain();
    return {
      message: `Email sending in process...\nNumber of emails to send: ${emailAmount}`,
      status: 200,
    };
  } catch (err: any) {
    // Handle the error.
    console.log(err);
    return { message: err.message, status: 500 };
  }
}

// type AccType = { [key: string]: string };
type AccType = { id: number; firstName: string; email: string; attachmentPath: string };
type Acc = AccType[];

// const studentReducer = (acc: Acc, student: StudentType) => {
//   const { id, email, studentId, firstName } = student;
//   const pdfDirectory = path.join(process.cwd(), "uploads");

//   const pdfPath = path.join(pdfDirectory, studentId + ".pdf");
//   // const pdfPath = path.join(pdfDirectory, studentId + '-t2202-fill-21e.pdf');

//   if (fs.existsSync(pdfPath)) {
//     return [...acc, { id, firstName, email, attachmentPath: pdfPath }];
//   } else {
//     //file does not exist
//     throw new Error("Failed to send email. Student's T2202 form doesn't exists");
//   }

//   return acc;
// };

// function getAttachments(data: StudentEmailProps) {
//   return data.reduce(studentReducer, []);
// }

const studentReducer = (acc: Acc, student: StudentType) => {
  const { id, email, studentId, firstName } = student;
  const pdfDirectory = path.join(process.cwd(), 'uploads');

  const pdfPath = path.join(pdfDirectory, studentId + '.pdf');
  // const pdfPath = path.join(pdfDirectory, studentId + '-t2202-fill-21e.pdf');

  if (fs.existsSync(pdfPath)) {
    return [...acc, { id, firstName, email, attachmentPath: pdfPath }];
  } else {
    //file does not exist
    throw new Error("Failed to send email. Student's T2202 form doesn't exists");
  }

  return acc;
};

async function getAttachments(data: StudentEmailProps) {
  // return data.reduce(studentReducer, []);
  // Example usage

  const sum = await asyncReduce(
    data,
    async (acc: Acc, val: StudentType) => {
      const { id, email, studentId, firstName } = val;
      const pdfDirectory = path.join(process.cwd(), 'uploads');

      const pdfPath = path.join(pdfDirectory, studentId + '.pdf');
      // const pdfPath = path.join(pdfDirectory, studentId + '-t2202-fill-21e.pdf');

      if (fs.existsSync(pdfPath)) {
        return [...acc, { id, firstName, email, attachmentPath: pdfPath }];
      }

      return [...acc, val]

    },
    // async (acc: Acc, val: StudentType) => {
    //   return acc.push({ ...val, attachmentPath: 'test' });
    // },
    []
  );

  console.log("SUM : ", sum.length)
  return sum;
}

const asyncReduce = async (array: StudentEmailProps, reducer: any, initialValue: Acc) => {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = await reducer(accumulator, array[i]);
  }
  return accumulator;
};