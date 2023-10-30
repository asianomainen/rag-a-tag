# A Chat application PoC with RAG and LLMs

> [Computer Science Project](https://studies.helsinki.fi/courses/course-unit/hy-CU-135235236-2021-08-01) course by University of Helsinki

This chat application uses RAG (Retrieval-Augmented Generation) approach and OpenAI's LLM to generate responses to the user.

## Architectural overview

### Workflow

1. Frontend sends user input (<code>Tell me about microservice architecture.</code>) to the backend
2. Backend extracts entities from the user input. (<code>Tell me about microservice architecture.</code> => <code>Microservice architecture</code>)
3. Creates embeddings from the entities (<code>Microservice architecture</code> => <code>[0.123124, -0.65324234, 0.345342, ..., 0.95123213]</code>)
4. Calls Weaviate with hybrid search approach and includes embeddings and the entities
5. Passes the documents from Weaviate, and the user input question (<code>Tell me about microservice architecture.</code>) to the OpenAI LLM
6. Passes the LLM generated response to the frontend

<img src="https://github.com/asianomainen/rag-a-tag/blob/main/docs/images/llm.drawio.png" width="80%" heigth="80%">

## ETL pipeline

<img src="https://github.com/asianomainen/rag-a-tag/blob/main/docs/images/pipeline.drawio.png" width="80%" heigth="80%">
