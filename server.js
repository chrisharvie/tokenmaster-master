const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Database connection details
const db = mysql.createConnection({
  host: "35.224.178.95",
  user: "charvie",
  password: "Ilikegrapes123!",
  database: "a24-96",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Create the events table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      location VARCHAR(255) NOT NULL
    )
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    console.log('Table "events" created or already exists');
  });
});

// Create a new event
app.post("/events", (req, res) => {
  const { name, date, location } = req.body;
  const query = "INSERT INTO events (name, date, location) VALUES (?, ?, ?)";
  db.query(query, [name, date, location], (err, result) => {
    if (err) {
      console.error("Error inserting event:", err);
      res.status(500).send("Server error");
      return;
    }
    res.status(201).send("Event created");
  });
});

// Fetch all events
app.get("/events", (req, res) => {
  const query = "SELECT * FROM events";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
