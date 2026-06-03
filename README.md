# Santos Car

## Présentation

Santos Car est une application web de gestion de voitures inspirées de GTA. Le projet est séparé en deux parties indépendantes : un backend Express/MySQL et un frontend HTML/CSS/JavaScript natif.

## Fonctionnalités

- Inscription utilisateur
- Connexion utilisateur
- Authentification avec JSON Web Token
- Liste des voitures
- Détails d'une voiture
- Ajout d'une voiture
- Modification d'une voiture
- Suppression d'une voiture
- Vote pour une voiture
- Un seul vote par utilisateur et par voiture
- Page 404
- Frontend séparé du backend

## Technologies

- Node.js
- Express
- MySQL / MariaDB
- bcrypt
- JSON Web Token
- HTML
- CSS
- JavaScript
- Fetch API
- localStorage

## Structure du projet

```text
santos-car-ecf/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   ├── schema.sql
│   └── test-db.js
└── frontend/
    ├── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    ├── 404.html
    ├── index.html
    └── login.html
```

Le dossier `backend/` contient l'API Express, la connexion MySQL, les contrôleurs et les routes. Le dossier `frontend/` contient l'interface utilisateur, les assets, le CSS et le JavaScript.

## Installation du backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Sur Windows, la copie du fichier d'environnement peut aussi se faire avec :

```bat
copy .env.example .env
```

Le serveur démarre par défaut sur `http://localhost:3000`.

## Configuration .env

Le fichier `.env` ne doit pas être commit. Il doit être créé à partir de `.env.example` et contenir les variables suivantes :

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gta_cars
JWT_SECRET=change_this_secret
```

## Base de données

Le fichier `backend/schema.sql` doit être exécuté dans phpMyAdmin, MySQL ou MariaDB.

Il crée :

- la base de données `gta_cars`
- la table `users`
- la table `cars`
- la table `car_votes`
- des voitures de démonstration

La contrainte `UNIQUE(user_id, car_id)` dans `car_votes` empêche un utilisateur de voter plusieurs fois pour la même voiture.

## Lancement du frontend

Le frontend est séparé du backend. Ouvrir `frontend/index.html` avec Live Server pour utiliser l'interface.

## Routes API

### Auth

- `POST /register`
- `POST /login`

### Cars

- `GET /cars`
- `GET /cars/:id`
- `POST /cars`
- `PUT /cars/:id`
- `DELETE /cars/:id`

Les routes `POST`, `PUT` et `DELETE` nécessitent un token JWT.

### Votes

- `POST /cars/:id/vote`
- `GET /cars/:id/votes`

La route `POST /cars/:id/vote` nécessite un token JWT.

Pour les routes protégées, utiliser l'en-tête :

```http
Authorization: Bearer TOKEN
```

## Tests réalisés

- Inscription utilisateur
- Connexion utilisateur
- Hash du mot de passe avec bcrypt
- Création et vérification du JWT
- Middleware JWT
- CRUD des voitures
- Vote pour une voiture
- Vote en double bloqué avec un statut `409`
- Récupération du nombre de votes
- Appels frontend avec Fetch API
- Stockage du token avec localStorage
- Page 404

## Branches Git

- `main` : sauvegarde principale
- `develop` : branche de développement

## Sécurité

- Le fichier `.env` ne doit jamais être commit.
- Les mots de passe sont hashés avec bcrypt.
- Les routes protégées utilisent un token JWT.
- Les votes en double sont bloqués par la base de données avec `UNIQUE(user_id, car_id)`.
