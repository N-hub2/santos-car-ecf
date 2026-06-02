const express = require("express");
const carsController = require("../controllers/carsController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", carsController.getCars);
router.get("/:id", carsController.getCarById);
router.post("/", auth, carsController.createCar);
router.put("/:id", auth, carsController.updateCar);
router.delete("/:id", auth, carsController.deleteCar);

module.exports = router;
