import React, {useEffect, useState} from "react";
import {mostraSpinner} from "../../hooks/useLoaderHook/UseLoaderHook";
import {AUTHENTICATION_SERVICE_URL} from "../../config/Config";
import {confirmEmail} from "../../services/AuthenticationService";
import {useInterceptor} from "../../contexts/InterceptorContextProvider";
import {CONFIRM_EMAIL} from "../../hooks/useLanguageHook/i18n/en";
import {Link} from "react-router-dom";
import {routesMap} from "../../routes/ReactRouter";
import {getForm} from "../../utils/FormUtils";

const parseUrl = () => {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);

    if (parts.length >= 2) {
        return {email: parts[0], code: parts[1]};
    }
    return {email: "", code: ""};
};

const ConfirmEmail = () => {
    const {setBaseURL} = useInterceptor();

    const [state, setState] = useState<any>({
        confirm: null
    });

    useEffect(() => {
        const {email, code} = parseUrl();
        if (state.confirm == null) sendConfirmEmail(email, code);
    }, [state]);

    const sendConfirmEmail = (email: string, code: string) => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            confirmEmail(email, code)
                .then((res: any) => {
                    console.log("CONFERMA OK", res)
                    setState({confirm: true});
                })
                .catch((error) => {
                    console.log("ERRORE LOGIN: ", error)
                    setState({confirm: false});
                });
        }, 10);
    };

    const elements = [<h1 className="text-xl text-center">{state.confirm == null ? CONFIRM_EMAIL.progress :
        (state.confirm ? CONFIRM_EMAIL.confirmEmailOk : CONFIRM_EMAIL.confirmEmailKo)}</h1>];

    const changePage = <Link to={routesMap.LOGIN} className="underline">{CONFIRM_EMAIL.backToLogin}</Link>;

    return getForm(CONFIRM_EMAIL.confirmEmail, elements, <></>, changePage);
}

export default ConfirmEmail;
