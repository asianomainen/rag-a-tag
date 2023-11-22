# A Chat application PoC with RAG and LLMs

> [Computer Science Project](https://studies.helsinki.fi/courses/course-unit/hy-CU-135235236-2021-08-01) course by University of Helsinki

This chat application uses RAG (Retrieval-Augmented Generation) approach and OpenAI's LLM to generate responses to the user.

## Architectural overview

### Workflow

1. Frontend sends user input (<code>Tell me about microservice architecture.</code>) to the backend
2. Backend calls OpenAI API in order to use LLM to extract the entities from the user input. (<code>Tell me about microservice architecture.</code> => <code>Microservice architecture</code>)
3. Calls Weaviate with hybrid search (75% vector / 25% keyword) approach and passes the entities and the system message
4. Weaviate OpenAI integration passes the documents and the user input question (<code>Tell me about microservice architecture.</code>) to the OpenAI LLM
5. Passes the LLM generated response to the frontend

<img src="https://github.com/asianomainen/rag-a-tag/blob/main/docs/images/llm3.jpeg" width="80%" heigth="80%">

## ETL pipeline

<img src="https://github.com/asianomainen/rag-a-tag/blob/main/docs/images/pipeline2.drawio.png" width="100%" heigth="100%">
