import { countByStatus } from '@/app/dashboard/page'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Badge } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { createInviteLinkAction } from '@/lib/actions/events'

interface EventDetailsContentProps {
    userId: string,
    eventId: string,
}

export default async function EventDetailsContent({ userId, eventId }: EventDetailsContentProps) {
    const row = await prisma.event.findFirst({
        where: { id: eventId, ownerUserId: userId },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            eventDate: true,
            invite: { select: { token: true } },
            rsvps: { select: { status: true } },
        }
    })

    if (!row) {
        notFound()
    }

    const counts = countByStatus(row.rsvps)

    const event = {
        id: row.id,
        title: row.title,
        description: row.description,
        location: row.location,
        eventDate: row.eventDate ? row.eventDate.toISOString() : null,
        inviteToken: row.invite?.token ?? null,
        accepted: counts.accepted,
        maybe: counts.maybe,
        declined: counts.declined,
    }

    const createInviteAction = createInviteLinkAction.bind(null, event.id)
    const inviteUrl = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}` : null
    return (
        <div className="">
            <div className="">
                <h1 className="">{event.title}</h1>
                <p className="">{event.eventDate
                    ? new Date(event.eventDate).toLocaleString()
                    : "No Date Selected"}
                </p>
                {event.description && <p>{event.description}</p>}
            </div>
            <Button asChild>
                <Link href={`/dashboard`}>Edit Event</Link>
            </Button>
            <div>
                <Badge>Accepted: {event.accepted}</Badge>
                <Badge>Maybe: {event.maybe}</Badge>
                <Badge>Declined: {event.declined}</Badge>
            </div>

            <Card>
                <CardHeader>
                    Invite Link
                </CardHeader>
                <CardContent>
                    <p className="">Share this link with guests so they can RSVP without creating an account</p>
                    {inviteUrl ? <div>{inviteUrl}</div> : <p>No invite link generated yet.</p>}

                    <form id="form-rhf-event" onSubmit={createInviteAction}>
                        <Button type="submit">Generate Link</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
