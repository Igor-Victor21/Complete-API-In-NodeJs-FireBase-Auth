import admin from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; // pega do cookie HttpOnly

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user.admin) return res.status(403).json({ message: "Acesso negado" });
  next();
};
