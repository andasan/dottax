import { parseForm } from '@/lib/parse-form';
import cloudinary from '@/utils/cloudinary';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      message: null,
      error: 'Method Not Allowed',
    });
    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    const { fields, files } = await parseForm(req);

    const data = JSON.parse(JSON.stringify({ files }))

    if(Array.isArray(data.files.media)){

      const filesToUpload = data.files.media.filter((file) => {
        return file;
      });

      filesToUpload.forEach(async (file) => {
        await cloudinary.v2.uploader.upload(file.filepath, {
          unique_filename: false,
          use_filename: true
        }, (err, result) => {

          if (err) {
            console.error(err.message);
            throw new Error(err.message)
          }

          fs.unlink(file.filepath, function(err) {
            if (err) {
              console.error(err);
              throw new Error(err.message)
            }
          });
        });
      })
    }else{

      await cloudinary.v2.uploader.upload(data.files.media.filepath, {
          unique_filename: false,
          use_filename: true
        }, (err, result) => {
          if (err) {
            console.error(err.message);
            throw new Error(err.message)
          }

          fs.unlink(data.files.media.filepath, function(err) {
            if (err) {
              console.error(err);
              throw new Error(err.message)
            }
          });
        });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      error: null,
    });
  } catch (e) {
    if (e) {
      res.status(e.httpCode || 400).json({ message: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: null, error: 'Internal Server Error' });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
