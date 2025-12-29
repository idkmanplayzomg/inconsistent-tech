// ===== FIREBASE INIT =====
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

// ===== GET UID FIRST (BEFORE ANYTHING ELSE) =====
const params = new URLSearchParams(window.location.search);
const profileUid = params.get("uid");

// 🚨 HARD STOP IF NO UID
if (!profileUid) {
  document.body.innerHTML = "<h2 style='color:white'>No profile specified</h2>";
  throw new Error("profileUid missing");
}


// ===== DOM =====
const avatar = document.getElementById("avatar");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editBox = document.getElementById("editBox");
const avatarInput = document.getElementById("avatarUrl");
const bioInput = document.getElementById("bioInput");
const saveBtn = document.getElementById("saveProfile");


// 🚨 HARD STOP IF NO UID
if (!profileUid) {
  document.body.innerHTML = "<h2 style='color:white'>No profile specified</h2>";
  throw new Error("profileUid missing");
}

// ===== LOAD PROFILE (READ-ONLY) =====
async function loadProfile() {
  try {
    const snap = await db.collection("profiles").doc(profileUid).get();

    if (!snap.exists) {
      usernameEl.textContent = "User not found";
      return;
    }

    const data = snap.data();

    usernameEl.textContent = data.username || "User";
    bioEl.textContent = data.bio || "";

    if (data.avatar) avatar.src = data.avatar;

  } catch (err) {
    console.error("Profile read failed:", err);
  }
}

loadProfile();

// ===== AUTH + EDIT PERMISSION =====
auth.onAuthStateChanged(user => {
  const isOwner = user && user.uid === profileUid;

  editBox.style.display = isOwner ? "block" : "none";

  if (isOwner) {
    // preload editable fields
    db.collection("profiles").doc(profileUid).get().then(snap => {
      if (snap.exists) {
        const d = snap.data();
        avatarInput.value = d.avatar || "";
        bioInput.value = d.bio || "";
      }
    });
  }
});

// ===== SAVE PROFILE =====
saveBtn.onclick = async () => {
  const user = auth.currentUser;

  if (!user || user.uid !== profileUid) {
    alert("Not allowed");
    return;
  }

  try {
    await db.collection("profiles").doc(user.uid).set({
      avatar: avatarInput.value.trim(),
      bio: bioInput.value.trim(),
      username: user.displayName || user.email
    }, { merge: true });

    alert("Saved");
    location.reload();
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed (check console)");
  }
};

