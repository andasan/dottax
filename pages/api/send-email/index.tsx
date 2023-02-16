import { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

import EmailTemplate from "@/email/emails/ciccc-t2202";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, id } = req.body;

  //commented out for now until all emails are unique in production
  // const exists = await prisma.student.findUnique({
  //   where: {
  //     email
  //   }
  // });

  const exists = await prisma.student.findUnique({
    where: {
      id
    }
  });

  if (exists) {
    try {
      const { message, status } = await sendEmail(exists);

      if (status === 250) {
        //update the status of the student
        await prisma.student.update({
          where: {
            id
          },
          data: {
            status: "sent"
          }
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

type StudentProps = { studentId: string; email: string, name: string };

function sendEmail({
  studentId,
  email,
  name,
}: StudentProps): Promise<{ message: string; status: number }> {
  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: 587,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS
        }
      });

      const pdfDirectory = path.join(process.cwd(), "pdfs");
      const pdfPath = path.join(pdfDirectory, studentId + ".pdf");

      if (fs.existsSync(pdfPath)) {
        //file exists
        const emailHtml = render(<EmailTemplate studentName={name} />, { pretty: true })

        const mailOptions = {
          from: `CICCC <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: `T2202 form for ${studentId}`,
          text: "This email contains an attachment",
          attachments: [
            {
              filename: "t2202-fill-21e.pdf",
              path: pdfPath,
              contentType: "application/pdf"
            }
          ],
          html: emailHtml
        };

        transporter.sendMail(mailOptions, (error: any, info) => {
          if (error) {
            reject({
              message: error.message || error.response,
              status: error.responseCode || 500
            });
          } else {
            console.info(`Email sent [${email}]: ${info.response}`);
            resolve({ message: `Email sent to ${email}`, status: 250 });
          }
        });
      } else {
        //file does not exist
        reject({
          message: "Failed to send email. Student's T2202 form doesn't exists",
          status: 404
        });
      }
    } catch (err: any) {
      // Handle the error.
      reject({ message: err.message || err, status: 500 });
    }
  });
}