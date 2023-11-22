import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client'
import { OPEN_AI_APIKEY, WEAVIATE_APIKEY, WEAVIATE_DB_URL } from '../../config'

const client: WeaviateClient = weaviate.client({
  scheme: 'https',
  host: WEAVIATE_DB_URL || '',
  apiKey: new ApiKey(WEAVIATE_APIKEY || ''),
  headers: { 'X-OpenAI-Api-Key': OPEN_AI_APIKEY || '' },
})

export const executeWeaviateQuery = async (
  generatePrompt: string,
  query: string
) => {
  return await client.graphql
    .get()
    .withClassName('ResearchPaper')
    .withFields('chunk_index content page')
    .withGenerate({
      groupedTask: generatePrompt,
      groupedProperties: ['title', 'content'],
    })
    .withHybrid({
      query,
      properties: ['content^4'],
    })
    .withLimit(6)
    .do()
}
