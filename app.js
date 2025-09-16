// Import Firebase (modulaire via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
getFirestore, doc, collection, getDoc, setDoc,
addDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCibEnPhUQhsNNo5hPiKBPql2WBwXP152c",
    authDomain: "brainstorming-session.firebaseapp.com",
    projectId: "brainstorming-session",
    storageBucket: "brainstorming-session.firebasestorage.app",
    messagingSenderId: "460606677928",
    appId: "1:460606677928:web:06f9d95ef42057254db39d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const currentLetterEl = document.getElementById("currentLetter");
const startRoundBtn = document.getElementById("startRoundBtn");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const msgEl = document.getElementById("msg");

const MIN_WORD_LENGTH = 2; // <- règle : change à 3 si tu veux plus strict

// récupère gameId depuis l'URL ?gameId=xxx sinon 'demoGame'
const params = new URLSearchParams(window.location.search);
const gameId = params.get("gameId") || "demoGame";
const gameRef = doc(db, "games", gameId);

// utilitaires
const letters = "ABCDEFGHIJKLMNOPQRSTUVWX";
function getRandomLetter() {
return letters[Math.floor(Math.random() * letters.length)];
}
function randomPastel() {
const h = Math.floor(Math.random() * 360);
return `hsl(${h},85%,75%)`;
}
function normalizeWord(w) {
return w.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function isValidWord(rawWord, currentLetter) {
if (!rawWord) return false;
const w = normalizeWord(rawWord);
if (w.length < MIN_WORD_LENGTH) return false;
// vérifier qu'il commence par la lettre (normalisée)
if (w.charAt(0).toUpperCase() !== currentLetter.toUpperCase()) return false;
// autorise lettres, apostrophe et tiret
if (!/^[a-z'-]+$/.test(w)) return false;
return true;
}

// 1) authentification anonyme
signInAnonymously(auth).catch(e => console.error("Auth error:", e));

// 2) à l'entrée : si game doc n'existe pas, on le crée (avec couleur)
async function ensureGameDoc() {
const snap = await getDoc(gameRef);
if (!snap.exists()) {
await setDoc(gameRef, {
color: randomPastel(),
createdAt: serverTimestamp(),
currentLetter: null,
currentRoundId: null
});
console.log("Game créé :", gameId);
}
}
await ensureGameDoc();

// 3) écouter le document game pour synchroniser lettre & couleur
onSnapshot(gameRef, (snap) => {
if (!snap.exists()) return;
const data = snap.data();
if (data.currentLetter) currentLetterEl.textContent = data.currentLetter;
if (data.color) document.documentElement.style.setProperty('--theme', data.color);
});

// 4) démarrer un nouveau round (clic host)
startRoundBtn?.addEventListener("click", async () => {
// génère lettre, crée document round et met à jour game
const letter = getRandomLetter();
const roundsCol = collection(db, "games", gameId, "rounds");
const newRoundRef = await addDoc(roundsCol, {
letter,
startedAt: serverTimestamp(),
status: "open"
});
await setDoc(gameRef, {
currentRoundId: newRoundRef.id,
currentLetter: letter
}, { merge: true });
msgEl.textContent = `Round démarré: ${letter}`;
});

// 5) soumettre un mot
answerForm?.addEventListener("submit", async (e) => {
e.preventDefault();
const raw = answerInput.value || "";
// récupérer la lettre actuelle depuis le document game
const gameSnap = await getDoc(gameRef);
const gameData = gameSnap.exists() ? gameSnap.data() : null;
if (!gameData || !gameData.currentRoundId) {
msgEl.textContent = "Aucun round ouvert. Demandez au host de démarrer un tour.";
return;
}
const currentLetter = gameData.currentLetter || "";
if (!isValidWord(raw, currentLetter)) {
msgEl.textContent = "Mot invalide (longueur ou ne commence pas par la lettre).";
return;
}

// on enregistre la réponse
const roundId = gameData.currentRoundId;
const answersCol = collection(db, "games", gameId, "rounds", roundId, "answers");

// récupérer l'uid (auth)
const user = auth.currentUser;
const uid = user ? user.uid : "anon-" + Math.random().toString(36).slice(2, 8);

await addDoc(answersCol, {
uid,
word: normalizeWord(raw),
submittedAt: serverTimestamp()
});

msgEl.textContent = "Mot enregistré ✅";
answerInput.value = "";
});
