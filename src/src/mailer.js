import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Suporte Meu Sistema" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Redefinição de senha",
    html: `
      <p>Olá,</p>
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo para redefinir:</p>
      <a href="${link}">${link}</a>
    `,
  });
};
