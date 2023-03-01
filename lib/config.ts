export const config = {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URL,
  clientUrl: process.env.CLIENT_URL,
  assetsUrl: process.env.ASSETS_URL,
  email: {
    from: process.env.EMAIL_FROM,
    subject: process.env.EMAIL_SUBJECT,
  },
  sibApiKey: process.env.SIB_API_KEY,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
}
