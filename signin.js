const firebaseConfig = {
apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
authDomain: "inconforum.firebaseapp.com",
projectId: "inconforum",
appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};


if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


login.onclick = async () => {
try {
await auth.signInWithEmailAndPassword(email.value, password.value);
location.href = "index.html";
} catch (e) { error.textContent = e.message; }
};


signup.onclick = async () => {
try {
const cred = await auth.createUserWithEmailAndPassword(email.value, password.value);
await firebase.firestore().collection("users").doc(cred.user.uid).set({
username: "+User",
avatar: ""
});
location.href = "index.html";
} catch (e) { error.textContent = e.message; }
};
