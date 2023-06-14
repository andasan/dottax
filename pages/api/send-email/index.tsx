import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import prisma from '@/lib/prisma';

import EmailTemplate from '@/email/emails/ciccc-t2202';
import cloudinary from '@/utils/cloudinary';
import { config } from '@/lib/config';
import apiInstance, { sendSmtpEmail } from '@/lib/sendinblue';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, id } = req.body;

  //commented out for now until all emails are unique in production
  // const exists = await prisma.studentproto.findUnique({
  //   where: {
  //     email
  //   }
  // });

  const exists = await prisma.studentproto.findUnique({
    where: {
      id,
    },
  });

  if (exists) {
    try {
      const { message, status } = await sendEmail(exists);

      if (status === 250) {
        //update the status of the student
        await prisma.studentproto.update({
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

type StudentProps = { studentId: string; email: string; firstName: string, lastName: string };

function sendEmail({
  studentId,
  email,
  firstName,
  lastName
}: StudentProps): Promise<{ message: string; status: number }> {
  return new Promise((resolve, reject) => {
    try {
      // cloudinary.v2.api.resources().then((result) => console.log(result))

      const identifier = `${firstName.split(' ').join('_')}_${lastName.split(' ').join('_')}`
      cloudinary.v2.api.resource(identifier, function (error, result) {

        if (error) {
          console.log('cloud error: ', error);
          reject({
            message: "Failed to send email. Student's T2202 form doesn't exists",
            status: 404,
          });

        } else {
          const emailHtml = render(<EmailTemplate studentName={firstName} />, { pretty: true });

          const mailOptions = {
            from: config.email.from || 'tax@ciccc.ca',
            to: email,
            subject: config.email.subject || 'T2202 Form',
            attachments: [
              {
                name: 't2202-fill-21e.pdf',
                url: result.secure_url,
              },
            ],
            html: emailHtml,
          };

          const { to, from, subject, attachments, html } = mailOptions;

          sendSmtpEmail.subject = subject;
          sendSmtpEmail.htmlContent = html;
          sendSmtpEmail.sender = { "name": "Tax CICCC", "email": from };
          sendSmtpEmail.to = [{ "email": to, "name": `${firstName} ${lastName}` }];
          sendSmtpEmail.replyTo = { "email": "tax@ciccc.ca", "name": "Tax CICCC" };
          sendSmtpEmail.attachment = attachments;

          apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data: any) {
            // console.info('API called successfully. Returned data: ' + JSON.stringify(data));
            resolve({ message: `Email sent to ${email}`, status: 250 });

          }, function (error: any) {
            console.error(error);
            reject({
              message: error.message || error.response,
              status: error.responseCode || 500,
            });
          });
        }
      });

    } catch (err: any) {
      // Handle the error.
      reject({ message: err.message || err, status: 500 });
    }
  });
}
