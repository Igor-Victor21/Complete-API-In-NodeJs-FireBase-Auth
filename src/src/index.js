import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 9090;

// Permite acesso apenas do seu front-end
app.use(cors({
  origin: 'http://localhost:5173', // URL do seu front-end
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, 

}));

app.use(cookieParser()); 
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
