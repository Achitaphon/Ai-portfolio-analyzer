require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/analyze", async (req, res) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
${req.body.systemPrompt}

${req.body.userPrompt}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      content: [
        {
          text
        }
      ]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});