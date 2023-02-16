import { NextApiRequest, NextApiResponse } from "next";
import express from "express";
import path from "path";
import fs from 'fs';
import nodemailer from "nodemailer";

const app = express();

app.post("/api/fetch-pdf", async (req, res) => {
  try {
    const { studentId } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });

    const pdfDirectory = path.join(process.cwd(), 'pdfs');
    const pdfPath = path.join(pdfDirectory, studentId + '-t2202-fill-21e.pdf')
    
    if (fs.existsSync(pdfPath)) {
      //file exists

      const mailOptions = {
        from: "node@mailer.com",
        to: "solid-body@b2ct8hvq.mailosaur.net",
        subject: `T2202 form for ${studentId}`,
        text: "This email contains an attachment",
        attachments: [
          {
            filename: 't2202-fill-21e.pdf',
            path: pdfPath,
            contentType: 'application/pdf'
          }
        ]
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
  
      // res.json({ msg: "success" });
      res.sendFile(pdfPath);

    }else{
      //file does not exist
      console.log('file does not exist')
      res.json({ msg: "error" });
    }

    
  } catch (err) {
    // Handle the error.
    res.send(err);
  }
});

export default app;