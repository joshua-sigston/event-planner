import React from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '../ui/input-group'

interface TextAreaProps<T extends FieldValues> {
    name: Path<T>,
    placeholder: string,
    label: string,
    control: Control<T>,
    description?: string,
    maxLength?: number,
    rows?: number,
}

export default function TextArea<T extends FieldValues>({
    name, placeholder, label, control, description, maxLength = 100, rows = 6
}: TextAreaProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`form-field-${name}`}>
                        {label}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupTextarea
                            {...field}
                            id={`form-field-${name}`}
                            placeholder={placeholder}
                            rows={rows}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                                {(field.value as string)?.length ?? 0}/{maxLength} characters
                            </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    {description && (
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                    )}
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    )
}
