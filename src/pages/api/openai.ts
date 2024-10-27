import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openaiInstance = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const response = await openaiInstance.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      res.status(200).json(response.choices);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
