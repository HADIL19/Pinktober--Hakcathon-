import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const r = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: "Hello from PinkHope AI!" },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );
    res.json(r.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "Test failed" });
  }
});

export default router;
