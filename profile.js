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

// DOM (safe lookups)
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const avatarEl = document.getElementById("avatar");
const editBox = document.getElementById("editBox");
const avatarInput = document.getElementById("avatarUrl");
const bioInput = document.getElementById("bioInput");
const saveBtn = document.getElementById("saveProfile");

// Get UID from URL
const params = new URLSearchParams(window.location.search);
const profileUid = params.get("uid");

// Fallback UI
if (usernameEl) usernameEl.textContent = "User";
if (bioEl) bioEl.textContent = "";

// Auth
auth.onAuthStateChanged(async user => {
  const isOwner = user && user.uid === profileUid;

  if (editBox) {
    editBox.style.display = isOwner ? "block" : "none";
  }

  try {
    const doc = await db.collection("profiles").doc(profileUid).get();

    if (doc.exists) {
      const data = doc.data();

      if (usernameEl) usernameEl.textContent = data.username || "User";
      if (bioEl) bioEl.textContent = data.bio || "";

      if (avatarEl && data.avatar) {
        avatarEl.src = data.avatar;
      }

      if (isOwner) {
        if (avatarInput) avatarInput.value = data.avatar || "";
        if (bioInput) bioInput.value = data.bio || "";
      }
    }
  } catch (err) {
    console.warn("Profile load failed:", err);
  }
});

// Save profile (OWNER ONLY)
if (saveBtn) {
  saveBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user || user.uid !== profileUid) return;

    await db.collection("profiles").doc(user.uid).set({
      avatar: avatarInput.value.trim(),
      bio: bioInput.value.trim(),
      username: user.displayName || user.email
    }, { merge: true });

    alert("Profile saved");
    location.reload();
  };
}
