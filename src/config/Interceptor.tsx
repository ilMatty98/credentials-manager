// Interceptor.tsx
import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import React, {useContext, useEffect} from 'react';
import {mostraSpinner, nascondiSpinner} from '../hooks/useLoaderHook/UseLoaderHook';
import {AppContext} from '../contexts/AppContextProvider';
import {ALERT_COLOR} from '../enums/enum';
import {CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import {useInterceptor} from '../contexts/InterceptorContextProvider';

export let instanceAxios = axios.create(); // Istanza Axios condivisa

type InterceptorProps = {
    children: React.ReactNode;
};

export const Interceptor: React.FC<InterceptorProps> = ({children}) => {
    const {mostraAlert, appText} = useContext(AppContext);
    const {ALERTS} = appText;
    const {baseURL} = useInterceptor();

    useEffect(() => {
        // Aggiorna l'istanza Axios ogni volta che cambia il baseURL
        instanceAxios = axios.create({baseURL});

        const requestInterceptor = instanceAxios.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                mostraSpinner();
                return config;
            },
            (error: AxiosError) => {
                nascondiSpinner();
                mostraAlert(ALERT_COLOR.ERROR, <ExclamationTriangleIcon
                    className="mt-px h-6 w-6"/>, ALERTS.errorTitle, ALERTS.errorMessage);
                return Promise.reject(error);
            },
        );

        const responseInterceptor = instanceAxios.interceptors.response.use(
            (response: AxiosResponse) => {
                nascondiSpinner();
                mostraAlert(ALERT_COLOR.SUCCESS, <CheckCircleIcon
                    className="mt-px h-6 w-6"/>, ALERTS.successTitle, ALERTS.successMessage);
                return response;
            },
            (error: AxiosError) => {
                nascondiSpinner();
                if (error.response) {
                    const errorCode = (error.response.data as any).errorMessage;
                    const message = ALERTS[errorCode] ?? ALERTS.errorMessage;
                    mostraAlert(ALERT_COLOR.ERROR, <ExclamationTriangleIcon
                        className="mt-px h-6 w-6"/>, ALERTS.errorTitle, message);
                    console.error(`Errore Server ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    mostraAlert(ALERT_COLOR.ERROR, <ExclamationTriangleIcon
                        className="mt-px h-6 w-6"/>, ALERTS.errorTitle, ALERTS.errorMessage);
                    console.error(`Errore di rete: ${error.message}`);
                } else {
                    mostraAlert(ALERT_COLOR.ERROR, <ExclamationTriangleIcon
                        className="mt-px h-6 w-6"/>, ALERTS.errorTitle, ALERTS.errorMessage);
                    console.error(`Errore: ${error.message}`);
                }
                return Promise.reject(error);
            },
        );

        return () => {
            instanceAxios.interceptors.request.eject(requestInterceptor);
            instanceAxios.interceptors.response.eject(responseInterceptor);
        };
    }, [baseURL]);

    return <>{children}</>;
};
