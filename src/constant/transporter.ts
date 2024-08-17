import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pnam3072004@gmail.com', // Your email
        pass: 'wjom ezdl rvhe ufxm', // Your email password
    },
});

export default transporter;