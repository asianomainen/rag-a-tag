import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const WEAVIATE_DB_URL: string | null = process.env.WEAVIATE_DB_URL || "";
const WEAVIATE_APIKEY: string | null = process.env.WEAVIATE_APIKEY || "";
const OPEN_AI_APIKEY: string | null = process.env.OPEN_AI_APIKEY || "";

const NODE_ENV: string = process.env.NODE_ENV || "development";

export {
  PORT,
  WEAVIATE_DB_URL,
  WEAVIATE_APIKEY,
  OPEN_AI_APIKEY,
  NODE_ENV,
};