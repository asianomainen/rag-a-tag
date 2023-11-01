import express from "express";
import axios from "axios";
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

const executeWeaviateQuery = async (generatePrompt: string, concepts: string[]) => {
  return await client.graphql
    .get()
    .withClassName("ResearchPaper")
    .withGenerate({
      groupedTask: generatePrompt,
      groupedProperties: ["content", "title"],
    })
    .withNearText({ concepts })
    .withFields("chunk_index")
    .withLimit(4)
    .do();
};

weaviateRouter.get("/", async (_req, res) => {
  const generatePrompt =
    "You are an assistant. Answer ONLY with the facts given as a context. " +
    "Answer shortly for the questions given by the user. " +
    "Question: {What is the role of DevOps in software development?}";
  const result = await executeWeaviateQuery(generatePrompt, ["devops"]);
  res.status(200).json({ response: JSON.stringify(result, null, 2) });
});

weaviateRouter.get("/test", async (_req, res) => {
  const result = await client.graphql
    .get()
    .withClassName("ResearchPaper")
    .withHybrid({ query: "software" })
    .withLimit(3)
    .withFields("title content")
    .do();
  res.status(200).json({ response: JSON.stringify(result, null, 2) });
});

weaviateRouter.post("/search", async (req, res) => {
  const inputString = req.body.text;
  if (!inputString) {
    return res.status(400).json({ error: "text is required in request body" });
  }

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
    const generatePrompt = `You are an assistant. Answer ONLY with the facts given as a context. Answer shortly for the questions given by the user. Question: ${inputString}`;
    const result = await executeWeaviateQuery(generatePrompt, [entities]);

    const groupedResult = result.data.Get.ResearchPaper[0]._additional.generate.groupedResult;
    const references = result.data.Get.ResearchPaper.map((item: any) => item.chunk_index).sort();

    const parsedResult = { groupedResult, references };
    res.status(201).json({ response: JSON.stringify(parsedResult, null, 2) });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default weaviateRouter;