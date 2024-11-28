import React from "react";
import {routesMap} from "./ReactRouter";
import {Navigate} from "react-router-dom";
import {isAuthenticated} from "../utils/AuthUtils";

type TProtectedRouteProps = {
    requireAuthorized?: boolean;
    children: JSX.Element;
};

const ProtectedRoute = ({requireAuthorized = false, children}: TProtectedRouteProps) => {
    if (!requireAuthorized) return children;
    return isAuthenticated() ? children : <Navigate to={routesMap.LOGIN} replace={true}/>;
};

export default ProtectedRoute