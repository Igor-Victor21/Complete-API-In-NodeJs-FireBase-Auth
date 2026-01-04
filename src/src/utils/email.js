import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Redefinição de senha',
    html: `<p>Para redefinir sua senha, clique no link abaixo:</p>
           <a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
};
