// Add these after auth init
const db = firebase.firestore();

async function ensureProfile(user) {
  const ref = db.collection("profiles").doc(user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      name: "+" + (user.displayName || user.email.split("@")[0]),
      avatar: "default-avatar.png",
      banner: "default-banner.png",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

document.getElementById("googleLogin").onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await auth.signInWithPopup(provider);
  await ensureProfile(result.user);
  location.href = "index.html";
};

document.getElementById("emailLogin").onclick = async () => {
  const result = await auth.signInWithEmailAndPassword(email.value, password.value);
  await ensureProfile(result.user);
  location.href = "index.html";
};

document.getElementById("emailSignup").onclick = async () => {
  const result = await auth.createUserWithEmailAndPassword(email.value, password.value);
  await ensureProfile(result.user);
  location.href = "index.html";
};
