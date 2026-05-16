import EventDetailsContent from '@/components/details/event-details-content'
import { getSession } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import React from 'react'

interface EventDetails {
    params: Promise<{ eventId: string }>
}

export default async function EventDetails({ params }: EventDetails) {
    const { eventId } = await params
    const session = await getSession()

    if (!session?.data?.user?.id) return redirect("/auth/sign-in")

    return (
        <EventDetailsContent userId={session.data.user.id} eventId={eventId} />
    )
}
