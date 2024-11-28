import {Option, Select} from "@material-tailwind/react";
import React from "react";
import {colors} from "@material-tailwind/react/types/generic";

export type SelectOption = {
    value: string,
    label: string
}

type SelectComponentProps = {
    id: string;
    label: string,
    value: any;
    options: SelectOption[];
    onChange: (value?: string) => void;
    color?: colors
    disabled?: boolean;
};

const SelectComponent = ({
                             id,
                             label,
                             value,
                             onChange,
                             disabled,
                             options,
                             color = "blue-gray"
                         }: SelectComponentProps) => {

    return (
        <Select
            id={id}
            label={label}
            value={value}
            onChange={onChange}
            disabled={disabled}
            color={color}>
            {options.map(option =>
                <Option
                    key={option.value}
                    value={option.value}>
                    {option.label}
                </Option>
            )}
        </Select>
    );
};

export default SelectComponent;