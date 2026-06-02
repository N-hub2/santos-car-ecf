# Catalogue des voitures GTA

Application web simple pour gerer un catalogue de voitures GTA. Le projet est separe en deux parties independantes.

## Structure

```text
project/
├── backend/
└── frontend/
```

- `backend/` contient l'API Express et la connexion MySQL.
- `frontend/` contient l'interface en HTML, CSS et JavaScript natifs.

## Installation et lancement

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Le serveur demarre par defaut sur `http://localhost:3000`.

### Frontend

Ouvrir `frontend/index.html` avec Live Server.

### Base de donnees

Creer la base et les tables avec `backend/schema.sql` dans phpMyAdmin ou MySQL.

Le fichier SQL cree la base `gta_cars`, les tables `users`, `cars` et `car_votes`, puis ajoute quelques voitures GTA de demonstration.
