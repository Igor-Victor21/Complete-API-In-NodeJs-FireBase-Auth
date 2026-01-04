import fetch from 'node-fetch';
import admin from '../config/firebase.js';
import nodemailer from 'nodemailer';
import { UserRecord } from 'firebase-admin/auth';


export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email e senha obrigatórios' });

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();
    if (data.error) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const idToken = data.idToken;
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Cria cookie seguro HttpOnly
    res.cookie('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      // domain: 'http://localhost:5173',
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    // Retorna informações do usuário para o front
    return res.json({
      user: {
        email: decoded.email,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

// Enviar email de redefinição de senha
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    // Gera link de redefinição de senha no Firebase
    const link = await admin.auth().generatePasswordResetLink(email);

    // Configura Nodemailer com seu e-mail (remetente)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // seu e-mail
        pass: process.env.EMAIL_PASS  // senha de app
      }
    });

    // Mensagem do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // e-mail do usuário
      subject: 'Redefinição de senha',
      html: `<p>Olá! Clique no link abaixo para redefinir sua senha:</p>
             <a href="${link}">Redefinir senha</a>`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Link de redefinição de senha enviado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao enviar email", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token'); // remove cookie
  res.json({ message: 'Logout realizado' });
};
