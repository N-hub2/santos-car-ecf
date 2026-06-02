const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const SALT_ROUNDS = 10;

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

function hasValue(value) {
  return typeof value === "string" && value.trim() !== "";
}

async function register(req, res) {
  const username = req.body?.username?.trim();
  const email = req.body?.email?.trim();
  const password = req.body?.password;

  if (!hasValue(username) || !hasValue(email) || !hasValue(password)) {
    return res.status(400).json({ message: "Username, email et mot de passe sont requis" });
  }

  try {
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Username ou email deja utilise" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    return res.status(201).json({
      message: "Utilisateur cree avec succes",
      user: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username ou email deja utilise" });
    }

    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function login(req, res) {
  const identifier = req.body?.identifier?.trim();
  const password = req.body?.password;

  if (!hasValue(identifier) || !hasValue(password)) {
    return res.status(400).json({ message: "Identifiant et mot de passe sont requis" });
  }

  try {
    const [users] = await db.query(
      "SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ? LIMIT 1",
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Configuration JWT manquante" });
    }

    const payload = publicUser(user);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.json({
      message: "Connexion reussie",
      token,
      user: payload
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  register,
  login
};
