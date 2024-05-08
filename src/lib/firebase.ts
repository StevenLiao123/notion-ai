// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-ai-ebfed.firebaseapp.com",
  projectId: "notion-ai-ebfed",
  storageBucket: "notion-ai-ebfed.appspot.com",
  messagingSenderId: "453825134516",
  appId: "1:453825134516:web:0bac21af8837cf5273bce1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(image_url: string, name: string) {
    try {
        const response = await fetch(image_url);
        console.log('image response', response);

        const buffer = await response.arrayBuffer();
        console.log('buffer', buffer);

        const file_name = name.replace(' ', '') + Date.now + '.jpeg';
        const storageRef = ref(storage, file_name);
        await uploadBytes(storageRef, buffer, {
            contentType: 'image/jpeg'
        });

        const firebase_url = await getDownloadURL(storageRef);
        return firebase_url
    } catch (error) {
        console.log(error);
    }
}