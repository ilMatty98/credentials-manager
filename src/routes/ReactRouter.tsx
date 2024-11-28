import React from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ContactUs from "../pages/ContactUs/ContactUs";
import Contribute from "../pages/Contribute/Contribute";
import AboutUs from "../pages/AboutUs/AboutUs";
import {isAuthenticated} from "../utils/AuthUtils";
import AccountSettings from "../pages/AccountSettings/AccountSettings";

enum routesMap {
    ROOT = "/",
    HOME = "/home",
    LOGIN = "/login",
    REGISTER = "/register",
    ABOUT_US = "/about-us",
    CONTRIBUTE = "/contribute",
    CONTACT_US = "/contact-us",
    ACCOUNT_SETTINGS = "/account-settings",
}

const routerInstance = createBrowserRouter([
    {
        path: routesMap.LOGIN,
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{
            path: routesMap.LOGIN,
            element: isAuthenticated() ? <Navigate to={routesMap.HOME} replace={true}/> : <Login/>
        }]
    },
    {
        path: routesMap.REGISTER,
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{
            path: routesMap.REGISTER,
            element: isAuthenticated() ? <Navigate to={routesMap.HOME} replace={true}/> : <Register/>
        }]
    },
    {
        path: routesMap.ROOT,
        element: <ProtectedRoute requireAuthorized={true}><MainLayout/></ProtectedRoute>,
        children: [{path: routesMap.HOME, element: <Home/>}]
    },
    {
        path: routesMap.ABOUT_US,
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{path: routesMap.ABOUT_US, element: <AboutUs/>}]
    },
    {
        path: routesMap.CONTRIBUTE,
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{path: routesMap.CONTRIBUTE, element: <Contribute/>}]
    },
    {
        path: routesMap.CONTACT_US,
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{path: routesMap.CONTACT_US, element: <ContactUs/>}]
    },
    {
        path: routesMap.ACCOUNT_SETTINGS,
        element: <ProtectedRoute requireAuthorized={true}><MainLayout/></ProtectedRoute>,
        children: [{path: routesMap.ACCOUNT_SETTINGS, element: <AccountSettings/>}]
    },
    {
        path: "*",
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children: [{
            path: "*",
            element: isAuthenticated() ? <PageNotFound/> : <Navigate to={routesMap.LOGIN} replace={true}/>
        }]
    }
]);

export {
    routesMap,
    routerInstance
}