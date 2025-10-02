import { db } from '../config/firebase.js';

export default {
  create: async (req, res) => {
    try {
      const { name, description, width, height, length, price, image, section } = req.body;
      const newProduct = {
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        image,
        section: section || 'Todos',
      };
      const docRef = await db.collection('products').add(newProduct);
      return res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  },

  read: async (req, res) => {
    try {
      const section = req.query.section?.toString();
      let query = db.collection('products');
      if (section) query = query.where('section', '==', section);
      const querySnapshot = await query.get();
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },

  readOne: async (req, res) => {
    try {
      const id = req.params.id;
      const productDoc = await db.collection('products').doc(id).get();
      if (!productDoc.exists) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.status(200).json({ id: productDoc.id, ...productDoc.data() });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description, width, height, length, price, image, section } = req.body;
      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      if (!product.exists) return res.status(404).json({ error: 'Produto não encontrado' });

      await productRef.update({
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        image,
        section,
      });

      return res.status(200).json({ id, name, description, price, section });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      if (!product.exists) return res.status(404).json({ error: 'Produto não encontrado' });

      await productRef.delete();
      return res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }
};
