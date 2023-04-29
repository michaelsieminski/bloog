import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Webhook } from 'svix'
import { buffer } from 'micro'
import type { WebhookEvent } from '@clerk/clerk-sdk-node'

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

        try {
            const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? new Uint8Array())
            const message = webhook.verify(payload, headers)
        } catch (err: any) {
            console.log(`❌ Error message: ${err.message}`)
            res.status(400).send(`Webhook Error: ${err.message}`)
            return
        }

        const evt = req.body.evt as WebhookEvent
        switch (evt.type) {
            case 'user.created':
                console.log(evt.data.first_name)
                break
            default:
                console.warn(`Unhandled event type ${evt.type}`)
        }

        res.status(200).json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
