/* Thème principal (sera modifié par Firebase si nécessaire) */
:root {
--theme: #f4e1ff; /* couleur par défaut */
}

body {
font-family: Arial, sans-serif;
text-align: center;
background: #f7f7f7;
margin: 0;
padding: 0;
color: #222;
}

header {
background: var(--theme);
padding: 20px;
}

h1 {
margin: 0;
color: #222;
}

h2 {
margin: 10px 0;
}

button {
padding: 10px 15px;
font-size: 16px;
cursor: pointer;
border: none;
background: #222;
color: white;
border-radius: 5px;
}

button:hover {
background: #444;
}

/* Grille des lettres */
.letters {
display: grid;
grid-template-columns: repeat(6, 50px);
gap: 10px;
justify-content: center;
margin: 20px auto;
max-width: 400px;
}

.letters div {
border: 2px solid #333;
padding: 10px;
font-weight: bold;
background: white;
border-radius: 5px;
}

/* Tableau des scores */
#scoreboard {
margin: 30px auto;
border-collapse: collapse;
width: 80%;
max-width: 600px;
}

#scoreboard th, #scoreboard td {
border: 1px solid #333;
padding: 10px;
}

#scoreboard th {
background: yellow;
}

/* Formulaire */
form {
margin: 30px auto;
}

#answerInput {
padding: 10px;
width: 200px;
font-size: 16px;
}

#msg {
display: block;
margin-top: 10px;
color: red;
}
