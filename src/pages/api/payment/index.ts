import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

interface PostData {
    userId: string
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId }: PostData = JSON.parse(req.body)

        // Validate the request data
        if (!userId) {
            return res.status(400).json({ message: 'Invalid request data' })
        }

        // Check if user has subscribed
        const user = await prisma.user.findUnique({
            where: {
                userId: userId,
            },
        })

        if (!user || (user && user?.subscribed)) {
            return false
        }

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: process.env.STRIPE_BASIC_PRICE,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.BASE_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/?canceled=true`,
        })

        return res.status(201).json({ url: session.url })
    } else {
        // Return a 405 status code for methods other than POST
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
