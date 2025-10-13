import admin from '../config/firebase.js';
import zxcvbn from 'zxcvbn';

const MIN_PASSWORD_SCORE = 7;
const userController = {
  create: async (req, res) => {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Verifica força da senha
    const result = zxcvbn(password);
    if (result.score < MIN_PASSWORD_SCORE) {
      return res.status(400).json({ message: 'Senha muito fraca. Use letras, números e símbolos.' });
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName
      });

      // Você pode adicionar claims default de usuário comum
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: false });

      return res.json({ message: 'Usuário criado com sucesso!', uid: userRecord.uid });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao criar usuário', error: err });
    }
  }
};

export default userController;
