console.log("profile.js loaded");

// Firebase config (MUST match forum.js)
const firebaseConfig = {
  apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
  authDomain: "inconforum.firebaseapp.com",
  projectId: "inconforum"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// DOM (SAFE)
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const avatarEl = document.getElementById("avatar");
const editSection = document.getElementById("editSection");
const bioInput = document.getElementById("bioInput");
const saveBtn = document.getElementById("saveBtn");
const postsEl = document.getElementById("posts");

// HARD STOP if UI missing
if (!usernameEl || !bioEl || !avatarEl) {
  console.error("Profile UI missing from HTML");
  throw new Error("UI missing");
}

// Get UID from URL
const params = new URLSearchParams(window.location.search);
const profileUid = params.get("uid");

if (!profileUid) {
  usernameEl.textContent = "Profile not found";
  bioEl.textContent = "No UID provided.";
  postsEl.textContent = "";
  throw new Error("Missing UID");
}

// Auth state
auth.onAuthStateChanged(user => {
  const isOwner = user && user.uid === profileUid;

  // Load profile
  db.collection("users").doc(profileUid).get()
    .then(doc => {
      if (!doc.exists) {
        usernameEl.textContent = "User not found";
        bioEl.textContent = "";
        return;
      }

      const data = doc.data();
      usernameEl.textContent = data.username || "Unnamed user";
      bioEl.textContent = data.bio || "";
      avatarEl.src = data.avatar || "default-avatar.png";

      if (isOwner) {
        editSection.style.display = "block";
        bioInput.value = data.bio || "";
      }
    })
    .catch(err => {
      console.error("Profile load error:", err);
      usernameEl.textContent = "Error loading profile";
      bioEl.textContent = err.message;
    });

  // Load posts (READ ONLY)
  db.collection("posts")
    .where("uid", "==", profileUid)
    .orderBy("timestamp", "desc")
    .limit(10)
    .get()
    .then(snap => {
      postsEl.innerHTML = "";
      snap.forEach(doc => {
        const p = doc.data();
        const div = document.createElement("div");
        div.className = "card post";
        div.innerHTML = `
          <p>${p.body}</p>
          <small>${new Date(p.timestamp).toLocaleString()}</small>
        `;
        postsEl.appendChild(div);
      });

      if (!snap.size) postsEl.textContent = "No posts yet.";
    })
    .catch(err => {
      console.error("Posts error:", err);
      postsEl.textContent = "Could not load posts.";
    });

  // Save bio (OWNER ONLY)
  if (saveBtn) {
    saveBtn.onclick = () => {
      if (!isOwner) return;

      db.collection("users").doc(profileUid).update({
        bio: bioInput.value
      }).then(() => {
        bioEl.textContent = bioInput.value;
        alert("Saved");
      }).catch(err => {
        alert(err.message);
      });
    };
  }
});
