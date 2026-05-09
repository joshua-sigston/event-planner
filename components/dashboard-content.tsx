import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function DashboardContent({ userId }: { userId: string }) {
    return (
        <div className="">
            <div className="">
                <div className="">
                    <h1 className="">Track Events</h1>
                    <p className="">Track attendee responses and manage invite links.</p>
                </div>
                <Button asChild>
                    <Link href={"/event/new"}>Create Event</Link>
                </Button>
            </div>
            {/* list of events */}
        </div>
    )
}