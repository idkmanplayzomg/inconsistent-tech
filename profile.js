const firebaseConfig = {
apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
authDomain: "inconforum.firebaseapp.com",
projectId: "inconforum",
appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};


if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();


const uid = new URLSearchParams(location.search).get("uid");
let me = null;


auth.onAuthStateChanged(u => me = u);


const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const save = document.getElementById("save");
const input = document.getElementById("avatarInput");


let avatarData = "";


input.onchange = e => {
const reader = new FileReader();
reader.onload = () => avatarData = reader.result;
reader.readAsDataURL(e.target.files[0]);
};


const docRef = db.collection("users").doc(uid);


docRef.get().then(d => {
const u = d.data();
username.textContent = u.username;
avatar.src = u.avatar || "default.png";


if (me && me.uid === uid) save.style.display = "block";
});


save.onclick = async () => {
await docRef.update({ avatar: avatarData });
location.reload();
};
