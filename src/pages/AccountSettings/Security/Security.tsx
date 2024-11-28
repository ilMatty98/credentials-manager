import React, {useContext, useState} from "react";
import {Card, CardBody, Typography} from "@material-tailwind/react";
import {AppContext} from "../../../contexts/AppContextProvider";
import {useNavigate} from "react-router-dom";
import "./Security.scss";
import {
    buttonComponent,
    getTooltip,
    getTooltipMessagePassword,
    isValidHint,
    MAX_LENGTH_HINT
} from "../../../utils/FormUtils";
import InputComponent from "../../../components/InputComponent/InputComponent";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/solid";
import {getInfoFromLogIn, isEmptyString, isValidPassword, signOut} from "../../../utils/Utils";
import {mostraSpinner, nascondiSpinner} from "../../../hooks/useLoaderHook/UseLoaderHook";
import {changeInformation, changePassword} from "../../../services/AuthenticationService";
import {AUTH_STATE, LOG_IN} from "../../../utils/SessionStorageConst";
import {AUTH_STATUS} from "../../../enums/enum";
import {AUTHENTICATION_SERVICE_URL} from "../../../config/Config";
import {useInterceptor} from "../../../contexts/InterceptorContextProvider";

const initialFormChangePassword = {
    currentMasterPasswordHash: "",
    currentMasterPasswordHashView: false,
    newMasterPasswordHash: "",
    newMasterPasswordHashView: false,
    confirmNewMasterPasswordHash: "",
    confirmNewMasterPasswordHashView: false,
};

const Security = () => {

    const [formChangePassword, setFormChangePassword] = useState<any>(initialFormChangePassword);
    const [hint, setHint] = useState<any>(getInfoFromLogIn("hint"));
    const navigate = useNavigate();

    const {setBaseURL} = useInterceptor();
    const {appText} = useContext(AppContext);
    const {ACCOUNT_SETTINGS, LOGIN, REGISTER} = appText;

    const handleChangePassword = (name: string, value: any) => {
        setFormChangePassword((oldState: any) => {
            const newState = {...oldState};
            newState[name] = value;
            return newState;
        })
    };

    const passwordInputComponent = (password: string, viewPassword: boolean, onChange: (name: string, value: any) => void,
                                    appText: any, id: string, viewName: string, label: string) => {
        return <InputComponent
            color="blue-gray"
            label={label}
            id={id}
            type={viewPassword ? "text" : "password"}
            value={password}
            onChange={onChange}
            icon={viewPassword ?
                <EyeSlashIcon
                    onClick={() => onChange(viewName, !viewPassword)}
                    className="h-6 w-6 cursor-pointer"/> :
                <EyeIcon
                    onClick={() => onChange(viewName, !viewPassword)}
                    className="h-6 w-6 cursor-pointer"/>}
            success={isValidPassword(password)}
            error={!isEmptyString(password) && !isValidPassword(password)}
            message={getTooltipMessagePassword(password, appText)}
        />
    }

    const passwordConfirmInputComponent = (password: string, viewPassword: boolean, onChange: (name: string, value: any) => void,
                                           appText: any, id: string, viewName: string, label: string) => {
        const error = !isEmptyString(password) && password !== formChangePassword.newMasterPasswordHash;
        return <InputComponent
            color="blue-gray"
            label={label}
            id={id}
            type={viewPassword ? "text" : "password"}
            value={password}
            onChange={onChange}
            icon={viewPassword ?
                <EyeSlashIcon
                    onClick={() => onChange(viewName, !viewPassword)}
                    className="h-6 w-6 cursor-pointer"/> :
                <EyeIcon
                    onClick={() => onChange(viewName, !viewPassword)}
                    className="h-6 w-6 cursor-pointer"/>}
            success={isValidPassword(password)}
            error={error}
            message={getTooltip(ACCOUNT_SETTINGS.passwordsDoNotMatch, ACCOUNT_SETTINGS.passwordsDoNotMatch, error)}
        />
    }

    const onClickChangePassword = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            changePassword({
                currentMasterPasswordHash: formChangePassword.currentMasterPasswordHash,
                newMasterPasswordHash: formChangePassword.newMasterPasswordHash
            }).then(() => signOut(navigate)).catch((error) => console.log("ERROR", error));
        }, 10);
    };

    const changePasswordDisabled = () => {
        return !isValidPassword(formChangePassword.currentMasterPasswordHash) ||
            !isValidPassword(formChangePassword.newMasterPasswordHash) ||
            !isValidPassword(formChangePassword.confirmNewMasterPasswordHash) ||
            formChangePassword.newMasterPasswordHash !== formChangePassword.confirmNewMasterPasswordHash;
    };

    function getInputComponentHint() {
        const isValid = isValidHint(hint);
        return <InputComponent
            color="blue-gray"
            label={REGISTER.hintPasswordLabel}
            id={"hintPassword"}
            type={"text"}
            value={hint}
            onChange={(_e, v) => setHint(v)}
            maxLength={MAX_LENGTH_HINT}
            success={isValid}
            error={!isValid}
            message={getTooltip(REGISTER.mandatoryHint, REGISTER.mandatoryHint, !isValid)}
        />;
    }

    const onClickChangeHint = () => {
        mostraSpinner();
        setTimeout(() => {
            const loginResponse = JSON.parse(sessionStorage.getItem(LOG_IN) ?? '');
            loginResponse.hint = hint;
            setBaseURL(AUTHENTICATION_SERVICE_URL as string);
            changeInformation({
                language: getInfoFromLogIn('language'),
                hint: hint,
                propic: getInfoFromLogIn('propic')
            }).then(() => {
                sessionStorage.setItem(LOG_IN, JSON.stringify(loginResponse));
                nascondiSpinner();
            }).catch((error) => {
                sessionStorage.setItem(AUTH_STATE, AUTH_STATUS.ERROR.toString());
                console.log("Error: ", error);
            });
        }, 10);
    };

    function disableBtnConfirmHint() {
        return !isValidHint(hint) || hint === getInfoFromLogIn("hint");
    }

    return (
        <Card>
            <CardBody>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        {ACCOUNT_SETTINGS.changePassword}
                    </Typography>
                    <hr className="mb-4 mt-2"/>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="md:flex-1">
                            {passwordInputComponent(formChangePassword.currentMasterPasswordHash,
                                formChangePassword.currentMasterPasswordHashView, handleChangePassword, LOGIN,
                                "currentMasterPasswordHash", "currentMasterPasswordHashView",
                                ACCOUNT_SETTINGS.currentPassword)}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 my-4">
                        <div className="md:flex-1">
                            {passwordInputComponent(formChangePassword.newMasterPasswordHash,
                                formChangePassword.newMasterPasswordHashView, handleChangePassword, LOGIN,
                                "newMasterPasswordHash", "newMasterPasswordHashView",
                                ACCOUNT_SETTINGS.newPassword)}
                        </div>
                        <div className="md:flex-1">
                            {passwordConfirmInputComponent(formChangePassword.confirmNewMasterPasswordHash,
                                formChangePassword.confirmNewMasterPasswordHashView, handleChangePassword, LOGIN,
                                "confirmNewMasterPasswordHash", "confirmNewMasterPasswordHashView",
                                REGISTER.labelConfirmPassword)}
                        </div>
                    </div>
                    <div className="pt-4">
                        {buttonComponent("changePassword", ACCOUNT_SETTINGS.confirm, onClickChangePassword, changePasswordDisabled(), false)}
                    </div>

                    <div className="pt-10">
                        <Typography variant="h5" color="blue-gray">
                            {ACCOUNT_SETTINGS.changeHint}
                        </Typography>
                        <hr className="mb-4 mt-2"/>
                        <div className="grid grid-cols-12 grid-rows-1">
                            <div className="col-span-5 col-start-1">
                                {getInputComponentHint()}
                            </div>
                        </div>
                        <div className="pt-4">
                            {buttonComponent("changeHint", ACCOUNT_SETTINGS.confirm, onClickChangeHint, disableBtnConfirmHint(), false)}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>);
}

export default Security;
