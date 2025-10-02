import { db } from '../config/firebase.js';

export default {
  create: async (req, res) => {
    try {
      const { fullName, email, password, cpf, cep, address, complement, numberPhone, dateOfBirth } = req.body;
      if (!fullName || !email || !cpf)
        return res.status(400).json({ error: 'Nome completo, email e CPF são obrigatórios' });

      const userData = {
        fullName,
        email,
        password,
        cpf,
        cep: cep || null,
        address: address || null,
        complement: complement || null,
        numberPhone: numberPhone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : null
      };

      const docRef = await db.collection('users').add(userData);
      return res.status(201).json({ id: docRef.id, ...userData });
    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({ error: 'Falha ao criar usuário' });
    }
  },

  read: async (req, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao ler usuários' });
    }
  },

  update: async (req, res) => {
    const uid = req.params.id;
    const data = req.body;
    try {
      await db.collection('users').doc(uid).update(data);
      return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  delete: async (req, res) => {
    const uid = req.params.id;
    try {
      await db.collection('users').doc(uid).delete();
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};
