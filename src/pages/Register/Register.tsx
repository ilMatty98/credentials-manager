import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {routesMap} from "../../routes/ReactRouter";
import {signUp} from "../../services/AuthenticationService";
import {AppContext} from "../../contexts/AppContextProvider";
import {mostraSpinner} from "../../hooks/useLoaderHook/UseLoaderHook";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/solid";
import {generatePropic, isEmptyString, isValidEmail, isValidPassword} from "../../utils/Utils";
import InputComponent from "../../components/InputComponent/InputComponent";
import {
    buttonComponent,
    changePageComponent,
    emailInputComponent,
    getForm,
    getTooltipMessageConfirmPassword,
    isValidConfirmPassword,
    isValidHint,
    MAX_LENGTH_HINT,
    passwordInputComponent
} from "../../utils/FormUtils";
import {useInterceptor} from "../../contexts/InterceptorContextProvider";
import {AUTHENTICATION_SERVICE_URL} from "../../config/Config";

const Register = () => {
    const {setBaseURL} = useInterceptor();
    const {appText} = useContext(AppContext);
    const {REGISTER} = appText;

    const navigate = useNavigate();

    const [state, setState] = useState<any>({
        form: {
            fields: {
                email: "",
                password: "",
                confirmPassword: "",
                hintPassword: "",
                viewPassword: false,
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

    const onClickSignUp = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            signUp({
                email: state.form.fields.email,
                password: state.form.fields.password,
                hint: state.form.fields.hintPassword,
                language: navigator.language.substring(0, 2).toUpperCase(),
                propic: generatePropic(state.form.fields.email.substring(0, 1))
            })
                .then(() => navigate(routesMap.LOGIN))
                .catch((error) => console.log("ERRORE: ", error))
        }, 10);
    };

    const signUpIsDisabled = () => {
        return !isValidEmail(state.form.fields.email) || !isValidPassword(state.form.fields.password)
            || !isValidConfirmPassword(state.form.fields.password, state.form.fields.confirmPassword)
            || !isValidHint(state.form.fields.hintPassword);
    };

    const elements = [emailInputComponent(state.form.fields.email, handleFormFieldChange, REGISTER, REGISTER.labelEmail),
        passwordInputComponent(state.form.fields.password, state.form.fields.viewPassword, handleFormFieldChange, REGISTER),
        <InputComponent
            color="blue-gray"
            label={REGISTER.labelConfirmPassword}
            id={"confirmPassword"}
            type={state.form.fields.viewConfirmPassword ? "text" : "password"}
            value={state.form.fields.confirmPassword}
            onChange={handleFormFieldChange}
            icon={state.form.fields.viewConfirmPassword ?
                <EyeSlashIcon
                    onClick={() => handleFormFieldChange("viewConfirmPassword", !state.form.fields.viewConfirmPassword)}
                    className="h-6 w-6 cursor-pointer"/> :
                <EyeIcon
                    onClick={() => handleFormFieldChange("viewConfirmPassword", !state.form.fields.viewConfirmPassword)}
                    className="h-6 w-6 cursor-pointer"/>}
            success={!isEmptyString(state.form.fields.password) && isValidConfirmPassword(state.form.fields.password, state.form.fields.confirmPassword)}
            error={!isEmptyString(state.form.fields.password) && !isValidConfirmPassword(state.form.fields.password, state.form.fields.confirmPassword)}
            message={getTooltipMessageConfirmPassword(state.form.fields.password, state.form.fields.confirmPassword, REGISTER)}
        />,
        <InputComponent
            color="blue-gray"
            label={REGISTER.hintPasswordLabel}
            id={"hintPassword"}
            type={"text"}
            value={state.form.fields.hintPassword}
            onChange={handleFormFieldChange}
            maxLength={MAX_LENGTH_HINT}
            success={!isEmptyString(state.form.fields.hintPassword) || isValidHint(state.form.fields.hintPassword)}
        />
    ];

    const button = buttonComponent("register", REGISTER.buttonSignUp, onClickSignUp, signUpIsDisabled());

    const changePage = changePageComponent(REGISTER.alreadyHaveAnAccount, REGISTER.signIn, routesMap.LOGIN);

    return getForm(REGISTER.title, elements, button, changePage);
}

export default Register;
