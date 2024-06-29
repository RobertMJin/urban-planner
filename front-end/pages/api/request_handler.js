// pages/api/example.js

export default function helloworld(req, res) {
    if (req.method === 'GET') {
      res.status(200).json({ message: 'Hello World!' });
    }
  }
  