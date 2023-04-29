import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Readable } from 'stream'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

export const config = {
    api: {
        bodyParser: false,
    },
}

async function getRawBody(readable: Readable): Promise<Buffer> {
    const chunks = []
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Verify the webhook signature
        const rawBody = await getRawBody(req)
        const sig = req.headers['stripe-signature']!

        let event

        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (err: any) {
            console.log(`❌ Error message: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`)
            return
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('Payment intent succeeded:', event)

                break
            default:
                console.warn(`Unhandled event type ${event.type}`)
        }

        res.status(200).json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
