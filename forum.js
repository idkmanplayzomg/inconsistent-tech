const firebaseConfig = {
apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
authDomain: "inconforum.firebaseapp.com",
projectId: "inconforum",
appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};


if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();


const postsDiv = document.getElementById("posts");
const postBody = document.getElementById("postBody");
const submitBtn = document.getElementById("submitPostBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");


let currentUser = null;


auth.onAuthStateChanged(user => {
currentUser = user;
loginBtn.style.display = user ? "none" : "inline-block";
logoutBtn.style.display = user ? "inline-block" : "none";
});


loginBtn.onclick = () => location.href = "signin.html";
logoutBtn.onclick = () => auth.signOut();


submitBtn.onclick = async () => {
if (!currentUser || !postBody.value.trim()) return;


await db.collection("posts").add({
uid: currentUser.uid,
body: postBody.value,
timestamp: Date.now()
});


postBody.value = "";
};


// Stable render (no flashing)
db.collection("posts").orderBy("timestamp", "desc").onSnapshot(async snap => {
const users = {};
const html = [];


for (const doc of snap.docs) {
const p = doc.data();


if (!users[p.uid]) {
const u = await db.collection("users").doc(p.uid).get();
users[p.uid] = u.exists ? u.data() : {};
}


const u = users[p.uid];


html.push(`
<div class="card post">
<div class="post-header">
<img class="avatar" src="${u.avatar || 'default.png'}">
<a href="profile.html?uid=${p.uid}" class="username">${u.username || 'User'}</a>
<span class="time">${new Date(p.timestamp).toLocaleString()}</span>
</div>
<p>${p.body}</p>
</div>
`);
}


postsDiv.innerHTML = html.join("");
});
