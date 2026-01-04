import admin from '../config/firebase.js';

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    // Verifica se é admin
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
