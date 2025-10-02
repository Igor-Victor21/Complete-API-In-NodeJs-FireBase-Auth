import express from 'express';
import userController from './controllers/userController.js';
import productController from './controllers/product.js';
import { login } from './controllers/authController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import { makeAdmin } from './controllers/adminController.js';
import { verifyToken, verifyAdmin } from './middlewares/auth.js';


const { Router } = express;
const routes = Router();

// LOGIN
routes.post('/login', login);

// ROTAS PRIVADAS (apenas admins)
routes.post('/users', authMiddleware, (req, res) => userController.create(req,res));
routes.get('/users', authMiddleware, (req, res) => userController.read(req,res));
routes.put('/users/:id', authMiddleware, (req, res) => userController.update(req,res));
routes.delete('/users/:id', authMiddleware, (req, res) => userController.delete(req,res));

routes.post('/products', authMiddleware, (req, res) => productController.create(req,res));
routes.get('/products', authMiddleware, (req, res) => productController.read(req,res));
routes.get('/products/:id', authMiddleware, (req, res) => productController.readOne(req,res));
routes.put('/products/:id', authMiddleware, (req, res) => productController.update(req,res));
routes.delete('/products/:id', authMiddleware, (req, res) => productController.delete(req,res));
routes.post("/make-admin/:uid", verifyToken, verifyAdmin, makeAdmin);


export default routes;
