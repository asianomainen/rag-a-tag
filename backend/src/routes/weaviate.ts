import express from 'express'
import axios from 'axios'
import { OPEN_AI_APIKEY, OPEN_AI_API_URL } from '../config'
import { executeWeaviateQuery } from '../services/weaviate/weaviateService'

const weaviateRouter = express.Router()

weaviateRouter.post('/search', async (req, res) => {
  const inputString = req.body.text
  if (!inputString) {
    return res.status(400).json({ error: 'text is required in request body' })
  }

  const promptText = `You are an entity extractor now. Extract entities from the following text: '${inputString}'`
  try {
    const response = await axios.post(
      OPEN_AI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: promptText }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPEN_AI_APIKEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const entities = response.data.choices[0].message.content.trim()
    const generatePrompt = `You are an assistant. Answer ONLY with the facts given as a context. Answer shortly for the questions given by the user. Question: ${inputString}`
    const result = await executeWeaviateQuery(generatePrompt, [entities])

    const groupedResult =
      result.data.Get.ResearchPaper[0]._additional.generate.groupedResult

    const references = result.data.Get.ResearchPaper.map((item: any) => {
      return {
        chunk_index: item.chunk_index,
        content: item.content,
        page: item.page,
      }
    }).sort()

    const parsedResult = { groupedResult, references }
    return res
      .status(201)
      .json({ response: JSON.stringify(parsedResult, null, 2) })
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 429
    ) {
      console.log('Hit rate limit. Consider retrying after some time.')
      return res
        .status(429)
        .json({ error: 'Rate limit exceeded, please try again later' })
    } else {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
})

export default weaviateRouter
