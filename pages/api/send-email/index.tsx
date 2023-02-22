import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

import EmailTemplate from '@/email/emails/ciccc-t2202';
import cloudinary from '@/utils/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, id } = req.body;

  //commented out for now until all emails are unique in production
  // const exists = await prisma.student.findUnique({
  //   where: {
  //     email
  //   }
  // });

  const exists = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (exists) {
    try {
      const { message, status } = await sendEmail(exists);

      if (status === 250) {
        //update the status of the student
        await prisma.student.update({
          where: {
            id,
          },
          data: {
            status: 'sent',
          },
        });
      }

      res.status(status).json({ message, status });
    } catch ({ message, status }: any) {
      res.status(status as number).json({ message, status });
    }
  } else {
    res.status(400).json("User doesn't exists");
  }
}

type StudentProps = { studentId: string; email: string; firstName: string };

function sendEmail({
  studentId,
  email,
  firstName: name,
}: StudentProps): Promise<{ message: string; status: number }> {
  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: 587,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      cloudinary.v2.api.resource(studentId, function (error, result) {
        if (error) {
          console.log('cloud error: ', error);
          reject({
            message: "Failed to send email. Student's T2202 form doesn't exists",
            status: 404,
          });

        } else {
          const emailHtml = render(<EmailTemplate studentName={name} />, { pretty: true });

          const mailOptions = {
            from: `CICCC <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: `T2202 form for ${studentId}`,
            text: 'This email contains an attachment',
            attachments: [
              {
                filename: 't2202-fill-21e.pdf',
                path: result.secure_url,
                contentType: 'application/pdf',
              },
            ],
            html: emailHtml,
          };

          transporter.sendMail(mailOptions, (error: any, info) => {
            if (error) {
              reject({
                message: error.message || error.response,
                status: error.responseCode || 500,
              });
            } else {
              console.info(`Email sent [${email}]: ${info.response}`);
              resolve({ message: `Email sent to ${email}`, status: 250 });
            }
          });
        }
      });

    } catch (err: any) {
      // Handle the error.
      reject({ message: err.message || err, status: 500 });
    }
  });
}
