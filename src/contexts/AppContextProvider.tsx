import {createContext, useContext, useEffect, useState} from "react";
import {AUTH_STATUS, LANGUAGES} from "../enums/enum";
import {AuthContext} from "./AuthContextProvider";
import useLanguageHook from "../hooks/useLanguageHook/UseLanguageHook";
import useLoaderHook from "../hooks/useLoaderHook/UseLoaderHook";
import LoaderComponent from "../components/LoaderComponent/LoaderComponent";
import AlertComponent from "../components/AlertComponent/AlertComponent";
import {colors} from "@material-tailwind/react/types/generic";
import {AUTH_STATE} from "../utils/SessionStorageConst";


type TAppContextProviderProps = {
    children: React.ReactNode
}

type TAppState = {
    appStatus: number
}

type TAlertState = {
    open: boolean,
    color: colors,
    icon: React.ReactNode,
    title: string,
    message: string
}

// Create initial empty Context
const AppContext = createContext<any | null>(null);

const languagesOptions = [
    {
        label: "Italiano",
        value: LANGUAGES.IT
    },
    {
        label: "English",
        value: LANGUAGES.EN
    }
]

const AppContextProvider = ({children}: TAppContextProviderProps) => {
    const {authState} = useContext(AuthContext);
    const [appText, langForText, setLangForText] = useLanguageHook();
    const {contatoreSpinner} = useLoaderHook();

    const [stateAlert, setStateAlert] = useState<TAlertState>({
        open: false,
        color: "green",
        icon: <></>,
        title: "",
        message: ""
    });

    const handleChangeStateAlert = (prop: string, value: any) => {
        setStateAlert((oldState: any) => {
            const newState = {...oldState};
            newState[prop] = value;
            return newState;
        })
    };

    const [appState, setAppState] = useState<TAppState>({
        appStatus: AUTH_STATUS.INIT
    });

    const setAppStateStatus = (appStatus: number) => {
        setAppState((oldState) => {
            const newState = {...oldState};
            newState.appStatus = appStatus;
            return newState;
        });
    };

    const mostraAlert = (alertColor: colors, alertIcon: React.ReactNode = <></>, alertTitle: string = "", alertMessage: string = "") => {
        const stateAlert = {
            open: true,
            color: alertColor,
            icon: alertIcon,
            title: alertTitle,
            message: alertMessage
        }

        setStateAlert(stateAlert);
    };

    useEffect(() => {
        setAppStateStatus(Number(localStorage.getItem(AUTH_STATE)));

    }, []);

    return (
        <>
            {contatoreSpinner > 0 && <LoaderComponent/>}

            <div className="flex justify-center">
                <AlertComponent
                    open={stateAlert.open}
                    closeAlert={() => handleChangeStateAlert("open", false)}
                    color={stateAlert.color}
                    icon={stateAlert.icon}
                    title={stateAlert.title}
                    message={stateAlert.message}
                    zIndex={10000}
                />
            </div>

            <AppContext.Provider value={{
                appText: appText,
                appState: appState,
                langForText: langForText,
                setLangForText: setLangForText,
                mostraAlert: mostraAlert
            }}>
                {children}
            </AppContext.Provider>
        </>
    );
};

export default AppContextProvider;
export {AppContext, languagesOptions};
