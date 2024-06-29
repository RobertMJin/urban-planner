import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";


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