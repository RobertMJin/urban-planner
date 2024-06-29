import llmQuery from "../../langchain/gptquery.mjs";


export default function helloworld(req, res) {
		if (req.method === 'POST') {
			console.log(req.body);
			llmQuery(req.body).then((result) => {
				res.status(200).json({ message: result });
			})
		}
	}