import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Permite acesso apenas do seu front-end
app.use(cors({
  origin: 'http://localhost:5173', // URL do seu front-end
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
