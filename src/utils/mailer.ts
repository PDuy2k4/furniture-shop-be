import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (to: string, name: string) => {
  dotenv.config()
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_EMAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: `Furniture Shop" ${process.env.USER_EMAIL}`,
    to: to,
    subject: 'Verify your email',
    html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">Welcome to Furniture Shop!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for registering with Furniture Shop. We are delighted to have you with us.</p>
            <p>Please verify your email address by clicking the link below:</p>
            <p style="text-align: center;">
              <a href="${process.env.APP_BASE_URL}${process.env.VERIFY_EMAIL_ENDPOINT}?email=${to}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </p>
            <p>If you did not register for an account, please ignore this email.</p>
            <p>Best regards,</p>
            <p><strong>Furniture Shop Team</strong></p>
          </div>
        `
  }
  await transporter.sendMail(mailOptions)
}
