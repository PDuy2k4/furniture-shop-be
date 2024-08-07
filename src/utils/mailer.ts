import mailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = (email: string, subject: string, htmlContent: string) => {
  const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT as string),
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME as string,
      pass: process.env.MAIL_PASSWORD as string
    }
  })

  return transporter.sendMail({
    from: `${process.env.MAIL_FROM_NAME as string} <FNshop@gmail.dev>`,
    to: email,
    subject,
    html: htmlContent,
    headers: {
      'X-Priority': '1'
    }
  })
}
