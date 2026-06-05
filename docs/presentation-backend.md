# Présentation du backend Santos Car

## Objectif du backend

Le backend Santos Car est une API Express qui permet de gérer un catalogue de voitures inspirées de GTA. Il reçoit les requêtes du frontend, communique avec la base de données MySQL et renvoie des réponses JSON.

Son rôle principal est de gérer les utilisateurs, l'authentification, les voitures et les votes.

## Technologies utilisées

* Node.js
* Express
* MySQL / MariaDB
* bcrypt
* JSON Web Token
* dotenv
* cors

## Structure du backend

* `index.js` : point d'entrée de l'API. Il configure Express, CORS, le JSON, les routes et la route de santé `/health`.
* `models/db.js` : crée la connexion à MySQL avec les variables du fichier `.env`.
* `routes/` : définit les chemins de l'API et relie chaque route à son contrôleur.
* `controllers/` : contient la logique métier pour l'authentification, les voitures et les votes.
* `middlewares/auth.js` : vérifie le token JWT avant d'autoriser l'accès aux routes protégées.
* `schema.sql` : crée la base `gta_cars`, les tables `users`, `cars` et `car_votes`, ainsi que les contraintes nécessaires.

## Authentification

Le backend propose deux routes principales pour l'authentification :

* `POST /register` : crée un nouvel utilisateur avec un nom d'utilisateur, un email et un mot de passe.
* `POST /login` : connecte un utilisateur avec son nom d'utilisateur ou son email, puis renvoie un token JWT.

Le mot de passe n'est jamais stocké en clair. Il est transformé avec `bcrypt` avant d'être enregistré dans la colonne `password_hash`.

Après une connexion réussie, le backend crée un token avec JSON Web Token. Ce token contient l'identifiant, le nom d'utilisateur et l'email de l'utilisateur.

Le middleware d'authentification lit l'en-tête `Authorization: Bearer TOKEN`, vérifie le token avec `jwt.verify`, puis place les informations décodées dans `req.user`.

## Gestion des voitures

Le backend propose un CRUD complet pour les voitures :

* `GET /cars` : retourne toutes les voitures avec leur nombre de votes.
* `GET /cars/:id` : retourne une voiture précise.
* `POST /cars` : ajoute une nouvelle voiture.
* `PUT /cars/:id` : modifie une voiture existante.
* `DELETE /cars/:id` : supprime une voiture existante.

Les routes `POST`, `PUT` et `DELETE` nécessitent un token JWT valide, car elles modifient les données de la base.

## Système de vote

Le système de vote repose sur la table `car_votes`.

* `POST /cars/:id/vote` : permet à un utilisateur connecté de voter pour une voiture.
* `GET /cars/:id/votes` : retourne le nombre de votes d'une voiture.

La contrainte `UNIQUE(user_id, car_id)` empêche un même utilisateur de voter plusieurs fois pour la même voiture.

Dans `GET /cars`, un `LEFT JOIN` permet de retourner chaque voiture avec son nombre de votes. Le nombre de votes est calculé à partir de `car_votes`, pas depuis un champ stocké dans `cars`.

La route `GET /cars/:id/votes` utilise `COUNT(*)` pour calculer le nombre de votes d'une voiture.

## Sécurité

* Les mots de passe sont hashés avec `bcrypt`.
* Les routes sensibles sont protégées par un token JWT.
* Les requêtes SQL utilisent des paramètres pour limiter les risques d'injection SQL.
* Le fichier `.env` n'est pas publié sur GitHub, car il contient des informations sensibles comme le secret JWT et les paramètres de connexion à la base de données.

## Questions possibles du formateur

### Pourquoi utiliser bcrypt ?

Pour ne jamais stocker les mots de passe en clair. `bcrypt` transforme le mot de passe en hash sécurisé.

### Pourquoi utiliser JWT ?

JWT permet de prouver qu'un utilisateur est connecté sans renvoyer ses identifiants à chaque requête.

### Comment empêcher un vote en double ?

La base de données utilise la contrainte `UNIQUE(user_id, car_id)` dans la table `car_votes`.

### Pourquoi utiliser une table `car_votes` ?

Elle permet de relier un utilisateur à une voiture et de compter les votes proprement.

### Pourquoi séparer frontend et backend ?

Le frontend gère l'affichage et les interactions utilisateur. Le backend gère les données, la sécurité et la logique serveur.

### Pourquoi protéger certaines routes ?

Les routes qui créent, modifient ou suppriment des données doivent être réservées aux utilisateurs connectés.

### Comment le backend communique avec MySQL ?

Il utilise `mysql2/promise` et un pool de connexions défini dans `models/db.js`.

### Pourquoi utiliser des requêtes SQL paramétrées ?

Elles évitent d'insérer directement les données utilisateur dans les chaînes SQL, ce qui réduit le risque d'injection SQL.

### Pourquoi utiliser un `LEFT JOIN` dans `GET /cars` ?

Il permet d'afficher toutes les voitures, même celles qui n'ont encore aucun vote.

### Pourquoi ne pas stocker le nombre de votes dans la table `cars` ?

Le nombre de votes peut être calculé depuis `car_votes`. Cela évite les doublons de données et garde un résultat fiable.

### Que contient `req.user` ?

`req.user` contient les informations de l'utilisateur décodées depuis le token JWT.

### Que se passe-t-il si le token est invalide ?

Le middleware renvoie une réponse `401` et la route protégée n'est pas exécutée.
