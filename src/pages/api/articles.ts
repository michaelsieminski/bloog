import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatGPTAPI } from 'chatgpt'
import * as Ably from 'ably'

interface PostData {
    title: string
    description: string
    userId: string
}

let channel: Ably.Types.RealtimeChannelPromise
let partialResponse: string
let responseParts: string[] = []
let running: boolean = false

const publishPartialResponse = async () => {
    setTimeout(() => {
        if (running) {
            let finalPartialResponse: string = ''

            if (responseParts[0] && responseParts[0] !== partialResponse) finalPartialResponse += responseParts[0]
            if (responseParts[1] && responseParts[1] !== partialResponse) finalPartialResponse += responseParts[1]
            finalPartialResponse += partialResponse

            channel.publish('partialResponse', finalPartialResponse)

            publishPartialResponse()
        }
    }, 200)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { title, description, userId }: PostData = JSON.parse(req.body)

        // Validate the request data
        if (!title || !description || !userId) {
            return res.status(400).json({ message: 'Invalid request data' })
        }

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_SECRET_KEY || '',
            completionParams: {
                temperature: 0.6,
                max_tokens: 1800,
            },
        })

        // Establish Ably Connection for partial responses
        const realtime = new Ably.Realtime.Promise({
            key: process.env.ABLY_ROOT_KEY,
        })
        channel = realtime.channels.get(userId)
        running = true

        publishPartialResponse()

        let response = await api.sendMessage(
            "Generate a minimum 1500 words long blog post. Format it properly using HTML Tags and Subtitles when a new logical content section begins. The title should be a h1 tag. Here is the data that should be used for the blog post: Title: '" +
                title +
                "'. Description: '" +
                description +
                "'.",
            {
                systemMessage:
                    'You are bloog, a super intelligent ChatGPT Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. Do not repeat yourself too much. With the following Data, please generate such a Blog Post that will use keywords many people search for to improve the SEO for the website. It is very important that the total length of a blog post is minimum 1500 words.',
                onProgress: (data) => {
                    partialResponse = data.text
                    console.log(data.text)
                },
            }
        )

        responseParts.push(response.text)

        response = await api.sendMessage('please continue with the blog post', {
            parentMessageId: response.id,
            onProgress: (data) => {
                partialResponse = data.text
            },
        })

        responseParts.push(response.text)

        response = await api.sendMessage(
            'please continue with the blog post. this is the last part of the blog post.',
            {
                parentMessageId: response.id,
                onProgress: (data) => {
                    partialResponse = data.text
                },
            }
        )

        running = false
        responseParts = []
        partialResponse = ''

        setTimeout(() => {
            realtime.close()
        }, 1000)

        return res.status(201).json({ response: response.text })
    } else {
        // Return a 405 status code for methods other than POST
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
