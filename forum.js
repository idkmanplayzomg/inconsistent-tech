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

db.collection("posts")
  .orderBy("timestamp", "desc")
  .onSnapshot(async snap => {
    postsDiv.innerHTML = "";

    for (const doc of snap.docs) {
      const post = doc.data();
      const userDoc = await db.collection("users").doc(post.uid).get();
      const user = userDoc.exists ? userDoc.data() : {};

      const el = document.createElement("div");
      el.className = "card post";
      el.innerHTML = `
        <div class="post-header">
          <img class="avatar" src="${user.avatar || 'default.png'}">
          <a href="profile.html?uid=${post.uid}" class="username">
            ${user.username || "Unknown"}
          </a>
          <span class="time">${new Date(post.timestamp).toLocaleString()}</span>
        </div>
        <p>${post.body}</p>
      `;
      postsDiv.appendChild(el);
    }
  });
