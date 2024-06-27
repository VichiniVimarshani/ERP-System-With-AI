// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBSyERWupbkIqnitP3al5weFF73SvEvF2s",
//     authDomain: "eliotweb-hameem-group-pvt-f01.firebaseapp.com",
//     projectId: "eliotweb-hameem-group-pvt-f01",
//     storageBucket: "eliotweb-hameem-group-pvt-f01.appspot.com",
//     messagingSenderId: "388568985813",
//     appId: "1:388568985813:web:3c25a96e8fc2081f7b725c"
// };

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxyGPeq0rHBCj8V5FDKn1e9nNkJRwRRj4",
  authDomain: "employee-management-syst-eb205.firebaseapp.com",
  projectId: "employee-management-syst-eb205",
  storageBucket: "employee-management-syst-eb205.appspot.com",
  messagingSenderId: "341270755132",
  appId: "1:341270755132:web:1077e09613048b6cae1039",
  measurementId: "G-C26PF9PJ4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };