// src/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes.js';
import 'dotenv/config';

const app = express();

// Se rodando atrás de proxy (Render, Heroku) — ajuda express-rate-limit e req.ip corretos
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Configura CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173', // seu front local
  // adiciona aqui sua URL em produção se houver
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // importantíssimo para cookies com fetch/axios
}));

app.use(express.json());
app.use(cookieParser());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
