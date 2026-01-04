import admin from './src/config/firebase.js'; // ajuste o caminho se necessário

const uid = "lR1LUNarDkPfvutaV4EF3nJZxG02"; // UID do usuário que será admin

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Usuário marcado como admin!");
  })
  .catch((error) => {
    console.error("Erro ao marcar como admin:", error);
  });
