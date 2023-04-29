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

            if (finalPartialResponse != undefined) {
                channel.publish('partialResponse', finalPartialResponse)
            }

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

        // Generate Image Search Query for Thumbnail
        const imageQuery = await api.sendMessage(
            'Generate a super short and simple search query with not more than 3 words for Unsplash to find a good looking Image that fits the following Blog Post Idea: Title: ' +
                title +
                ', Description: ' +
                description,
            {
                systemMessage:
                    'You are bloog, a super intelligent AI Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. Your job is to genereate Unsplash image search prompts to find a good fitting image for the blog post',
            }
        )

        console.log('IMAGE QUERY PROMPT -> ' + imageQuery.text.replaceAll('"', '').replaceAll("'", ''))

        const apiBasePath = '/api/image?query="' + imageQuery.text.replaceAll('"', '').replaceAll("'", '') + '"'
        let image: any
        await fetch(process.env.BASE_URL + apiBasePath)
            .then((result) => {
                return result.json()
            })
            .then((jsonData) => {
                image = jsonData
            })
        channel.publish('image', image?.image.urls.full)

        // Generate Blog Post
        let response = await api.sendMessage(
            "Generate a minimum 1500 words long blog post. Format it properly using HTML Tags and Subtitles. Dont include Dates. The title should be a h1 tag. Dont include a Conclusion yet. Dont include Written by Bloog. Dont include Written by ChatGPT. Here is the data that should be used for the blog post: Title: '" +
                title +
                "'. Description: '" +
                description +
                "'.",
            {
                systemMessage:
                    'You are bloog, a super intelligent AI Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. Do not repeat yourself too much. With the following Data, please generate such a Blog Post that will use keywords many people search for to improve the SEO for the website. It is very important that the total length of a blog post is minimum 1500 words.',
                onProgress: (data) => {
                    partialResponse = data.text
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

        response = await api.sendMessage('please continue with the blog post. this is the last part of the blog post', {
            parentMessageId: response.id,
            onProgress: (data) => {
                partialResponse = data.text
            },
        })

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
