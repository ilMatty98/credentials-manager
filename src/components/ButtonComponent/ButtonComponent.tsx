import React from "react";

type ButtonComponentProps = {
    label?: string;
    id: any;
    className?: string;
    onClick: () => void;
    disabled?: boolean;
};

const ButtonComponent = ({
                             label,
                             id,
                             className,
                             onClick,
                             disabled
                         }: ButtonComponentProps) => {

    return (
        <button
            id={id}
            className={"font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ".concat(className ?? "")}
            type={"button"}
            onClick={() => onClick()}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default ButtonComponent;