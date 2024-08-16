// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcnKck2s7pnhBQOpgvWgvDAZbATtX2KoM",
  authDomain: "school-managment-c81e1.firebaseapp.com",
  projectId: "school-managment-c81e1",
  storageBucket: "school-managment-c81e1.appspot.com",
  messagingSenderId: "933840088006",
  appId: "1:933840088006:web:79f3c2fc482e2e082e60c7",
  measurementId: "G-E4WX8GXQ8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  export default auth =getAuth(app)