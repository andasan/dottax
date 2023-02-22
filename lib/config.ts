const keys = process.env

export const config = {
  port: keys.PORT,
  databaseURL: keys.DATABASE_URL,
  clientUrl: keys.CLIENT_URL,
  assetsUrl: keys.ASSETS_URL,
  email: {
    host: keys.NODEMAILER_HOST,
    port: Number(keys.NODEMAILER_PORT),
    username: keys.NODEMAILER_USER,
    password: keys.NODEMAILER_PASS,
    from: keys.EMAIL_FROM,
    subject: keys.EMAIL_SUBJECT,
  },
  sibApiKey: keys.SIB_API_KEY,
  cloudinary: {
    cloud_name: keys.CLOUDINARY_NAME,
    api_key: keys.CLOUDINARY_API_KEY,
    api_secret: keys.CLOUDINARY_API_SECRET,
  },
}
