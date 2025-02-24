import express from "express";
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Elasticsearch Client Setup
const esClient = new Client({
    node: "https://localhost:9200",
    auth: {
      username: "elastic",
      password: process.env.ELASTIC_PASSWORD,
    },
  tls: {
    ca: fs.readFileSync("./http_ca.crt"),
    rejectUnauthorized: false, // Ignore SSL verification (only for local testing)
  },
});

// esClient
//   .ping()
//   .then(() => console.log("✅ Connected to Elasticsearch!"))
//   .catch((err) => console.error("❌ Connection error:", err));

async function checkConnection() {
  try {
    const response = await esClient.ping();
    console.log("✅ Elasticsearch Connected:", response);
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}

checkConnection();

// ✅ Check if Elasticsearch is Connected
app.get("/es-status", async (req, res) => {
  try {
    const health = await esClient.cluster.health();
    res.json({ status: health });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Create an Index
app.post("/create-index", async (req, res) => {
  try {
    const { indexName } = req.body;
    await esClient.indices.create({ index: indexName });
    res.json({ message: `Index '${indexName}' created` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Insert a Document
app.post("/add-document", async (req, res) => {
  try {
    const { indexName, docId, data } = req.body;
    await esClient.index({
      index: indexName,
      id: docId,
      body: data,
    });
    res.json({ message: `Document added to ${indexName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Search for Documents
app.get("/search", async (req, res) => {
  try {
    const { indexName, query } = req.query;
    const response = await esClient.search({
      index: indexName,
      query: {
        match: { message: query },
      },
    });
    res.json(response.hits.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
