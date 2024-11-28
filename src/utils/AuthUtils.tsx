import {AUTH_STATE} from "./SessionStorageConst";
import {AUTH_STATUS} from "../enums/enum";

export const isAuthenticated = () => sessionStorage.getItem(AUTH_STATE) === String(AUTH_STATUS.SUCCESS);