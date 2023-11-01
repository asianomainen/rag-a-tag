import axios from "axios";

import express from "express";

import weaviate, { WeaviateClient, ApiKey } from "weaviate-ts-client";
import {
  OPEN_AI_APIKEY,
  OPEN_AI_API_URL,
  WEAVIATE_APIKEY,
  WEAVIATE_DB_URL,
} from "../config";

const weaviateRouter = express.Router();

const client: WeaviateClient = weaviate.client({
  scheme: "https",
  host: WEAVIATE_DB_URL || "",
  apiKey: new ApiKey(WEAVIATE_APIKEY || ""),
  headers: { "X-OpenAI-Api-Key": OPEN_AI_APIKEY || "" },
});

/**
 * POST /api/weaviate
 * @summary Generates response for the user question
 * @param {} request.body.required
 * @return {String} 201 - Created GPT response
 * @return {} 400 - Bad request response
 */
weaviateRouter.get("/", async (_req, res) => {
  const generatePrompt =
    "You are an assistant. Answer ONLY with the facts given as a context. \
              Answer shortly for the questions given by the user. \
              Question: {What is the role of DevOps in software development?}";

  const result = await client.graphql
    .get()
    .withClassName("ResearchPaper")
    .withGenerate({
      groupedTask: generatePrompt,
      groupedProperties: ["content", "title"],
    })
    .withNearText({
      concepts: ["devops"],
    })
    .withFields("chunk_index")
    .withLimit(4)
    .do();

  // const { userInput } = req.body;

  res.status(201).json({ response: JSON.stringify(result, null, 2) });
});

weaviateRouter.get("/test", async (_req, res) => {
  const result = await client.graphql
    .get()
    .withClassName("ResearchPaper")
    .withHybrid({
      query: "software",
    })
    .withLimit(3)
    .withFields("title content")
    .do();

  res.status(201).json({ response: JSON.stringify(result, null, 2) });
});

weaviateRouter.post("/search", async (req, res) => {
  const inputString = req.body.text;
  console.log(inputString);

  if (!inputString) {
    res.status(400).json({ error: "text is required in request body" });
  }

  const generatePrompt =
    `You are an assistant. Answer ONLY with the facts given as a context. \
              Answer shortly for the questions given by the user. \
              Question: ${inputString}`;

  const promptText = `You are an entity extractor now. Extract entities from the following text: '${inputString}'`;
  try {
    const response = await axios.post(
      OPEN_AI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: promptText }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPEN_AI_APIKEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const entities = response.data.choices[0].message.content.trim();
    const result = await client.graphql
      .get()
      .withClassName("ResearchPaper")
      .withGenerate({
        groupedTask: generatePrompt,
        groupedProperties: ["content", "title"],
      })
      .withNearText({
        concepts: [entities],
      })
      .withFields("chunk_index")
      .withLimit(4)
      .do();

    // const { userInput } = req.body;
    res.status(201).json({ response: JSON.stringify(result, null, 2) });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default weaviateRouter;
