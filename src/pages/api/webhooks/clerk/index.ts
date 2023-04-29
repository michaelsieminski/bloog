import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Webhook } from 'svix'
import { buffer } from 'micro'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Verify the webhook signature
        const payload = (await buffer(req)).toString()
        const headers: any = req.headers

        let message: any
        try {
            const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? new Uint8Array())
            message = webhook.verify(payload, headers)
        } catch (err: any) {
            console.log(`❌ Error message: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`)
            return
        }

        switch (message.type) {
            case 'user.created':
                const customer = await stripe.customers.create({
                    email: message.data.email_addresses[0].email_address,
                    metadata: {
                        userId: message.data.id,
                    },
                })

                await prisma.user.create({
                    data: {
                        userId: message.data.id,
                        articlesTotalAmount: 0,
                        subscribed: false,
                        stripeCustomerId: customer.id,
                    },
                })

                break
            case 'user.deleted':
                const user = await prisma.user.findUnique({
                    where: {
                        userId: message.data.id,
                    },
                })

                // delete stripe customer
                await stripe.customers.del(user?.stripeCustomerId)

                // delete from database
                await prisma.user.delete({
                    where: {
                        userId: message.data.id,
                    },
                })
            default:
                console.warn(`Unhandled event type ${message.type}`)
        }

        res.status(200).json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
