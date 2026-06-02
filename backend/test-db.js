require("dotenv").config();

const db = require("./models/db");

async function testConnection() {
  try {
    await db.query("SELECT 1 AS ok");
    console.log("Database connection successful");
  } catch (error) {
    console.error(error.code ? `${error.code}: ${error.message}` : error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

testConnection();
