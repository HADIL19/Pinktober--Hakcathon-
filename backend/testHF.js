import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MODEL = "google/flan-t5-small"; // public test model
const API_KEY = process.env.HUGGINGFACE_API_KEY;

async function testModel() {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: "Hello, please summarize this text: I love coding in Node.js!" },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Model response:", response.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testModel();
