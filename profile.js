const firebaseConfig = {
  apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
  authDomain: "inconforum.firebaseapp.com",
  projectId: "inconforum",
  storageBucket: "inconforum.appspot.com",
  messagingSenderId: "1545059128",
  appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const uid = new URLSearchParams(location.search).get("uid");
if (!uid) location.href = "index.html";

const banner = document.getElementById("profileBanner");
const avatar = document.getElementById("profileAvatar");
const name = document.getElementById("profileName");
const bio = document.getElementById("profileBio");
const postsDiv = document.getElementById("profilePosts");

/* Load user profile */
db.collection("users").doc(uid).get().then(doc => {
  if (!doc.exists) return;
  const u = doc.data();
  banner.src = u.bannerURL || "default-banner.jpg";
  avatar.src = u.photoURL || "default-avatar.png";
  name.textContent = u.displayName;
  bio.textContent = u.bio || "";
});

/* Load posts */
db.collection("posts")
  .where("uid", "==", uid)
  .orderBy("timestamp", "desc")
  .onSnapshot(snap => {
    postsDiv.innerHTML = "";
    snap.forEach(d => {
      const p = d.data();
      const el = document.createElement("div");
      el.className = "card post";
      el.innerHTML = `
        <p>${p.body}</p>
        ${p.image ? `<img src="${p.image}">` : ""}
      `;
      postsDiv.appendChild(el);
    });
  });
