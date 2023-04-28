import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatGPTAPI } from 'chatgpt'

interface PostData {
    title: string
    description: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { title, description }: PostData = JSON.parse(req.body)

        // Validate the request data
        if (!title || !description) {
            return res.status(400).json({ message: 'Invalid request data' })
        }

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_SECRET_KEY || '',
            completionParams: {
                temperature: 0.7,
                max_tokens: 2000,
            },
        })

        const antwort = await api.sendMessage(
            "Generate the first 500/1500 words of the blog post. Title: '" +
                title +
                "'. Description: '" +
                description +
                "'.",
            {
                systemMessage:
                    'You are bloog, a super intelligent ChatGPT Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. With the following Data, please generate such a Blog Post that will use keywords many people search for to improve the SEO for the website.',
                onProgress: (partialResponse) => console.log(partialResponse.text),
            }
        )

        console.log(antwort.text)

        return res.status(201).json({ title, description })
    } else {
        // Return a 405 status code for methods other than POST
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
