import {LANGUAGES} from "../../enums/enum"

import * as itTexts from "./i18n/it";
import * as enTexts from "./i18n/en";
import {useState} from "react";
import {LOG_IN} from "../../utils/SessionStorageConst";


const appText: {
    [key: string]: any
} = {
    [LANGUAGES.IT]: itTexts,
    [LANGUAGES.EN]: enTexts
}

const userLang = JSON.parse(sessionStorage.getItem(LOG_IN) ?? '{"language": "' + navigator.language.substring(0, 2).toUpperCase() + '"}')?.language;

const useLanguageHook = (langForText: string = appText[userLang] ? userLang : LANGUAGES.EN) => {
    const [state, setState] = useState({
        langForText: langForText,
        appText: appText[langForText]
    });

    const setLangForText = (langForText: string): void => {
        setState((oldState) => {
            const newState = {...oldState};
            newState.langForText = langForText;
            newState.appText = appText[langForText];
            return newState;
        });
    };

    return [
        state.appText,
        state.langForText,
        setLangForText
    ] as const;
};

export default useLanguageHook;