from langchain.text_splitter import RecursiveCharacterTextSplitter
import pypdf

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=120,
)

with open("./pipeline/mock/kafka_short.pdf", 'rb') as file:
    reader = pypdf.PdfReader(file)
    for page in reader.pages:
        texts = text_splitter.split_text(page.extract_text())
        for chunk in texts:
            print("------")
            print(chunk.replace("-\n", "").replace(".\n", ". ").replace("\n", " "))
