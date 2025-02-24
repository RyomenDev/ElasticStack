// auth.routes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import esClient from "../db/index.js";
import logger from "../logger/index.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await esClient.index({
      index: "users",
      document: { name, email, password: hashedPassword },
    });

    logger.info(`User registered: ${email}`);
    res.json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await esClient.search({
      index: "users",
      query: { match: { email } },
    });

    if (result.hits.hits.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.hits.hits[0]._source;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Protected Route: Get User Profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await esClient.search({
            index: 'users',
            query: { match: { email: req.user.email } },
        });

        if (result.hits.hits.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.hits.hits[0]._source;
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
