import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatGPTAPI } from 'chatgpt'
import * as Ably from 'ably'
import { PrismaClient } from '@prisma/client'

interface PostData {
    title: string
    description: string
    userId: string
}

let channel: Ably.Types.RealtimeChannelPromise
let partialResponse: string
let responseParts: string[] = []
let running: boolean = false

const prisma = new PrismaClient()

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

const addArticleAmount = async (userId: string) => {
    await prisma.user.update({
        where: {
            userId: userId,
        },
        data: {
            articlesTotalAmount: {
                increment: 1,
            },
        },
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { title, description, userId }: PostData = JSON.parse(req.body)

        // Validate the request data
        if (!title || !description || !userId) {
            return res.status(400).json({ message: 'Invalid request data' })
        }

        // Check if user has subscribed
        // const user = await prisma.user.findUnique({
        //     where: {
        //         userId: userId,
        //     },
        // })

        // if (!user || (user && user?.articlesTotalAmount > 10 && !user?.subscribed)) {
        //     return false
        // }

        addArticleAmount(userId)
            .then(async () => {
                prisma.$disconnect
            })
            .catch(async (e) => {
                prisma.$disconnect
            })

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_SECRET_KEY || '',
            completionParams: {
                temperature: 0.8,
                max_tokens: 1400,
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
            'Generate a super short and simple summarized search query with one word for Unsplash to find a good looking Image that fits the following Blog Post Idea: Title: ' +
                title,
            {
                systemMessage:
                    'You are bloog, a super intelligent AI Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. Your job is to genereate Unsplash image search prompts to find a good fitting image for the blog post',
            }
        )

        console.log(imageQuery.text)

        const apiBasePath = '/api/image?query="' + imageQuery.text.replaceAll('"', '').replaceAll("'", '') + '"'
        let image: any
        await fetch(process.env.BASE_URL + apiBasePath)
            .then((result) => {
                return result.json()
            })
            .then((jsonData) => {
                image = jsonData
            })
        channel.publish(
            'image',
            JSON.stringify({
                url: image?.image.urls.regular,
                alt: image?.image.description,
                author_name: image?.image.user.name,
                author_url: image?.image.user.links.html,
                redirect: image?.image.links.html,
            })
        )

        // Generate Blog Post
        let response = await api.sendMessage(
            "Generate a minimum 1500 words long blog post. Format it properly using HTML Tags and Subtitles. The title should be a h1 tag. Dont include Written by Bloog. Dont include Written by ChatGPT. Here is the data that should be used for the blog post: Title: '" +
                title +
                "'. Description: '" +
                description +
                "'.",
            {
                systemMessage:
                    'You are bloog, a super intelligent AI Tool that is capable of generating professional, seo optimized blog posts with a given Title and Description. Do not repeat yourself. With the following Data, please generate such a Blog Post that will use keywords many people search for to improve the SEO for the website. It is very important that the total length of a blog post is minimum 1500 words.',
                onProgress: (data) => {
                    partialResponse = data.text
                },
            }
        )

        responseParts.push(response.text)

        response = await api.sendMessage('go on', {
            parentMessageId: response.id,
            onProgress: (data) => {
                partialResponse = data.text
            },
        })

        responseParts.push(response.text)

        response = await api.sendMessage('go on (this is the last part of the blogpost)', {
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
