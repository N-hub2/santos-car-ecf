# Backend - Santos Car

API Express et MySQL pour le projet Santos Car.

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example`.

```bash
cp .env.example .env
```

Sur Windows :

```bat
copy .env.example .env
```

Exemple de configuration :

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gta_cars
JWT_SECRET=change_this_secret
```

Le fichier `.env` ne doit pas être commit.

## Base de données

Importer `schema.sql` dans MySQL, MariaDB ou phpMyAdmin.

Le script crée :

- la base `gta_cars`
- la table `users`
- la table `cars`
- la table `car_votes`
- des voitures de démonstration

La table `car_votes` contient une contrainte `UNIQUE(user_id, car_id)` pour empêcher un vote en double.

## Lancement

```bash
npm start
```

L'API démarre par défaut sur `http://localhost:3000`.

## Routes

### Auth

- `POST /register`
- `POST /login`

### Cars

- `GET /cars`
- `GET /cars/:id`
- `POST /cars`
- `PUT /cars/:id`
- `DELETE /cars/:id`

### Votes

- `POST /cars/:id/vote`
- `GET /cars/:id/votes`

Les routes protégées utilisent l'en-tête :

```http
Authorization: Bearer TOKEN
```

## Test de connexion

```bash
npm run test:db
```

## Test de l'API

```http
GET http://localhost:3000/health
```

Réponse attendue :

```json
{
  "message": "Santos Car API is running"
}
```
