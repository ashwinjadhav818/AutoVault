import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth'; // Import browserLocalPersistence for web
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for React Native

const firebaseConfig = {
    apiKey: process.env.REACT_NATIVE_FIREBASE_API_KEY,
    authDomain: process.env.REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_NATIVE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_NATIVE_FIREBASE_APP_ID,
    measurementId: process.env.REACT_NATIVE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export { db, auth };

