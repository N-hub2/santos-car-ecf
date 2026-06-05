require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const carsRoutes = require("./routes/cars");
const votesRoutes = require("./routes/votes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "L'API Santos Car fonctionne" });
});

app.use(authRoutes);
app.use("/cars", carsRoutes);
app.use("/cars", votesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Santos Car API running on http://localhost:${port}`);
  });
}

module.exports = app;
