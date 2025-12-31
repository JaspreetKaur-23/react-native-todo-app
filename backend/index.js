const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
const PORT = 3001;
const LIST_KEY = "savedTasks"; // redis key

app.use(cors());
app.use(bodyParser.json());

async function bootServer() {
  const db = createClient();

  db.on("error", (err) => console.log("Redis Issue:", err));

  await db.connect();

  // create empty list if missing
  const alreadyExists = await db.exists(LIST_KEY);
  if (!alreadyExists) {
    await db.set(LIST_KEY, JSON.stringify([]));
    console.log("Created empty Redis list");
  }

  app.get("/load", async (req, res) => {
    // return stored list
    const raw = await db.get(LIST_KEY);
    let parsed = [];

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = [];
    }

    res.json(Array.isArray(parsed) ? parsed : []);
  });

  app.post("/save", async (req, res) => {
    // overwrite list with new data
    const incoming = req.body;

    if (!Array.isArray(incoming)) {
      return res.status(400).json({ error: "Expected an array" });
    }

    await db.set(LIST_KEY, JSON.stringify(incoming));
    res.json({ status: "Saved successfully" });
  });

  app.get("/clear", async (req, res) => {
     // clear all items
    await db.set(LIST_KEY, JSON.stringify([]));
    res.json({ status: "All items cleared" });
  });

  app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));
}

bootServer();
