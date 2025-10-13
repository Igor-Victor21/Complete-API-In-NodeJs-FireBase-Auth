import express from 'express';
import userController from './controllers/userController.js';
import productController from './controllers/product.js';

import { loginLimiter } from './middlewares/rateLimiter.js';
import { login, logout } from './controllers/authController.js';
import { makeAdmin } from './controllers/adminController.js';
import { verifyToken, verifyAdmin } from './middlewares/auth.js';
import authMiddleware from './middlewares/authMiddleware.js';


const { Router } = express;
const routes = Router();

// LOGIN
routes.post('/login', loginLimiter, login);
//LOGOUT
routes.post('/logout', logout);


// ROTAS PRIVADAS (apenas admins)
routes.post('/users', verifyToken, verifyAdmin, userController.create);
routes.get('/users', verifyToken, verifyAdmin, (req, res) => userController.read(req, res));
routes.put('/users/:id', verifyToken, verifyAdmin, (req, res) => userController.update(req, res));
routes.delete('/users/:id', verifyToken, verifyAdmin, (req, res) => userController.delete(req, res));

routes.post('/products', verifyToken, verifyAdmin, (req, res) => productController.create(req, res));
routes.get('/products', verifyToken, verifyAdmin, (req, res) => productController.read(req, res));
routes.get('/products/:id', verifyToken, verifyAdmin, (req, res) => productController.readOne(req, res));
routes.put('/products/:id', verifyToken, verifyAdmin, (req, res) => productController.update(req, res));
routes.delete('/products/:id', verifyToken, verifyAdmin, (req, res) => productController.delete(req, res));

// Apenas ADMIN
routes.get('/admin/dashboard', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Bem-vindo, Admin!', user: req.user });
});

// Qualquer usuário autenticado (inclusive não-admin)
routes.get('/user/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Bem-vindo, Usuário!', user: req.user });
});

//ROTA ADMIN
// routes.post("/make-admin/:uid", verifyToken, verifyAdmin, makeAdmin);
routes.post("/make-admin/:uid", makeAdmin);



export default routes;
