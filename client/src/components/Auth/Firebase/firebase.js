import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

// For the life of me I cant get REACT (when in client/) to read ENV vars and google isnt helping me ...
// Firebase Config using react env
// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
// };
const config = {
  apiKey: "AIzaSyDCddfdNSdSf19cWK7je91aJtlyh3zBp4Q",
  authDomain: "project3-noahpauljj-fintech2.firebaseapp.com",
  databaseURL: "https://project3-noahpauljj-fintech2.firebaseio.com",
  projectId: "project3-noahpauljj-fintech2",
  storageBucket: "project3-noahpauljj-fintech2.appspot.com",
  messagingSenderId: "87243866145"
};

console.log("fb config", config);
console.log("process.env", process.env);
class Firebase {
  constructor() {
    try {
      firebase.initializeApp(config);
    } catch (err) {
      // we skip the "already exists" message which is
      // not an actual error when we're hot-reloading
      if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
      }
    }

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.functions = firebase.functions();
  }

  db2 = () => {
    let db = firebase.firestore();
    return(db);
  }

  fbFunctions = () => {
    let fbFunctions = firebase.functions();
    return(fbFunctions);
  }

  // *** Firebase Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password).then((authData) => {
          console.log("User created successfully with payload-", authData);
          return resolve(authData);
        }).catch((err) => {
          console.error("User create failed!", err);
          return reject(err);
        }) 
    }); // Promise  
  }

  doSignInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then((authData) => {
          console.log("User logged in successfully with payload-", authData);
          return resolve(authData);
        }).catch((err) => {
          console.error("Login Failed!", err);
          return reject(err);
        }) 
    }); // Promise
  }

  doSignInWithGoogle = () => {
    return this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  doSignOut = () => {
    this.auth.signOut();
  }

  doPasswordReset = (email) => {
    return new Promise((resolve, reject) => {
      this.auth.sendPasswordResetEmail(email).then((authData) => {
          console.log("User email reset sent successfully with payload-", authData);
          return resolve(authData);
        }).catch((err) => {
          console.error("Login Failed!", err);
          return reject(err);
        }) 
    }); // Promise
  }

  doPasswordUpdate = (password) => {
    return new Promise((resolve, reject) => {
      this.auth.currentUser.updatePassword(password).then((authData) => {
          console.log("User email reset sent successfully with payload-", authData);
          return resolve(authData);
        }).catch((err) => {
          console.error("Login Failed!", err);
          return reject(err);
        }) 
    }); // Promise
  }
}

export default Firebase;