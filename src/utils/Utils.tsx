import {LOG_IN, USER_IP} from "./SessionStorageConst";
import {routesMap} from "../routes/ReactRouter";
import {NavigateFunction} from "react-router-dom";

function fromByteArraytoHexString(byteArray: Uint8Array) {
    return Array.from(byteArray, function (byte: any) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function isValidEmail(email: string) {
    // espressione regolare per verificare la correttezza dell'indirizzo email
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
    // Espressione regolare per verificare se la password abbia: almeno una lettera minuscola,
    // almeno una lettera maiuscola, almeno un numero, almeno un simbolo, almeno 8 caratteri e max 32
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|]).{8,32}$/;
    return passwordRegex.test(password);
}


function isEmptyString(string: string) {
    return string === "" || string === undefined || string === null;
}

function browserDetect() {

    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
    } else {
        browserName = "No browser detection";
    }

    return browserName;
}

function generatePropic(character: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext('2d');

    // Disegna il carattere nel canvas
    if (context) {
        context.fillStyle = '#202124'; // Colore dello sfondo
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff'; // Colore del testo
        context.font = '100px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(character, canvas.width / 2, canvas.height / 2);

        // Genera il base64 dell'immagine
        return canvas.toDataURL('image/jpeg');
    }
    return '';
}

function getInfoFromLogIn(value: string): string {
    return JSON.parse(sessionStorage.getItem(LOG_IN) ?? '{"' + value + '": ""}')[value];
}

function formatDateString(dateString: string): string {
    const date: Date = new Date(dateString);

    return `${('0' + date.getDate()).slice(-2)}/${
        ('0' + (date.getMonth() + 1)).slice(-2)
    }/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${
        ('0' + date.getMinutes()).slice(-2)
    }:${('0' + date.getSeconds()).slice(-2)}`;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) reject(new Error('File is null or undefined.'));

        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ?
            resolve(reader.result) : reject(new Error('Failed to convert file to base64.'));

        reader.onerror = () => reject(new Error('Failed to read file.'));

        reader.readAsDataURL(file);
    });
}

function cleanSessionForSignOut(): void {
    const ipAdress = sessionStorage.getItem(USER_IP);
    sessionStorage.clear();
    if (ipAdress) sessionStorage.setItem(USER_IP, ipAdress);
}

function signOut(navigate: NavigateFunction): void {
    cleanSessionForSignOut();
    navigate(routesMap.LOGIN);
}

export {
    fromByteArraytoHexString,
    isValidEmail,
    isValidPassword,
    isEmptyString,
    browserDetect,
    generatePropic,
    getInfoFromLogIn,
    formatDateString,
    fileToBase64,
    cleanSessionForSignOut,
    signOut
}