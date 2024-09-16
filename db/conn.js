const { MongoClient } = require("mongodb");

const connectionString = "mongodb+srv://perfectplanuser:perfectplan@tasksusers.ruymh.mongodb.net/?tls=true&retryWrites=true&w=majority&appName=tasksUser";
const client = new MongoClient(connectionString);

let db;

async function connectToDatabase() {
  // If db is already initialized, return it
  if (db) {
    return db;
  }

  try {
    // Connect to the database client only once
    const conn = await client.connect();
    db = conn.db("sample_training");
    console.log("Connected to database");
  } catch (e) {
    console.error("Error connecting to database:", e);
    throw e; // Make sure to throw the error to handle it in calling code
  }

  return db;
}

module.exports = connectToDatabase;
