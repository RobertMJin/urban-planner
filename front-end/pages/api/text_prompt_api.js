import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";


async function embedDocument(documentLink) {
	const loader = new CheerioWebBaseLoader(documentLink);
	const docs = await loader.load();    
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});
	const splits = await textSplitter.splitDocuments(docs);
	const vectorStore = await MemoryVectorStore.fromDocuments(
		splits,
		new OpenAIEmbeddings()
	);

	return vectorStore;
}

const LLM = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
const vectorStore = await embedDocument("https://en.wikipedia.org/wiki/Outline_of_fish");


async function llmQuery(prompt) {
	const retriever = vectorStore.asRetriever();
	const retrievedDocs = await retriever.invoke(prompt);
	return await LLM.invoke("Here is the context: " + retrievedDocs + " Here is the question: " + prompt);
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body);
        llmQuery(req.body.message).then((result) => {
            res.status(200).json({ message: result.content });
        })
    }
}