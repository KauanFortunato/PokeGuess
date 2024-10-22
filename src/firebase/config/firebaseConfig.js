import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBBeLwAW-Ixdu8yOuLzm0kqEwNo0IFj7Mo',
	authDomain: 'pokeguess-3tgpsi.firebaseapp.com',
	projectId: 'pokeguess-3tgpsi',
	storageBucket: 'pokeguess-3tgpsi.appspot.com',
	messagingSenderId: '496865307713',
	appId: '1:496865307713:web:5455f6ea01241bca14aac0',
	measurementId: 'G-6FNZ4TR9YC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
