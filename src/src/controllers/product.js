import { db } from '../config/firebase.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default {

  create: async (req, res) => {
    try {

      console.log('REQ.FILE =>', req.file);
      console.log('REQ.BODY =>', req.body);

      const { name, description, width, height, length, price, section } = req.body;
      const file = req.file;

      if (!file) return res.status(400).json({ error: 'Imagem obrigatória' });

      const uploadResult = await uploadToCloudinary(file.buffer);

      const newProduct = {
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        section: section || 'Todos',
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id
      };

      const docRef = await db.collection('products').add(newProduct);

      return res.status(201).json({ id: docRef.id, ...newProduct });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description, width, height, length, price, section } = req.body;
      const file = req.file;

      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      if (!product.exists) return res.status(404).json({ error: 'Produto não encontrado' });

      const data = {
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        section
      };

      if (file) {
        const oldPublicId = product.data().imagePublicId;
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);

        const uploadResult = await uploadToCloudinary(file.buffer);
        data.imageUrl = uploadResult.secure_url;
        data.imagePublicId = uploadResult.public_id;
      }

      await productRef.update(data);

      return res.status(200).json({ id, ...data });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      if (!product.exists) return res.status(404).json({ error: 'Produto não encontrado' });

      const { imagePublicId } = product.data();
      if (imagePublicId) await cloudinary.uploader.destroy(imagePublicId);

      await productRef.delete();

      return res.status(200).json({ message: 'Produto deletado com sucesso' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
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
  }
};
