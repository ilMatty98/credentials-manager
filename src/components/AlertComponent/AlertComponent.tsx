import {Alert, Typography} from "@material-tailwind/react";
import React from "react";
import {colors} from "@material-tailwind/react/types/generic";

type AlertComponentProps = {
    open: boolean;
    closeAlert: () => void;
    color: colors;
    icon?: React.ReactNode;
    title?: string;
    message?: string;
    zIndex?: number
};

const AlertComponent = ({
                            open,
                            closeAlert,
                            color,
                            icon,
                            title,
                            message,
                            zIndex
                        }: AlertComponentProps) => {

    return (
        <Alert
            open={open}
            color={color}
            className="w-96 absolute content-center mt-6"
            icon={icon}
            onClose={() => closeAlert()}
            style={{zIndex: zIndex}}
        >
            <Typography variant="h5" color="white">
                {title}
            </Typography>
            <Typography color="white" className="mt-2 font-normal">
                {message}
            </Typography>
        </Alert>
    );
};

export default AlertComponent;