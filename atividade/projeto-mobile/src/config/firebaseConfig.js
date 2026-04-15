import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBea-7K8LaCqpE0ER7UUdgRurG1y1ID_38",
  authDomain: "pratica02-lucasdomingues.firebaseapp.com",
  projectId: "pratica02-lucasdomingues",
  storageBucket: "pratica02-lucasdomingues.firebasestorage.app",
  messagingSenderId: "459628847623",
  appId: "1:459628847623:web:c38c4ea0bc4de5233c00a2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);