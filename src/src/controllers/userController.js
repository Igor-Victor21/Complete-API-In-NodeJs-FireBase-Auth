import admin from '../config/firebase.js';
import zxcvbn from 'zxcvbn';

const MIN_PASSWORD_SCORE = 3; // segurança mínima

const userController = {

  // Criar usuário no Firebase Authentication
  create: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Verifica força da senha
    const result = zxcvbn(password);
    if (result.score < MIN_PASSWORD_SCORE) {
      return res.status(400).json({ message: 'Senha muito fraca.' });
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password
      });

      // Claim padrão: usuário comum
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: false });

      res.json({ message: 'Usuário criado com sucesso!', uid: userRecord.uid, email: userRecord.email, admin: false });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
    }
  },
  // Deletar usuário

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await admin.auth().deleteUser(id);
      res.json({ message: 'Usuário deletado com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao deletar usuário', error: err.message });
    }
  },

  // Listar usuários
  listUsers: async (req, res) => {
    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      const users = listUsersResult.users.map(u => ({
        uid: u.uid,
        email: u.email,
        admin: u.customClaims?.admin || false
      }));
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
  }


};

export default userController;
