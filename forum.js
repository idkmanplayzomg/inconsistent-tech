alert("Hello, This is a beta! This message will appear. all issues will be resolved by me. i do stress test these sites.");


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
  authDomain: "inconforum.firebaseapp.com",
  projectId: "inconforum",
  storageBucket: "inconforum.appspot.com",
  messagingSenderId: "1545059128",
  appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};

// Init (guard against double init)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM
const postBody = document.getElementById("postBody");
const postImage = document.getElementById("postImage");
const submitPostBtn = document.getElementById("submitPostBtn");
const postsDiv = document.getElementById("posts");
const postingStatus = document.getElementById("postingStatus");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

// Auth state
auth.onAuthStateChanged(user => {
  currentUser = user;
  loginBtn.style.display = user ? "none" : "inline-block";
  logoutBtn.style.display = user ? "inline-block" : "none";
});

loginBtn.onclick = () => location.href = "signin.html";
logoutBtn.onclick = () => auth.signOut();

// Create post
submitPostBtn.onclick = async () => {
  if (!currentUser) return alert("Sign in first");
  if (!postBody.value.trim()) return;

  postingStatus.textContent = "Posting…";

  let imageURL = "";

  if (postImage.files[0]) {
    const fileRef = storage
      .ref()
      .child(`posts/${currentUser.uid}_${Date.now()}`);

    await fileRef.put(postImage.files[0]);
    imageURL = await fileRef.getDownloadURL();
  }

  await db.collection("posts").add({
    body: postBody.value,
    image: imageURL,
    uid: currentUser.uid,
    username: currentUser.displayName || currentUser.email,
    timestamp: Date.now()
  });

  postBody.value = "";
  postImage.value = "";
  postingStatus.textContent = "";
};

// Feed
db.collection("posts")
  .orderBy("timestamp", "desc")
  .onSnapshot(snap => {
    postsDiv.innerHTML = "";
    snap.forEach(doc => {
      const p = doc.data();
      const el = document.createElement("div");
      el.className = "card post";
      el.innerHTML = `
        <strong>${p.username}</strong>
        <p>${p.body}</p>
        ${p.image ? `<img src="${p.image}">` : ""}
      `;
      postsDiv.appendChild(el);
    });
  });
