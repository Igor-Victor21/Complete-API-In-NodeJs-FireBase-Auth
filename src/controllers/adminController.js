import admin from '../config/firebase.js';

// Promove usuário a admin
export const makeAdmin = async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ message: 'Usuário promovido a admin!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao promover usuário', error: err.message });
  }
};

// Despromove usuário
export const removeAdmin = async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: false });
    res.json({ message: 'Usuário despromovido!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao despromover usuário', error: err.message });
  }
};
