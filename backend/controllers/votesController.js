const db = require("../models/db");

function parseId(id) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

async function carExists(carId) {
  const [cars] = await db.query("SELECT id FROM cars WHERE id = ? LIMIT 1", [carId]);
  return cars.length > 0;
}

async function voteForCar(req, res) {
  const carId = parseId(req.params.id);
  const userId = req.user?.id;

  if (!carId) {
    return res.status(404).json({ message: "Voiture introuvable" });
  }

  try {
    const exists = await carExists(carId);

    if (!exists) {
      return res.status(404).json({ message: "Voiture introuvable" });
    }

    await db.query("INSERT INTO car_votes (user_id, car_id) VALUES (?, ?)", [userId, carId]);

    return res.status(201).json({ message: "Vote enregistr\u00e9 avec succ\u00e8s" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Vous avez d\u00e9j\u00e0 vot\u00e9 pour cette voiture" });
    }

    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getVotesByCar(req, res) {
  const carId = parseId(req.params.id);

  if (!carId) {
    return res.status(404).json({ message: "Voiture introuvable" });
  }

  try {
    const exists = await carExists(carId);

    if (!exists) {
      return res.status(404).json({ message: "Voiture introuvable" });
    }

    const [counts] = await db.query("SELECT COUNT(*) AS votes FROM car_votes WHERE car_id = ?", [carId]);

    return res.json({
      car_id: carId,
      votes: Number(counts[0].votes)
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  voteForCar,
  getVotesByCar
};
