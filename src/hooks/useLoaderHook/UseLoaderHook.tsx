import {useEffect, useState} from "react";
import {Subject} from "rxjs";

export const spinnerSubject = new Subject();

export const mostraSpinner = (): void => {
    spinnerSubject.next(true);
}

export const nascondiSpinner = (): void => {
    spinnerSubject.next(false);
}

const useLoaderHook = () => {
    const [contatoreSpinner, setContatoreSpinner] = useState(0);

    useEffect(() => {
        spinnerSubject.subscribe(isCaricamentoInCorso => {
            const contatore = isCaricamentoInCorso ? contatoreSpinner === 0 ? contatoreSpinner + 1 : contatoreSpinner : contatoreSpinner === 0 ? contatoreSpinner : contatoreSpinner - 1;
            setContatoreSpinner(contatore);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        mostraSpinner,
        nascondiSpinner,
        contatoreSpinner
    };

};

export default useLoaderHook;