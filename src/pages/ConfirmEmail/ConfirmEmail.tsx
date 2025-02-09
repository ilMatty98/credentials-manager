import React, {useEffect, useState} from "react";

const parseUrl = () => {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length >= 2) {
        return {email: parts[0], code: parts[1]};
    }
    return {email: "", code: ""};
};

const ConfirmEmail = () => {

    const [state, setState] = useState<any>({
        email: "",
        code: ""
    });

    useEffect(() => {
        setState(parseUrl());
    }, []);

    return (
        <div>
            <h1>Confirm Email</h1>
            <p>Email: {state.email}</p>
            <p>Codice: {state.code}</p>
        </div>
    );
}

export default ConfirmEmail;
