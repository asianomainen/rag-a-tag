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
  concepts: string[]
) => {
  return await client.graphql
    .get()
    .withClassName('ResearchPaper')
    .withGenerate({
      groupedTask: generatePrompt,
      groupedProperties: ['content', 'title'],
    })
    .withNearText({ concepts })
    .withFields('chunk_index content')
    .withLimit(4)
    .do()
}
