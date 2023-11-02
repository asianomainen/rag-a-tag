import express from 'express'
import cors from 'cors'
import weaviateRouter from './routes/weaviate'

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use('/api/weaviate', weaviateRouter)

export default app
