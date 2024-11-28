import {createContext, useState} from "react";
import {AUTH_STATUS, ROLES} from "../enums/enum";
import {AUTH_STATE} from "../utils/SessionStorageConst";


type TAuthContextProviderProps = {
    children: React.ReactNode
}

type TState = {
    authStatus: number;
}

type TUser = {
    username: string,
    roles: Array<string>,
    token: string
}

// Create initial empty Context
const AuthContext = createContext<any | null>(null);

const AuthContextProvider = ({children}: TAuthContextProviderProps) => {

    const [authState, setAuthState] = useState<TState>({
        authStatus: AUTH_STATUS.INIT
    });

    const [userState, setUserState] = useState<TUser>({
        username: "",
        roles: [""],
        token: ""
    });

    const setAuthStateStatus = (authStatus: number) => {
        setAuthState((oldState) => {
            const newState = {...oldState};
            newState.authStatus = authStatus;
            return newState;
        });
    };

    const _initUserState = (data: any) => {
        const user: TUser = (() => {
            const user: TUser = {
                username: data.user,
                roles: data.roles,
                token: data.token
            };
            return user;
        })();

        return user;
    };

    const login = () => {
        //TODO - Call login
        let response = {
            user: "Matteo",
            roles: [ROLES.ADMIN],
            token: "PROVA"
        }

        const user: TUser = _initUserState(response);

        setUserState(user);
        setAuthStateStatus(AUTH_STATUS.SUCCESS);

        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem(AUTH_STATE, JSON.stringify(AUTH_STATUS.SUCCESS));

    };

    return (
        <AuthContext.Provider value={{
            authState: authState,
            user: userState,
            login: login
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;
export {AuthContext};