export const config = {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URL,
  clientUrl: process.env.CLIENT_URL,
  assetsUrl: process.env.ASSETS_URL,
  email: {
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    username: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASS,
    from: process.env.EMAIL_FROM,
    subject: process.env.EMAIL_SUBJECT,
  },
  sibApiKey: process.env.SIB_API_KEY,
};
