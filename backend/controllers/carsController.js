const db = require("../models/db");

const CAR_FIELDS = "id, name, brand, price, speed, description, image_url, created_at";

function normalizeCar(car) {
  if (!car) {
    return null;
  }

  const normalizedCar = {
    ...car,
    price: car.price === null ? null : Number(car.price)
  };

  if (Object.prototype.hasOwnProperty.call(car, "votes")) {
    normalizedCar.votes = car.votes === null ? 0 : Number(car.votes);
  }

  return normalizedCar;
}

function hasValue(value) {
  return typeof value === "string" && value.trim() !== "";
}

function cleanOptionalText(value) {
  if (value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function cleanOptionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

function parseId(id) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

async function findCarById(id) {
  const [cars] = await db.query(`SELECT ${CAR_FIELDS} FROM cars WHERE id = ? LIMIT 1`, [id]);
  return normalizeCar(cars[0]);
}

async function getCars(req, res) {
  try {
    const [cars] = await db.query(`
      SELECT
        c.id,
        c.name,
        c.brand,
        c.price,
        c.speed,
        c.description,
        c.image_url,
        c.created_at,
        COALESCE(v.votes, 0) AS votes
      FROM cars c
      LEFT JOIN (
        SELECT car_id, COUNT(*) AS votes
        FROM car_votes
        GROUP BY car_id
      ) v ON v.car_id = c.id
      ORDER BY c.id ASC
    `);
    return res.json({ cars: cars.map(normalizeCar) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getCarById(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(404).json({ message: "Voiture introuvable" });
  }

  try {
    const car = await findCarById(id);

    if (!car) {
      return res.status(404).json({ message: "Voiture introuvable" });
    }

    return res.json({ car });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function createCar(req, res) {
  const name = req.body?.name?.trim();

  if (!hasValue(name)) {
    return res.status(400).json({ message: "Le nom est requis" });
  }

  const brand = cleanOptionalText(req.body?.brand);
  const price = cleanOptionalNumber(req.body?.price);
  const speed = cleanOptionalNumber(req.body?.speed);
  const description = cleanOptionalText(req.body?.description);
  const imageUrl = cleanOptionalText(req.body?.image_url);

  try {
    const [result] = await db.query(
      "INSERT INTO cars (name, brand, price, speed, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, brand, price, speed, description, imageUrl]
    );
    const car = await findCarById(result.insertId);

    return res.status(201).json({
      message: "Voiture ajoutee avec succes",
      car
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updateCar(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(404).json({ message: "Voiture introuvable" });
  }

  if (Object.prototype.hasOwnProperty.call(req.body || {}, "name") && !hasValue(req.body.name)) {
    return res.status(400).json({ message: "Le nom est requis" });
  }

  try {
    const currentCar = await findCarById(id);

    if (!currentCar) {
      return res.status(404).json({ message: "Voiture introuvable" });
    }

    const nextCar = {
      name: req.body?.name === undefined ? currentCar.name : req.body.name.trim(),
      brand: req.body?.brand === undefined ? currentCar.brand : cleanOptionalText(req.body.brand),
      price: req.body?.price === undefined ? currentCar.price : cleanOptionalNumber(req.body.price),
      speed: req.body?.speed === undefined ? currentCar.speed : cleanOptionalNumber(req.body.speed),
      description:
        req.body?.description === undefined ? currentCar.description : cleanOptionalText(req.body.description),
      image_url: req.body?.image_url === undefined ? currentCar.image_url : cleanOptionalText(req.body.image_url)
    };

    await db.query(
      "UPDATE cars SET name = ?, brand = ?, price = ?, speed = ?, description = ?, image_url = ? WHERE id = ?",
      [nextCar.name, nextCar.brand, nextCar.price, nextCar.speed, nextCar.description, nextCar.image_url, id]
    );

    const car = await findCarById(id);

    return res.json({
      message: "Voiture modifiee avec succes",
      car
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteCar(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(404).json({ message: "Voiture introuvable" });
  }

  try {
    const car = await findCarById(id);

    if (!car) {
      return res.status(404).json({ message: "Voiture introuvable" });
    }

    await db.query("DELETE FROM cars WHERE id = ?", [id]);
    return res.json({ message: "Voiture supprimee avec succes" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
