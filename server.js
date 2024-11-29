const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { OpenAI } = require("openai");
app.use(express.static("public"));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.post("/chat", async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res.status(400).json({ message: "No question provided" });
    }
        const resp = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an expert in computer hardware and components. Only answer questions related to computers, their types, and their components. If the question is unrelated, politely decline to answer.",
            },
            { role: "user", content: question },
          ],
        });
    res.status(200).json({ message: resp.choices[0].message.content });
  } catch (e) {
    console.log(e.message);
    
    res.status(400).json({ message: e.response?.data || e.message });  }
});
app.listen(5000, () => {
  console.log("Server is active");
});
