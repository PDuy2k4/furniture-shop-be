import transporter from "~/constant/transporter";

export const sendEmail = async (email: string, token: string, type: 'reset' | 'verify') => {
    let subject: string;
    let text: string;

    if (type === 'reset') {
        subject = 'Reset your password';
        text = `Click on the link to reset your password: http://localhost:3000/resetPass?token=${token}`;
    } else if (type === 'verify') {
        subject = 'Verify your email';
        text = `Click on the link to verify your email: http://localhost:3000/verify?token=${token}`;
    } else {
        throw new Error('Invalid email type');
    }

    const mailOptions = {
        from: 'pnam3072004@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    await transporter.sendMail(mailOptions);
};