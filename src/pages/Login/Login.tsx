import {useContext, useEffect, useState} from "react";
import {routesMap} from "../../routes/ReactRouter";
import {AppContext} from "../../contexts/AppContextProvider";
import {getIPAddress, logIn} from "../../services/AuthenticationService";
import {isValidEmail, isValidPassword} from "../../utils/Utils";
import {
    buttonComponent,
    changePageComponent,
    emailInputComponent,
    getForm,
    passwordInputComponent
} from "../../utils/FormUtils";
import {AUTH_STATUS} from "../../enums/enum";
import {useNavigate} from "react-router-dom";
import {mostraSpinner} from "../../hooks/useLoaderHook/UseLoaderHook";
import {TLoginResponse} from "../../config/Types";
import {AUTH_STATE, LOG_IN, TOKEN, TOKEN_PUBLIC_KEY, USER_IP} from "../../utils/SessionStorageConst";
import {AUTHENTICATION_SERVICE_URL} from "../../config/Config";
import {useInterceptor} from "../../contexts/InterceptorContextProvider";

const Login = () => {
    const {setBaseURL} = useInterceptor();
    const {appText, setLangForText} = useContext(AppContext);
    const {LOGIN} = appText;

    const navigate = useNavigate();

    const [state, setState] = useState<any>({
        form: {
            fields: {
                email: "",
                password: "",
                viewConfirmPassword: false
            }
        }
    });

    const handleFormFieldChange = (name: string, value: any) => {
        setState((oldState: any) => {
            const newState = {...oldState};
            newState.form.fields[name] = value;
            return newState;
        })
    };

    const onClickLogIn = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            logIn({email: state.form.fields.email, password: state.form.fields.password})
                .then((loginResponse: TLoginResponse) => {
                    sessionStorage.setItem(TOKEN, loginResponse.token);
                    sessionStorage.setItem(TOKEN_PUBLIC_KEY, loginResponse.tokenPublicKey);
                    sessionStorage.setItem(AUTH_STATE, AUTH_STATUS.SUCCESS.toString());
                    sessionStorage.setItem(LOG_IN, JSON.stringify(loginResponse));
                    setLangForText(loginResponse.language);
                    navigate(routesMap.HOME);
                    console.log("RESP LOGIN: ", loginResponse);
                })
                .catch((error) => {
                    sessionStorage.setItem(AUTH_STATE, AUTH_STATUS.ERROR.toString());
                    console.log("ERRORE LOGIN: ", error)
                });
        }, 10);
    };

    useEffect(() => {
        getIPAddress()
            .then((ip) => sessionStorage.setItem(USER_IP, ip));
    }, []);

    const signInIsDisabled = () => {
        return !isValidEmail(state.form.fields.email) || !isValidPassword(state.form.fields.password)
    };

    const elements = [emailInputComponent(state.form.fields.email, handleFormFieldChange, LOGIN, LOGIN.labelEmail),
        passwordInputComponent(state.form.fields.password, state.form.fields.viewPassword, handleFormFieldChange, LOGIN)];

    const button = buttonComponent("login", LOGIN.buttonLogin, onClickLogIn, signInIsDisabled());

    const changePage = changePageComponent(LOGIN.notRegistered, LOGIN.signUp, routesMap.REGISTER);

    return getForm(LOGIN.title, elements, button, changePage);
}

export default Login;
