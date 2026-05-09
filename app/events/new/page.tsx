'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Field,
    FieldGroup,
} from "@/components/ui/field"
import React from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/forms/input-field'
import TextArea from '@/components/forms/text-area'
import DatePicker from '@/components/forms/date-picker'
import { Button } from '@/components/ui/button'
import { createEventAction } from '@/lib/actions/events'

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Event title must be at least 5 characters.")
        .max(32, "Event title must be at most 32 characters."),
    description: z
        .string()
        .min(10, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
    location: z
        .string()
        .min(3, "Location must be at least 3 characters.")
        .max(32, "Location must be at most 32 characters."),
    date: z
        .string()
        .optional(),
})

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export default function Events() {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        new Date("2026-06-01")
    )
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(formatDate(date))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.set('title', data.title)
        formData.set('description', data.description)
        formData.set('location', data.location)
        if (data.date) formData.set('eventDate', data.date)

        await createEventAction(formData)
    }

    return (
        <div className="w-full max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-event" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <InputField name="title" placeholder="Event name" label="Event Name" control={form.control} />
                            <TextArea name="description" placeholder="Event description" label="Event Description" control={form.control} />
                            <InputField name="location" placeholder="Event location" label="Event Location" control={form.control} />
                            <DatePicker name="date" placeholder="Event date" label="Event Date" control={form.control} />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                        <Button type="submit" form="form-rhf-event">Submit</Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    )
}
