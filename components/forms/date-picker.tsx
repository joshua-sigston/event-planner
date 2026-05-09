'use client'

import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group'

function formatDate(date: Date | undefined) {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) return false
    return !isNaN(date.getTime())
}

interface DatePickerProps<T extends FieldValues> {
    name: Path<T>,
    label: string,
    control: Control<T>,
    placeholder?: string,
}

export default function DatePicker<T extends FieldValues>({
    name, label, control, placeholder = "June 01, 2026"
}: DatePickerProps<T>) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(formatDate(date))

    return (
        <Controller
            name={name}
            control={control}
            render={() => (
                <Field>
                    <FieldLabel htmlFor={`form-field-${name}`}>{label}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id={`form-field-${name}`}
                            value={value}
                            placeholder={placeholder}
                            onChange={(e) => {
                                const parsed = new Date(e.target.value)
                                setValue(e.target.value)
                                if (isValidDate(parsed)) {
                                    setDate(parsed)
                                    setMonth(parsed)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setOpen(true)
                                }
                            }}
                        />
                        <InputGroupAddon align="inline-end">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <InputGroupButton
                                        id={`date-picker-${name}`}
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label="Select date"
                                    >
                                        <CalendarIcon />
                                        <span className="sr-only">Select date</span>
                                    </InputGroupButton>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="end"
                                    alignOffset={-8}
                                    sideOffset={10}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        month={month}
                                        onMonthChange={setMonth}
                                        onSelect={(selected) => {
                                            setDate(selected)
                                            setValue(formatDate(selected))
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
            )}
        />
    )
}
