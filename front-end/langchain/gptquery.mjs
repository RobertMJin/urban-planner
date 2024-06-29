import { ChatOpenAI } from "@langchain/openai";
import { embedDocument } from "./embedder.mjs";


const LLM = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
const vectorStore = await embedDocument("https://en.wikipedia.org/wiki/Outline_of_fish");


async function llmQuery(prompt) {
	const retriever = vectorStore.asRetriever();
	const retrievedDocs = await retriever.invoke(prompt);
	return await LLM.invoke("Here is the context: " + retrievedDocs + " Here is the question: " + prompt);
}

llmQuery("What types of animals are ectothermic").then(res => console.log(res.content));