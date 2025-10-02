import admin from '../config/firebase.js';

export const makeAdmin = async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return res.json({ message: "Usuário promovido a admin com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao promover usuário", error: err });
  }
};
