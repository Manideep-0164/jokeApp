const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = 1000;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(require("cors")());

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.post("/getJoke", async (req, res) => {
  const input = req.body.joke;

  // Use the OpenAI API to generate a joke based on the keyword
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that makes jokes.`,
        },
        { role: "user", content: `Tell me a joke about ${input}` },
      ],
    });

    const joke = response.data.choices[0].message.content.trim();
    res.json({ joke, input });
  } catch (error) {
    console.error("Error generating joke:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the joke." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
