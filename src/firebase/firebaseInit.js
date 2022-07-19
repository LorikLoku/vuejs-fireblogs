//Konfigurimi i firebase (lidhja e firebase me projekt)

import firebase from "firebase/app";
import "firebase/firestore";

//FireBlogsYT	- loriku1998@gmail.com
const firebaseConfig = {
  apiKey: "AIzaSyBWbNO5wYeYEKQv6K8HjJBxvoPL85F_quE",
  authDomain: "fireblogsyt-29604.firebaseapp.com",
  projectId: "fireblogsyt-29604",
  storageBucket: "fireblogsyt-29604.appspot.com",
  messagingSenderId: "902286158792",
  appId: "1:902286158792:web:e329b44f43f3c1f01d6efd",
};

//inicializimi i projektit
const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {timestamp};
export default firebaseApp.firestore();