import React, {useContext, useRef, useState} from "react";
import {Avatar, List, ListItem, ListItemPrefix, Typography,} from "@material-tailwind/react";
import {ExclamationTriangleIcon, PowerIcon, UserCircleIcon,} from "@heroicons/react/24/solid";
import {useNavigate} from "react-router-dom";
import {fileToBase64, getInfoFromLogIn, signOut} from "../../utils/Utils";
import {CameraIcon, Cog6ToothIcon, ShieldCheckIcon} from "@heroicons/react/20/solid";
import {mostraSpinner, nascondiSpinner} from "../../hooks/useLoaderHook/UseLoaderHook";
import {AUTH_STATE, LOG_IN} from "../../utils/SessionStorageConst";
import {ALERT_COLOR, AUTH_STATUS} from "../../enums/enum";
import {AppContext} from "../../contexts/AppContextProvider";
import {changeInformation} from "../../services/AuthenticationService";
import MyAccount from "./MyAccount/MyAccount";
import Security from "./Security/Security";
import Preferences from "./Preferences/Preferences";
import { useInterceptor } from "../../contexts/InterceptorContextProvider";
import { AUTHENTICATION_SERVICE_URL } from "../../config/Config";

enum Items {
    MY_ACCOUNT,
    SECURITY,
    PREFERENCES
}

const AccountSettings = () => {
    const { setBaseURL } = useInterceptor();
    const {mostraAlert, appText} = useContext(AppContext);
    const {ACCOUNT_SETTINGS, ALERTS, NAVBAR} = appText;

    const navigate = useNavigate();
    const maxSizePropic = 2516582;

    const listItems = [{
        label: ACCOUNT_SETTINGS.myAccount,
        item: Items.MY_ACCOUNT,
        icon: UserCircleIcon
    }, {
        label: ACCOUNT_SETTINGS.security,
        item: Items.SECURITY,
        icon: ShieldCheckIcon
    }, {
        label: ACCOUNT_SETTINGS.preferences,
        item: Items.PREFERENCES,
        icon: Cog6ToothIcon
    }];

    const [itemSelected, setItemSelected] = useState<Items>(Items.MY_ACCOUNT);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current!.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        mostraSpinner();
        setTimeout(() => {
            const file = e.target.files ? e.target.files[0] : null;
            if (file != null) {
                if (file.size < maxSizePropic) {
                    setBaseURL(AUTHENTICATION_SERVICE_URL as string);
                    const loginResponse = JSON.parse(sessionStorage.getItem(LOG_IN) ?? '');
                    fileToBase64(file).then(base64String => {
                        loginResponse.propic = base64String?.toString();
                        changeInformation({
                            language: loginResponse.language,
                            hint: loginResponse.hint,
                            propic: loginResponse.propic
                        }).then(() => {
                            sessionStorage.setItem(LOG_IN, JSON.stringify(loginResponse));
                            nascondiSpinner();
                        }).catch((error) => {
                            sessionStorage.setItem(AUTH_STATE, AUTH_STATUS.ERROR.toString());
                            console.log("Error: ", error);
                            nascondiSpinner();
                        });
                    });
                } else {
                    mostraAlert(ALERT_COLOR.ERROR, <ExclamationTriangleIcon className="mt-px h-6 w-6"/>,
                        ALERTS.errorTitle, ALERTS.maxSizeAvatar);
                    nascondiSpinner();
                }
            } else {
                nascondiSpinner();
            }
        }, 10);
    };

    function getBody() {
        switch (itemSelected) {
            case Items.SECURITY:
                return <Security/>
            case Items.PREFERENCES:
                return <Preferences/>
            case Items.MY_ACCOUNT:
            default:
                return <MyAccount/>
        }
    }

    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="md:basis-1/6">
                <div className="inline-block h-auto shadow-lg w-full bg-white rounded-md">
                    <div className="my-2 flex items-center justify-center">
                        <Typography variant="h5" color="current">
                            <div className="relative group">
                                <input type="file" ref={fileInputRef} style={{display: 'none'}}
                                       accept="image/*" onChange={handleFileInputChange}/>
                                <Avatar
                                    variant="circular"
                                    size="xxl"
                                    className="border border-white p-0.5 cursor-pointer transition-all hover:filter hover:brightness-50"
                                    src={getInfoFromLogIn("propic")}
                                    onClick={handleAvatarClick}
                                />
                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 p-1 rounded-full">
                                    <CameraIcon className="text-white h-6 w-6"/>
                                </div>
                            </div>
                        </Typography>
                    </div>
                    <List className="flex min-w-[180px]">
                        {listItems.map(({label, item, icon}, key) => {
                            return (
                                <ListItem className="text-primary" key={key} onClick={() => setItemSelected(item)}
                                          selected={itemSelected === key}>
                                    <ListItemPrefix>
                                        {React.createElement(icon, {className: "h-5 w-5"})}
                                    </ListItemPrefix>
                                    {label}
                                </ListItem>);
                        })}
                        <hr className="my-2 border-primary"/>
                        <ListItem style={{color: "red"}} onClick={() => signOut(navigate)}
                                  className="whitespace-nowrap">
                            <ListItemPrefix>
                                <PowerIcon className="h-5 w-5" color="red"/>
                            </ListItemPrefix>
                            {NAVBAR.signOut}
                        </ListItem>
                    </List>
                </div>
            </div>

            <div className="md:basis-5/6">
                {getBody()}
            </div>
        </div>
    );

}

export default AccountSettings;
