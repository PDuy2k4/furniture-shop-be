import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (to: string, name: string, accessToken: string) => {
  dotenv.config()

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: `FN Shop Team <${process.env.USER_EMAIL}>`,
      to: `${to}`,
      subject: 'VERIFY YOUR ACCOUNT',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Welcome to FNshop!</h2>
          <p>Hey <strong>${name}</strong>,</p>
          <p>Thank you for joining our community. We are delighted to have you with us.</p>
          <p>Please verify your email address by clicking the link below:</p>
          <p style="text-align: center;">
           Link: ${process.env.APP_BASE_URL}${process.env.VERIFY_EMAIL_ENDPOINT}?token=${accessToken}
          </p>
          <p>Enjoy your shopping experience on our website. If you encounter any issues, please feel free to contact us through this email.</p>
          <p>Best regards,</p>
          <p><strong>FNshop Team</strong></p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}
