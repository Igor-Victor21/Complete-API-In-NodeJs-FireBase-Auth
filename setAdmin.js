import 'dotenv/config';
import admin from 'firebase-admin';

// Inicializa primeiro
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Agora aplica o claim
const uid = "lR1LUNarDkPfvutaV4EF3nJZxG02"; 

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Usuário ${uid} agora é ADMIN`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro ao definir admin:", error);
    process.exit(1);
  });
