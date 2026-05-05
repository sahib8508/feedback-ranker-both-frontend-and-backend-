// Firebase Initialization Check and Setup
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAtJtjawIAi8oks8I5rwd7WOyMExQ01uQ",
  authDomain: "help-desk-campusconnect.firebaseapp.com",
  projectId: "help-desk-campusconnect",
  storageBucket: "help-desk-campusconnect.firebasestorage.app", // Verified from Firebase Console
  messagingSenderId: "967989626762",
  appId: "1:967989626762:web:393f97a41ede3f6f73aa73",
  measurementId: "G-3TX90LVSL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Check Firebase Storage initialization
console.log('Firebase Storage initialized:', storage ? 'Yes' : 'No');

// The correct way to access storage in Firebase v9+ is through the ref() function
try {
  const testRef = ref(storage, 'test-file.txt');
  console.log('Firebase Storage reference created successfully:', testRef);
} catch (error) {
  console.error('Error creating storage reference:', error);
}

// Connect to Firebase emulators in development environment
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
  // Connect to Auth Emulator
  connectAuthEmulator(auth, 'http://localhost:9099');
  
  // Connect to Firestore Emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Connect to Storage Emulator
  connectStorageEmulator(storage, 'localhost', 9199);
  
  console.log('Connected to Firebase emulators');
}

// Simple test function to verify Firebase Storage is working
const testStorageConnection = async () => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, 'test-connection.txt');
    
    // Create a simple text file
    const testData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello" in bytes
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, testData);
    console.log('Storage test successful! File uploaded:', snapshot);
    
    // Get the download URL to verify the file is accessible
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at', downloadURL);
    
    return true;
  } catch (error) {
    console.error('Storage test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};

// Uncomment the line below to run the test when this file loads
// testStorageConnection();

// Export the Firebase services
export { db, storage, auth, testStorageConnection };