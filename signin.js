console.log("signin.js loaded");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
  authDomain: "inconforum.firebaseapp.com",
  projectId: "inconforum",
  storageBucket: "inconforum.appspot.com",
  messagingSenderId: "1545059128",
  appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};

// Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM
const email = document.getElementById("email");
const password = document.getElementById("password");

document.getElementById("googleLogin").onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  location.href = "index.html";
};

document.getElementById("emailLogin").onclick = async () => {
  await auth.signInWithEmailAndPassword(email.value, password.value);
  location.href = "index.html";
};

document.getElementById("emailSignup").onclick = async () => {
  await auth.createUserWithEmailAndPassword(email.value, password.value);
  location.href = "index.html";
};
