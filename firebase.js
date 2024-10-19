import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';
import { initializeAuth, browserLocalPersistence } from '@react-native-firebase/auth'; // Import browserLocalPersistence for web
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for React Native

const firebaseConfig = {
    clientId: '',
    appId: process.env.REACT_NATIVE_FIREBASE_APP_ID,
    apiKey: process.env.REACT_NATIVE_FIREBASE_API_KEY,
    databaseURL: '',
    storageBucket: process.env.REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
    projectId: process.env.REACT_NATIVE_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, { persistence: AsyncStorage });

export { db, auth };

