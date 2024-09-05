import { initializeApp } from "firebase/app";
import { getAnalytics } from "@firebase/analytics";
// add the firestore and auth imports here  
import { getFirestore } from '@firebase/firestore';
import  { getDatabase } from '@firebase/database';
import { getAuth } from '@firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAawGNS5ziCxw4F25lLKXZTtphZGs59SsQ",
  authDomain: "hdauto-launch-project.firebaseapp.com",
  databaseURL: "https://hdauto-launch-project-default-rtdb.firebaseio.com",
  projectId: "hdauto-launch-project",
  storageBucket: "hdauto-launch-project.appspot.com",
  messagingSenderId: "545918483123",
  appId: "1:545918483123:web:45329a2ae2586b63fe8ec6",
  measurementId: "G-123PWN7911"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
export default { getDatabase, getAuth };