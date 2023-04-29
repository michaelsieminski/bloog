import type { NextApiRequest, NextApiResponse } from 'next'
import { createApi } from 'unsplash-js'

interface GetData {
    query: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { query } = req.query as unknown as GetData

        // Validate the request data
        if (!query) {
            return res.status(400).json({ message: 'Invalid request data' })
        }

        const unsplash = createApi({
            accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
        })

        let image
        await unsplash.photos
            .getRandom({
                query: query,
                orientation: 'landscape',
            })
            .then((result) => {
                image = result.response
            })

        return res.status(201).json({ image: image })
    } else {
        // Return a 405 status code for methods other than GET
        res.setHeader('Allow', 'GET')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
