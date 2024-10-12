import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Inicialize o Firebase Admin SDK com a chave da conta de serviço
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lifin-992d0.firebaseio.com'
});

// Inicialize os serviços do Firebase Admin
const db = admin.firestore(); // Firestore do backend
const auth = admin.auth();    // Authentication do backend

export { db, auth };
