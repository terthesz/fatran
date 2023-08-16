import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_API,
  authDomain: 'fatran37.firebaseapp.com',
  projectId: 'fatran37',
  storageBucket: 'fatran37.appspot.com',
  messagingSenderId: '830328084523',
  appId: process.env.NEXT_PUBLIC_FB_ID,
  measurementId: 'G-7G5X5B6W5Q',
  databaseURL:
    'https://fatran37-default-rtdb.europe-west1.firebasedatabase.app/',
};

getApps().length ? getApp() : initializeApp(config);
