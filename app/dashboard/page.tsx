import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession } from '@/lib/auth/server'
import prisma from '@/lib/prisma'
import { Badge } from 'lucide-react'
import Link from 'next/link'
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums"

interface DashboardProps {
    userId: string
}

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
    let accepted = 0;
    let declined = 0;
    let maybe = 0;

    for (const r of rsvps) {
        if (r.status === "accepted") accepted++;
        if (r.status === "declined") declined++;
        if (r.status === "maybe") maybe++;
    }

    return { accepted, maybe, declined }
}

export default async function Dashboard({ userId }: DashboardProps) {
    const rows = await prisma.event.findMany({
        where: { ownerUserId: userId },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            location: true,
            eventDate: true,
        }
    })

    const events = rows.map((e: any) => ({
        id: e.id,
        title: e.title,
        eventDate: e.eventDate ? e.eventDate.toISOString() : null,
        ...countByStatus(e.rsvps)
    }))

    const session = await getSession()
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="">
                    <h1 className="text-2xl font-semibold tracking-tight">Your Events</h1>
                    <p className="text-sm">Track attendee responses and message invite links.</p>
                </div>

                <Button asChild>
                    <Link href={"/events/new"}>Create events</Link>
                </Button>
            </div>

            {/* list of events */}

            {events.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No events found.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No events found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <div>
                                    <CardTitle>{event.title}</CardTitle>
                                    <Button asChild>
                                        <Link href={`/events/${event.id}`}>Open</Link>
                                    </Button>
                                </div>
                                <div>
                                    <Badge>Accepted: {event.accepted}</Badge>
                                    <Badge>Maybe: {event.maybe}</Badge>
                                    <Badge>Declined: {event.declined}</Badge>
                                </div>
                                <p>{event.eventDate
                                    ? new Date(event.eventDate).toLocaleDateString()
                                    : "No Date Selected"}
                                </p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
