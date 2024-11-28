import {Input} from "@material-tailwind/react";
import {colors} from "@material-tailwind/react/types/generic";
import React from "react";

type InputComponentProps = {
    color?: colors;
    label?: string;
    placeholder?: string;
    id: any;
    type: string;
    className?: string;
    value: any;
    onChange: (name: string, value: string) => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    success?: boolean;
    error?: boolean;
    message?: React.ReactNode;
    minLength?: number;
    maxLength?: number;
};

const InputComponent = ({
                            color,
                            label,
                            placeholder,
                            id,
                            type,
                            className,
                            value,
                            onChange,
                            disabled,
                            icon,
                            success,
                            error,
                            message,
                            minLength,
                            maxLength
                        }: InputComponentProps) => {

    return (
        <>
            <Input
                crossOrigin={undefined}
                color={color ?? "blue"}
                label={label}
                placeholder={placeholder}
                id={id}
                type={type}
                value={value}
                onChange={(event) => onChange(id, event.target.value)}
                icon={icon}
                success={success}
                disabled={disabled}
                error={error}
                minLength={minLength}
                maxLength={maxLength}
                className={className}
            />
            {message}
        </>
    );
};

export default InputComponent;