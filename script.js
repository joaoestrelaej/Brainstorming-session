// --- Variables globales ---
let players = [];
let playerCount = 0;
let letter = '';
let answers = {};
let gameFinished = false;

// --- Page 1 : accueil ---
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');

const createGameBtn = document.getElementById('createGameBtn');
const playerCountInput = document.getElementById('playerCount');
const gameLinkBox = document.getElementById('gameLinkBox');
const gameLinkInput = document.getElementById('gameLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');

createGameBtn.addEventListener('click', ()=>{
playerCount = parseInt(playerCountInput.value);
// génère un ID de partie
const gameId = Math.floor(Math.random()*10000);
// lien à partager
const url = `${location.href}?game=${gameId}&players=${playerCount}`;
gameLinkInput.value = url;
gameLinkBox.classList.remove('hidden');
});

// copie le lien
copyLinkBtn.addEventListener('click', ()=>{
gameLinkInput.select();
document.execCommand("copy");
alert("Lien copié !");
});

// --- Page 2 : jeu ---
const currentLetter = document.getElementById('currentLetter');
const stopBtn = document.getElementById('stopBtn');
const answersForm = document.getElementById('answersForm');

function startGame(){
page1.classList.add('hidden');
page2.classList.remove('hidden');
letter = String.fromCharCode(65 + Math.floor(Math.random()*26));
currentLetter.textContent = letter;
}

stopBtn.addEventListener('click', ()=>{
// calcule les points (très basique)
const formData = new FormData(answersForm);
answers = {};
formData.forEach((value,key)=>{
answers[key] = value.trim().toLowerCase();
});
calculatePoints();
page2.classList.add('hidden');
page3.classList.remove('hidden');
showRanking();
});

// --- Page 3 : classement ---
const rankingList = document.getElementById('rankingList');
const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', ()=>{
page3.classList.add('hidden');
page1.classList.remove('hidden');
answersForm.reset();
});

function calculatePoints(){
// très basique : 1 pt si rempli, 0 sinon
players = [{name:'Joueur1', score:0}]; // pour test
let score = 0;
Object.values(answers).forEach(v=>{
if(v.length>0) score +=1;
});
players[0].score = score;
}

function showRanking(){
rankingList.innerHTML = '';
players.sort((a,b)=>b.score - a.score);
players.forEach(p=>{
const li = document.createElement('li');
li.textContent = `${p.name} : ${p.score} pts`;
rankingList.appendChild(li);
});
}

// --- Auto start si URL contient ?game= ---
const params = new URLSearchParams(location.search);
if(params.has('game')){
startGame();
}
