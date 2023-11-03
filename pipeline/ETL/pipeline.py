import os
import glob
import pypdf
import weaviate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

WEAVIATE_DB_URL = os.getenv("WEAVIATE_DB_URL")
WEAVIATE_APIKEY = os.getenv("WEAVIATE_APIKEY")
OPEN_AI_APIKEY = os.getenv("OPEN_AI_APIKEY")
PDF_FILES_PATH = './pipeline/ETL/pdf_files/*.pdf'

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=120)
client = weaviate.Client(
    url=WEAVIATE_DB_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_APIKEY),
    additional_headers={"X-OpenAI-Api-Key": OPEN_AI_APIKEY}
)


def process_pdf(file_path):
    data = []

    with open(file_path, 'rb') as file:
        reader = pypdf.PdfReader(file)
        for page in reader.pages:
            texts = text_splitter.split_text(page.extract_text())
            for chunk in texts:
                data.append({
                    "title": os.path.basename(file_path),
                    "content": chunk.replace("-\n", "").replace(".\n", ". ").replace("\n", " "),
                })

    return data


def import_to_weaviate(data_objects):
    # UNCOMMENT LINES BELOW TO RE-UPLOAD PDF'S TO WEAVIATE
    # class_obj = {
    #     "class": "ResearchPaper",
    #     "vectorizer": "text2vec-openai",
    #     "moduleConfig": {
    #         "text2vec-openai": {},
    #         "generative-openai": {}
    #     }
    # }
    #
    # client.schema.delete_class("ResearchPaper")  # to delete the class
    # client.schema.create_class(class_obj)  # use this if "ResearchPaper" class is not created yet

    client.batch.configure(batch_size=100)
    with client.batch as batch:  # Initialize a batch process
        for i, d in enumerate(data_objects):  # Batch import data
            source_index = i + 1
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


def main():
    pdf_files = glob.glob(PDF_FILES_PATH)
    all_data = []

    for pdf_file in pdf_files:
        all_data.extend(process_pdf(pdf_file))

    import_to_weaviate(all_data)


if __name__ == "__main__":
    main()
