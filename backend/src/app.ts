import express from 'express'
import cors from 'cors'
import weaviateRouter from './routes/weaviate'
import { NODE_ENV } from './config'

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use('/api/weaviate', weaviateRouter)

if (NODE_ENV === "production") {
    app.get("*", (_req, res) => {
      res.sendFile("index.html", { root: "./build/" });
    });
  }

export default app
