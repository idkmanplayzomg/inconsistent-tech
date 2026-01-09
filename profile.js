const firebaseConfig = {
  apiKey: "AIzaSyATdGm6FTkeLlbbQr36CtB-kwN0LC3PGoI",
  authDomain: "inconforum.firebaseapp.com",
  projectId: "inconforum",
  appId: "1:1545059128:web:2327d2fce916a85e659fcd"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const params = new URLSearchParams(location.search);
const profileUid = params.get("uid");

const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const bio = document.getElementById("bio");
const editUI = document.getElementById("editUI");

const avatarInput = document.getElementById("avatarInput");
const bioInput = document.getElementById("bioInput");
const saveBtn = document.getElementById("saveBtn");

let currentUser = null;

auth.onAuthStateChanged(user => {
  currentUser = user;
  loadProfile();
});

async function loadProfile() {
  const snap = await db.collection("users").doc(profileUid).get();
  if (!snap.exists) return;

  const data = snap.data();
  avatar.src = data.avatar || "default.png";
  username.textContent = data.username || "User";
  bio.textContent = data.bio || "";

  if (currentUser && currentUser.uid === profileUid) {
    editUI.style.display = "block";
    bioInput.value = data.bio || "";
  }
}

avatarInput.onchange = () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => avatar.src = reader.result;
  reader.readAsDataURL(file);
};

saveBtn.onclick = async () => {
  if (!currentUser || currentUser.uid !== profileUid) return;

  await db.collection("users").doc(profileUid).set({
    avatar: avatar.src,
    bio: bioInput.value
  }, { merge: true });

  alert("Saved!");
};
