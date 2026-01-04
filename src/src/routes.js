import express from 'express';
import userController from './controllers/userController.js';
import productController from './controllers/product.js';

import { loginLimiter } from './middlewares/rateLimiter.js';
import { login, logout, forgotPassword  } from './controllers/authController.js';

import { makeAdmin, removeAdmin } from './controllers/adminController.js';
import { verifyToken, verifyAdmin } from './middlewares/auth.js';
import upload from './middlewares/upload.js';

import { sendPasswordResetEmail } from './utils/email.js';



const { Router } = express;
const routes = Router();

// LOGIN / LOGOUT
routes.post('/login', loginLimiter, login);
routes.post('/logout', logout);

// ROTAS USUÁRIOS (apenas admins)
routes.get('/users', verifyToken, verifyAdmin, userController.listUsers);
routes.post('/users', verifyToken, verifyAdmin, userController.create);
routes.delete('/users/:id', verifyToken, verifyAdmin, userController.delete);


// ROTAS PRODUTOS (apenas admins)
routes.post('/products', verifyToken, verifyAdmin, upload.single('image'), productController.create);
routes.put('/products/:id', verifyToken, verifyAdmin, upload.single('image'), productController.update);
routes.delete('/products/:id', verifyToken, verifyAdmin, productController.delete);

//ROTAS PRODUTOS (pública)
routes.get('/products', productController.read);
routes.get('/products/:id', productController.readOne);

// DASHBOARD
routes.get('/admin/dashboard', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Bem-vindo, Admin!', user: req.user });
});

routes.get('/user/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Bem-vindo, Usuário!', user: req.user });
});

// ROTA ADMIN
routes.post('/make-admin/:uid', verifyToken, verifyAdmin, makeAdmin);
routes.post('/remove-admin/:uid', verifyToken, verifyAdmin, removeAdmin);


// ROTA REDEFINIR SENHA 
routes.post("/forgot-password", forgotPassword);



export default routes;
