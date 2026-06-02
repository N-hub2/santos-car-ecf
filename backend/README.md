# Backend - Santos Car

API Express et MySQL pour le projet Santos Car.

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example`.

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gta_cars
JWT_SECRET=change_this_secret
```

Si WAMP utilise le port MySQL `3307`, modifier `DB_PORT=3307` dans `.env`.

## Base de données

Importer `schema.sql` dans MySQL ou phpMyAdmin.

Le script crée :

- la base `gta_cars`
- la table `users`
- la table `cars`
- la table `car_votes`

La table `car_votes` contient une contrainte `UNIQUE(user_id, car_id)` pour empêcher un vote en double.

## Lancement

```bash
npm start
```

## Test

Vérifier l'API avec :

```bash
GET http://localhost:3000/health
```

Réponse attendue :

```json
{
  "message": "Santos Car API is running"
}
```
