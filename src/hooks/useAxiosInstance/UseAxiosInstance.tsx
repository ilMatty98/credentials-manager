import axios from 'axios';
import {useInterceptor} from '../../contexts/InterceptorContextProvider';
import {instanceAxios} from '../../config/Interceptor';

// Hook per restituire un'istanza Axios, con un baseURL temporaneo opzionale
export const useAxiosInstance = () => {
    const {baseURL} = useInterceptor();

    // Restituisce un'istanza temporanea di Axios con il baseURL specificato
    const getInstanceWithBaseURL = (tempBaseURL?: string) => {
        if (tempBaseURL) {
            // Crea un'istanza temporanea con un nuovo baseURL
            return axios.create({
                ...instanceAxios.defaults,
                baseURL: tempBaseURL,
            });
        }
        // Usa l'istanza configurata di default
        instanceAxios.defaults.baseURL = baseURL;
        return instanceAxios;
    };

    return {getInstanceWithBaseURL};
};
