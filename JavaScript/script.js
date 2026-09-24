

function Calculer() {

let operande1js = parseFloat(document.getElementById('operande1').value) || 0;
let operande2js = parseFloat(document.getElementById('operande2').value) || 0;
let resultatjs = operande1js + operande2js;

let Affichageresultatjs = document.getElementById('resultat');

Affichageresultatjs.textContent = "Resultat :" + resultatjs;
}
