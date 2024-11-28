import React, {useContext, useState} from "react";
import {Card, CardBody, Typography} from "@material-tailwind/react";
import {AppContext} from "../../../contexts/AppContextProvider";
import "./Preferences.scss";
import {getInfoFromLogIn} from "../../../utils/Utils";
import {mostraSpinner, nascondiSpinner} from "../../../hooks/useLoaderHook/UseLoaderHook";
import {changeInformation} from "../../../services/AuthenticationService";
import {AUTH_STATE, LOG_IN} from "../../../utils/SessionStorageConst";
import {AUTH_STATUS, LANGUAGES} from "../../../enums/enum";
import SelectComponent from "../../../components/SelectComponent/SelectComponent";
import {buttonComponent} from "../../../utils/FormUtils";
import {AUTHENTICATION_SERVICE_URL} from "../../../config/Config";
import {useInterceptor} from "../../../contexts/InterceptorContextProvider";

const Preferences = () => {

    const [language, setLanguage] = useState<any>(getInfoFromLogIn("language"));
    const {setBaseURL} = useInterceptor();
    const {appText, setLangForText} = useContext(AppContext);
    const {ACCOUNT_SETTINGS, LANGUAGE} = appText;

    const languageOptions = [
        {
            value: LANGUAGES.IT,
            label: LANGUAGE.IT
        },
        {
            value: LANGUAGES.EN,
            label: LANGUAGE.EN
        }
    ];

    function changeLanguageDisabled() {
        return language == null || language === getInfoFromLogIn("language");
    }

    const onClickChangeLanguage = () => {
        mostraSpinner();
        setTimeout(() => {
            const loginResponse = JSON.parse(sessionStorage.getItem(LOG_IN) ?? '');
            loginResponse.language = language;
            setBaseURL(AUTHENTICATION_SERVICE_URL as string);
            changeInformation({
                language: language,
                hint: getInfoFromLogIn('hint'),
                propic: getInfoFromLogIn('propic')
            }).then(() => {
                sessionStorage.setItem(LOG_IN, JSON.stringify(loginResponse));
                setLangForText(loginResponse.language);
                nascondiSpinner();
            }).catch((error) => {
                sessionStorage.setItem(AUTH_STATE, AUTH_STATUS.ERROR.toString());
                console.log("Error: ", error);
            });
        }, 10);
    };

    return (
        <Card>
            <CardBody>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        {ACCOUNT_SETTINGS.language}
                    </Typography>
                    <hr className="mb-4 mt-2"/>
                    <div className="grid grid-cols-12 grid-rows-1">
                        <div className="col-span-5 col-start-1">
                            <SelectComponent
                                id="selectLanguage"
                                label={ACCOUNT_SETTINGS.selectlanguage}
                                value={language}
                                onChange={setLanguage}
                                options={languageOptions}/>
                        </div>
                    </div>
                    <div className="pt-4">
                        {buttonComponent("changeLanguage", ACCOUNT_SETTINGS.confirm, onClickChangeLanguage, changeLanguageDisabled(), false)}
                    </div>
                </div>
            </CardBody>
        </Card>);
}

export default Preferences;
