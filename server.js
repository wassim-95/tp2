const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
// Middleware pour autoriser les requêtes depuis n'importe où (utile avec frontend)
app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 next();
});
// Connexion à la base de données MySQL
const db = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: '', // laisser vide si tu n'as pas mis de mot de passe
 database: 'test', // nom de la base que tu as créée dans phpMyAdmin
});
db.connect((err) => {
 if (err) {
 console.error('Erreur de connexion à la base de données :', err);
 return;
 }
 console.log('Connecté à la base de données MySQL');
});
// Route GET pour récupérer tous les étudiants
app.get('/etudiants', (req, res) => {
 const sql = 'SELECT * FROM etudiants';
 db.query(sql, (err, result) => {
 if (err) {
 console.error('Erreur lors de la récupération des étudiants :', err);
 res.json({ error: 'Erreur serveur' });
 }

 res.json(result); // renvoie les étudiants en JSON
 });
});
// Nouvelle route pour afficher le nombre d'étudiants
app.get('/compter', (req, res) => {
 const sql = 'SELECT COUNT(*) AS nombre FROM etudiants'; 
 // Requête SQL pour compter les étudiants
 db.query(sql, (err, result) => {
 if (err) {
 console.error('Erreur lors du comptage des étudiants :', err);
  return res.json({ error: 'Erreur serveur' });
 }
 res.json({ nombre_etudiants: result[0].nombre });
 // Envoie le nombre d'étudiants en JSON
 });
});
// Nouvelle route pour afficher le nombre d'étudiants sans utiliser COUNT()
app.get('/compter', (req, res) => {
 const sql = 'SELECT * FROM etudiants'; // Récupère tous les étudiants
 db.query(sql, (err, result) => {
 if (err) {
 console.error('Erreur lors de la récupération des étudiants :', err);
 return res.json({ error: 'Erreur serveur' });
 }
 const nombre = result.length; // Calcule le nombre d'étudiants
 res.json({ nombre_etudiants: nombre }); // Envoie le nombre d'étudiants en JSON
 });
});
/*/ Nouvelle route pour rechercher un étudiant par matricule
app.get('/etudiant/:matricule', (req, res) => {
 const matricule = req.params.matricule; // Récupère le matricule depuis l'URL
 const sql = 'SELECT * FROM etudiants WHERE matricule = ?'; // Utilise ? pour éviter les injections SQL
 db.query(sql, [matricule], (err, result) => {
 if (err) {
 console.error('Erreur lors de la récupération de l\'étudiant :', err);
 return res.json({ error: 'Erreur serveur' });
 }
 res.json(result[0]); // Renvoie l'étudiant trouvé
 });
});              */
// Nouvelle route pour rechercher un étudiant par matricule
app.get('/etudiant/:matricule', (req, res) => {
 const matricule = req.params.matricule; // Récupère le matricule depuis l'URL
 const sql = 'SELECT * FROM etudiants WHERE matricule = ?'; // Utilise ? pour éviter les injections SQL
 db.query(sql, [matricule], (err, result) => {
 if (err) {
 console.error('Erreur lors de la récupération de l\'étudiant :', err);
 return res.json({ error: 'Erreur serveur' });
 }
 if (result.length === 0) {
 return res.json({ message: 'Étudiant non trouvé' });
 }
 res.json(result[0]); // Renvoie l'étudiant trouvé
 });
});
app.get('/rechercher', (req, res) => {
 const ville = req.query.adresse;
 if (!ville) {
 return res.json({ error: 'Veuillez fournir une adresse dans la query string' });
 }
 // recherche partielle, sensible à la casse
 const sql = 'SELECT * FROM etudiants WHERE adresse LIKE ?';
 const valeurRecherchee = '%' + ville + '%';
 db.query(sql, [valeurRecherchee], (err, result) => {
 if (err) {
 console.error('Erreur lors de la recherche :', err);
 return res.json({ error: 'Erreur serveur' });
 }
 if (result.length === 0) {
 return res.json({ message: 'Aucun étudiant trouvé pour cette adresse' });
 }
 res.json(result);
 });
});

// Démarrage du serveur
app.listen(port, () => {
 console.log(`Serveur Node.js en ligne sur http://localhost:${port}`);
});