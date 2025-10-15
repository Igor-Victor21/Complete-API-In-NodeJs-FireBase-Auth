import fetch from 'node-fetch';
import admin from '../config/firebase.js';
import nodemailer from 'nodemailer';

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha obrigatórios' });
  }

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
    if (data.error) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const idToken = data.idToken;
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Cria cookie seguro HttpOnly
    res.cookie('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 1h
    });

    // Busca dados básicos do usuário
    const userRecord = await admin.auth().getUser(decoded.uid);

    return res.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || null,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email é obrigatório" });

  try {
    const link = await admin.auth().generatePasswordResetLink(email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de senha',
      html: `<p>Olá! Clique no link abaixo para redefinir sua senha:</p>
             <a href="${link}">Redefinir senha</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Link de redefinição de senha enviado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao enviar email", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado' });
};
