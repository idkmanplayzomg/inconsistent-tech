// ================================
// profile.js — SAFE CLEAN VERSION
// ================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- GET PROFILE UID FIRST ----------
  const params = new URLSearchParams(window.location.search);
  const profileUid = params.get("uid");

  if (!profileUid) {
    document.body.innerHTML = "<h2 style='color:white'>No profile specified</h2>";
    return;
  }

  // ---------- FIREBASE INIT ----------
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

  firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("UID:", user.uid);
  }
});


  // ---------- DOM ELEMENTS (SAFE) ----------
  const usernameEl = document.getElementById("username");
  const bioEl = document.getElementById("bio");
  const avatarEl = document.getElementById("avatar");
  const editBox = document.getElementById("editBox");
  const bioInput = document.getElementById("bioInput");
  const avatarInput = document.getElementById("avatarInput");
  const saveBtn = document.getElementById("saveProfileBtn");

  // Hide edit UI by default (IMPORTANT)
  if (editBox) editBox.style.display = "none";

  // ---------- LOAD PROFILE ----------
  db.collection("users").doc(profileUid).get()
    .then(doc => {
      if (!doc.exists) {
        document.body.innerHTML = "<h2 style='color:white'>Profile not found</h2>";
        return;
      }

      const data = doc.data();

      if (usernameEl) usernameEl.textContent = data.username || "Unnamed";
      if (bioEl) bioEl.textContent = data.bio || "";
      if (avatarEl && data.avatar) avatarEl.src = data.avatar;
    })
    .catch(err => {
      console.error("Profile load error:", err);
    });

  // ---------- AUTH CHECK ----------
  auth.onAuthStateChanged(user => {
    if (!user) return;

    // ONLY OWNER CAN EDIT
    if (user.uid === profileUid && editBox) {
      editBox.style.display = "block";

      if (saveBtn) {
        saveBtn.onclick = async () => {
          const updates = {
            bio: bioInput ? bioInput.value : "",
            avatar: avatarInput ? avatarInput.value : ""
          };

          await db.collection("users").doc(profileUid).set(updates, { merge: true });
          location.reload();
        };
      }
    }
  });

});

