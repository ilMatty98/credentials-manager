import React, {useContext, useState} from "react";
import {Card, CardBody, Dialog, DialogBody, DialogFooter, DialogHeader, Typography} from "@material-tailwind/react";
import {buttonComponent, emailInputComponent, passwordInputComponent} from "../../../utils/FormUtils";
import InputComponent from "../../../components/InputComponent/InputComponent";
import {AppContext} from "../../../contexts/AppContextProvider";
import {mostraSpinner} from "../../../hooks/useLoaderHook/UseLoaderHook";
import {changeEmail, confirmChangeEmail, deleteAccount} from "../../../services/AuthenticationService";
import {formatDateString, getInfoFromLogIn, isValidEmail, isValidPassword, signOut} from "../../../utils/Utils";
import {useNavigate} from "react-router-dom";
import {EMAIL} from "../../../utils/SessionStorageConst";
import "./MyAccount.scss";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import { AUTHENTICATION_SERVICE_URL } from "../../../config/Config";
import { useInterceptor } from "../../../contexts/InterceptorContextProvider";

const initialForm = {
    email: "",
    password: "",
    viewPassword: false,
    verificationCode: ""
};

enum TypeDialog {
    DELETE_ALL_CREDENTIALS,
    DELETE_ACCOUNT
}

const MyAccount = () => {

    const [emailChanged, setEmailChanged] = useState<boolean>(false);
    const [formChangeEmail, setFormChangeEmail] = useState<any>(initialForm);
    const [formDialog, setFormDialog] = useState<any>(initialForm);
    const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false);
    const [typeDialogDelete, setTypeDialogDelete] = React.useState<TypeDialog | null>(null);

    const navigate = useNavigate();

    const { setBaseURL } = useInterceptor();
    const {appText} = useContext(AppContext);
    const {ACCOUNT_SETTINGS, LOGIN} = appText;

    const handleChangeEmail = (name: string, value: any) => {
        setFormChangeEmail((oldState: any) => {
            const newState = {...oldState};
            if (name !== "verificationCode")
                newState[name] = value;
            else
                newState[name] = /^(?:[0-9]+)?$/.test(value) ? value : newState[name];
            return newState;
        })
    };

    const handleDialog = (name: string, value: any) => {
        setFormDialog((oldState: any) => {
            const newState = {...oldState};
            if (name !== "verificationCode")
                newState[name] = value;
            else
                newState[name] = /^(?:[0-9]+)?$/.test(value) ? value : newState[name];
            return newState;
        })
    };

    const confirmChangeEmailDisabled = () => {
        return !formChangeEmail.verificationCode;
    };

    const onClickConfirmChangeEmail = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            confirmChangeEmail({
                email: formChangeEmail.email,
                newMasterPasswordHash: formChangeEmail.password,
                verificationCode: formChangeEmail.verificationCode
            }).then(() => signOut(navigate)).catch((error) => console.log("ERROR", error));
        }, 10);
    };

    const onClickChangeEmail = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            changeEmail({
                email: formChangeEmail.email,
                masterPasswordHash: formChangeEmail.password
            }).then(() => setEmailChanged(true)).catch((error) => console.log("ERROR", error));
        }, 10);
    };

    const changeEmailDisabled = () => {
        return !isValidEmail(formChangeEmail.email) || !isValidPassword(formChangeEmail.password) ||
            formChangeEmail.email === sessionStorage.getItem(EMAIL);
    };

    const dialogConfirmDisabled = () => {
        return !isValidPassword(formDialog.password);
    };

    const onClickConfirmDeleteAccount = () => {
        mostraSpinner();
        setBaseURL(AUTHENTICATION_SERVICE_URL as string);
        setTimeout(() => {
            deleteAccount({masterPasswordHash: formDialog.password})
                .then(() => signOut(navigate))
                .catch((error) => console.log("ERROR", error));
        }, 10);
    };

    const handleOpenDialog = (typeDialog: TypeDialog | null) => {
        setOpenDialogDelete(!openDialogDelete);
        setFormDialog(initialForm);
        setTypeDialogDelete(typeDialog);
    }

    const dangerButton = (id: string, handleOpenDialog: () => void, label: string) => {
        return <ButtonComponent
            id={id}
            onClick={handleOpenDialog}
            label={label}
            className={"border border-red-500 text-red-500 cursor-pointer"}
        />;
    }

    const dialogDelete = (open: boolean, handle: () => void) => {
        const btnConfirmDisabled = dialogConfirmDisabled();
        const confirm = typeDialogDelete === TypeDialog.DELETE_ACCOUNT ? onClickConfirmDeleteAccount : () => undefined;
        return <Dialog open={open} handler={handle} size="xs">
            <DialogHeader>
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="mt-px h-8 w-8" color="red"/>
                    <h5 className="ml-2" style={{color: "red"}}>{ACCOUNT_SETTINGS.warning}</h5>
                </div>
            </DialogHeader>
            <DialogBody className="pl-4 pr-4 pt-0">
                <div className="grid grid-cols-5 grid-rows-2 p-0 m-0">
                    <div className="col-span-5 col-start-1 pb-5">
                        {ACCOUNT_SETTINGS.deletionIsPermanent}
                        <br/>
                        {ACCOUNT_SETTINGS.insertPassword}
                    </div>
                    <div className="col-span-5 col-start-1">
                        {passwordInputComponent(formDialog.password, formDialog.viewPassword, handleDialog, LOGIN, emailChanged)}
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <ButtonComponent
                    id="exit"
                    onClick={handle}
                    label={ACCOUNT_SETTINGS.close}
                    className={"border border-primary text-primary cursor-pointer"}
                />
                <ButtonComponent
                    id={"confirm"}
                    onClick={confirm}
                    label={ACCOUNT_SETTINGS.delete}
                    className={"border border-red-500 text-red-500 cursor-pointer".concat(btnConfirmDisabled ? " disabled:opacity-50 " : " cursor-pointer ")}
                    disabled={btnConfirmDisabled}
                />
            </DialogFooter>
        </Dialog>
    }

    const renderAccountInformation = (key: string, value: string) => {
        return <div style={{display: 'flex', alignItems: 'baseline'}}>
            <Typography variant="lead" color="blue-gray">
                {key + ":"}
            </Typography>
            <div style={{marginLeft: '8px'}}>
                <Typography variant="paragraph">
                    {value}
                </Typography>
            </div>
        </div>
    }

    return (
        <>
            {dialogDelete(openDialogDelete, () => handleOpenDialog(null))}
            <Card>
                <CardBody>
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            {ACCOUNT_SETTINGS.myAccount}
                        </Typography>
                        <hr className="mb-4 mt-2"/>
                        {renderAccountInformation("Email", sessionStorage.getItem(EMAIL) as string)}
                        {renderAccountInformation(ACCOUNT_SETTINGS.lastAccess, formatDateString(getInfoFromLogIn("timestampLastAccess")))}
                        {renderAccountInformation(ACCOUNT_SETTINGS.accountCreationDate, formatDateString(getInfoFromLogIn("timestampCreation")))}
                        {renderAccountInformation(ACCOUNT_SETTINGS.lastEmailChangeDate, formatDateString(getInfoFromLogIn("timestampEmail")))}
                        {renderAccountInformation(ACCOUNT_SETTINGS.lastPasswordChangeDate, formatDateString(getInfoFromLogIn("timestampPassword")))}
                    </div>

                    <div className="pt-10">
                        <Typography variant="h5" color="blue-gray">
                            {ACCOUNT_SETTINGS.changeEmail}
                        </Typography>
                        <hr className="mb-4 mt-2"/>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="md:flex-1">
                                {emailInputComponent(formChangeEmail.email, handleChangeEmail, LOGIN, ACCOUNT_SETTINGS.newEmail, emailChanged)}
                            </div>
                            <div className="md:flex-1">
                                {passwordInputComponent(formChangeEmail.password, formChangeEmail.viewPassword, handleChangeEmail, LOGIN, emailChanged)}
                            </div>
                        </div>
                        {emailChanged && <>
                            <hr className="my-4"/>
                            <Typography variant="paragraph" color="blue-gray" className="mb-2">
                                {(ACCOUNT_SETTINGS.labelChangeEmail).replace("%s", formChangeEmail.email)}
                            </Typography>
                            <div className="grid grid-cols-12 grid-rows-1">
                                <div className="col-span-5 col-start-1">
                                    <InputComponent
                                        color={"blue-gray"}
                                        label={ACCOUNT_SETTINGS.verificationCode}
                                        id={"verificationCode"}
                                        type={"text"}
                                        value={formChangeEmail.verificationCode}
                                        onChange={handleChangeEmail}
                                    />
                                </div>
                            </div>
                        </>}
                        <div className="pt-4">
                            {emailChanged ?
                                buttonComponent("confirmChangeEmail", ACCOUNT_SETTINGS.changeEmail, onClickConfirmChangeEmail, confirmChangeEmailDisabled(), false)
                                : buttonComponent("changeEmail", ACCOUNT_SETTINGS.next, onClickChangeEmail, changeEmailDisabled(), false)}
                        </div>
                    </div>

                    <div className="pt-10">
                        <Typography variant="h5" color="red">
                            {ACCOUNT_SETTINGS.dangerZone}
                        </Typography>
                        <hr className="mb-2 mt-2"/>
                        {ACCOUNT_SETTINGS.careful}
                        <div className="pt-4">
                            {dangerButton("deleteAllCredentials", () => handleOpenDialog(TypeDialog.DELETE_ALL_CREDENTIALS), ACCOUNT_SETTINGS.deleteAllCredentials)}
                            {dangerButton("deleteAccount", () => handleOpenDialog(TypeDialog.DELETE_ACCOUNT), ACCOUNT_SETTINGS.deleteAccount)}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>);
}

export default MyAccount;
