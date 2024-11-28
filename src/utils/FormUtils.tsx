import React from "react";
import {isEmptyString, isValidEmail, isValidPassword} from "./Utils";
import {Tooltip, Typography} from "@material-tailwind/react";
import {ExclamationTriangleIcon, EyeIcon, EyeSlashIcon} from "@heroicons/react/24/solid";
import InputComponent from "../components/InputComponent/InputComponent";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import {Link} from "react-router-dom";

export const MAX_LENGTH_HINT = 100;

export const getTooltipMessageEmail = (email: string, appText: any) => {
    const showTooltip = !isEmptyString(email) && !isValidEmail(email);
    return getTooltip(appText.emailNotValid, appText.emailNotValidTitle, showTooltip);
};

export const getTooltipMessagePassword = (password: string, appText: any) => {
    const showTooltip = !isEmptyString(password) && !isValidPassword(password);
    return getTooltip(appText.passwordNotValid, appText.passwordNotValidTitle, showTooltip);
};

export const getTooltipMessageConfirmPassword = (password: string, confirmPassword: string, appText: any) => {
    const showTooltip = !isEmptyString(password) && !isValidConfirmPassword(password, confirmPassword);
    return getTooltip(appText.confirmPasswordNotValid, appText.confirmPasswordNotValidTitle, showTooltip);
};

export const isValidConfirmPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
};

export const isValidHint = (hintPassword: string) => {
    return !isEmptyString(hintPassword) && hintPassword?.length <= MAX_LENGTH_HINT
};

export const getTooltip = (content: string, subContent: string, showTooltip: boolean) => {
    return showTooltip &&
        <Typography color={"red"} className={"text-xs mt-2"}>
            <Tooltip content={content} className="sm:w-80">
                <ExclamationTriangleIcon className="h-5 w-5 inline mr-1 cursor-pointer" fill="white" stroke="red"/>
            </Tooltip>
            {subContent}
        </Typography>
};

export const emailInputComponent = (email: string, onChange: (name: string, value: string) => void, appText: any,
                                    label: string, disabled: boolean = false) => {
    return <InputComponent
        color={"blue-gray"}
        label={label}
        id={"email"}
        type={"email"}
        value={email}
        onChange={onChange}
        success={isValidEmail(email)}
        error={!isEmptyString(email) && !isValidEmail(email)}
        message={getTooltipMessageEmail(email, appText)}
        disabled={disabled}
    />
}

export const passwordInputComponent = (password: string, viewPassword: boolean, onChange: (name: string, value: any) => void,
                                       appText: any, disabled: boolean = false) => {
    return <InputComponent
        color="blue-gray"
        label={appText.labelPassword}
        id={"password"}
        type={viewPassword ? "text" : "password"}
        value={password}
        onChange={onChange}
        icon={viewPassword ?
            <EyeSlashIcon
                onClick={() => onChange("viewPassword", !viewPassword)}
                className="h-6 w-6 cursor-pointer"/> :
            <EyeIcon
                onClick={() => onChange("viewPassword", !viewPassword)}
                className="h-6 w-6 cursor-pointer"/>}
        success={isValidPassword(password)}
        error={!isEmptyString(password) && !isValidPassword(password)}
        message={getTooltipMessagePassword(password, appText)}
        disabled={disabled}
    />
}

export const buttonComponent = (id: string, label: string, onClick: () => void, disabled: boolean, wFull: boolean = true) => {
    return <ButtonComponent
        id={id}
        onClick={onClick}
        label={label}
        className={"text-white bg-secondary ".concat(disabled ? " disabled:opacity-50 " : " cursor-pointer ").concat(wFull ? " w-full" : "")}
        disabled={disabled}
    />
}

export const changePageComponent = (question: string, answer: string, linkTo: string) => {
    return <i>{question} <Link to={linkTo} className="underline">{answer}</Link></i>
}

export const getForm = (titleForm: string, elements: React.ReactElement[], button: React.ReactElement, changePage: React.ReactElement) => {
    return <div className="flex justify-center items-center h-full mx-auto p-4">
        <div className="lg:w-96 sm:w-80 p-6 shadow-lg bg-white rounded-md mx-auto my-auto">
            <h1 className="text-4xl font-bold text-center text-primary">{titleForm}</h1>
            <hr className="my-6 border-red"/>
            <form>
                {elements.map((component, index) => (
                    <div className="mb-6" key={index}>{component}</div>
                ))}
                {button}
                <div className="text-center mt-3">
                    {changePage}
                </div>
            </form>
        </div>
    </div>
}
