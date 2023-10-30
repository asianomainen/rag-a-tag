import weaviate
import json

from os import getenv
from dotenv import load_dotenv
load_dotenv()

WEAVIATE_DB_URL = getenv("WEAVIATE_DB_URL")
WEAVIATE_APIKEY = getenv("WEAVIATE_APIKEY")
OPEN_AI_APIKEY = getenv("OPEN_AI_APIKEY")

client = weaviate.Client(
    url = WEAVIATE_DB_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_APIKEY), 
    additional_headers = {
        "X-OpenAI-Api-Key": OPEN_AI_APIKEY
    }
)

class_obj = {
    "class": "ResearchPaper",
    "vectorizer": "text2vec-openai", 
    "moduleConfig": {
        "text2vec-openai": {},
        "generative-openai": {}
    }
}

#client.schema.delete_class("ResearchPaper")
client.schema.create_class(class_obj) # use this if "ResearchPaper" class is not created yet

mock_file = open('mock_data.json')
data = json.load(mock_file)

client.batch.configure(batch_size=100)  # Configure batch
with client.batch as batch:  # Initialize a batch process
    for i, d in enumerate(data):  # Batch import data
        source_index = i+1
        print(f"importing question: {source_index}")
        properties = {
            "title": d["title"],
            "content": d["content"],
            "chunk_index": d["title"] + f"_{source_index}"
        }
        batch.add_data_object(
            data_object=properties,
            class_name="ResearchPaper"
        )