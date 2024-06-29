import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import * as dotenv from "dotenv";
dotenv.config();

const LLM = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
// LLM.invoke("what is 1 + 1").then((res) => {
//   console.log(res);
// });



const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/"
);

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

// Retrieve and generate using the relevant snippets of the blog.
const retriever = vectorStore.asRetriever();
const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

// ???
// const ragChain = await createStuffDocumentsChain({
//   llm,
//   prompt,
//   outputParser: new StringOutputParser(),
// });

const retrievedDocs = await retriever.invoke("what is task decomposition");

const gptResponse = await LLM.invoke("Here is the context: " + retrievedDocs + " Here is the question: what is task decomposition");
const outputParser = new StringOutputParser();

console.log(outputParser.parse(gptResponse));

// ragChain.invoke({
//     question: "What is task decomposition?",
//     context: retrievedDocs,
//   }).then((res) => {
//     console.log(res);
//   });
