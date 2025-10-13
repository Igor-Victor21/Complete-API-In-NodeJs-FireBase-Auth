import fetch from 'node-fetch';
import admin from '../config/firebase.js';

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
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    // Retorna informações do usuário para o front
    return res.json({
      user: {
        uid: decoded.uid,
        email: decoded.email,
        admin: decoded.admin || false // claim admin
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token'); // remove cookie
  res.json({ message: 'Logout realizado' });
};
