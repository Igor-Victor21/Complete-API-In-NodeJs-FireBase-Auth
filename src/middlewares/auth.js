import admin from '../config/firebase.js';

// Verifica se o usuário está logado
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Verifica se o usuário é admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
};
