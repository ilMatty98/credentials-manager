import {instanceAxios} from "../config/Interceptor";
import {ENCRYPTION_PBKDF2_INTERATIONS, ENCRYPTION_PBKDF2_KEYLEN} from "../config/Config";
import {
    TBodyLogin,
    TBodySignup,
    TChangeEmailRequest,
    TChangeInformationRequest,
    TChangePassword,
    TConfirmChangeEmailRequest,
    TCredentials,
    TDeleteRequest,
    TLoginRequest,
    TLoginResponse,
    TSignUpRequest
} from "../config/Types";
import {browserDetect} from "../utils/Utils";
import * as CryptoJS from 'crypto-js';
import {EMAIL, MASTER_PASSWORD_HASH, STRETCHED_MASTER_KEY, TOKEN, USER_IP} from "../utils/SessionStorageConst";

const BASEPATH = "/authentication/";

function encryptPasswordPBKDF2(password: string, salt: string, iterations: number) {
    return CryptoJS.PBKDF2(password, salt, {
        keySize: Number(ENCRYPTION_PBKDF2_KEYLEN),
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
    })?.toString();
}

function getIPAddress(): Promise<string> {
    return new Promise((resolve) => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip: string = data.ip;
                resolve(ip);
            })
            .catch(error => {
                console.log(error);
                resolve("127.0.0.1");
            });
    });
}

function generateStretchedMasterKey(masterKey: string) {
    return CryptoJS.SHA512(masterKey).toString(CryptoJS.enc.Hex);
}

async function encryptSymmetricKey(encryptionKey: CryptoJS.lib.WordArray, macKey: CryptoJS.lib.WordArray, stretchedMasterKey: string, iv: CryptoJS.lib.WordArray) {
    return new Promise<CryptoJS.lib.CipherParams>((resolve) => {
        const payload = encryptionKey.concat(macKey);
        const protectedSymmetricKey = CryptoJS.AES.encrypt(payload.toString(), stretchedMasterKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        resolve(protectedSymmetricKey);
    });
}

async function getCredentials(password: string, email: string): Promise<TCredentials> {
    const masterKey = encryptPasswordPBKDF2(password, email, Number(ENCRYPTION_PBKDF2_INTERATIONS));

    const [masterPasswordHash, stretchedMasterKey] = await Promise.all([
        encryptPasswordPBKDF2(masterKey, password, 1),
        generateStretchedMasterKey(masterKey),
    ]);

    const [encryptionKey, macKey, iv] = await Promise.all([
        CryptoJS.lib.WordArray.random(32), // Generazione chiave random per crittografia 256 bit
        CryptoJS.lib.WordArray.random(32), // Generazione chiave random per MAC 256 bit
        CryptoJS.lib.WordArray.random(16), // Generazione IV random 128 bit
    ]);

    const protectedSymmetricKeyPromise = encryptSymmetricKey(encryptionKey, macKey, stretchedMasterKey, iv);
    const protectedSymmetricKey = await protectedSymmetricKeyPromise;

    return {
        masterPasswordHash: masterPasswordHash,
        protectedSymmetricKey: protectedSymmetricKey.toString(),
        initializationVector: iv.toString()
    };
}

async function signUp(body: TBodySignup): Promise<void> {
    return getCredentials(body.password, body.email).then(credentials => {
        const bodyCall: TSignUpRequest = {
            email: body.email,
            masterPasswordHash: credentials.masterPasswordHash,
            protectedSymmetricKey: credentials.protectedSymmetricKey.toString(),
            initializationVector: credentials.initializationVector.toString(),
            hint: body.hint,
            language: body.language,
            propic: body.propic
        };
        return instanceAxios.post(BASEPATH + "signUp", bodyCall);
    });
}

function getHeaders() {
    return {
        headers: {Authorization: `Bearer ${sessionStorage.getItem(TOKEN)}`}
    };
}

async function changePassword(body: {
    currentMasterPasswordHash: string,
    newMasterPasswordHash: string
}): Promise<void> {
    const email = sessionStorage.getItem(EMAIL) ?? "";
    return getCredentials(body.newMasterPasswordHash, email).then(credentials => {
        const masterKey = encryptPasswordPBKDF2(body.currentMasterPasswordHash, email, Number(ENCRYPTION_PBKDF2_INTERATIONS));
        const bodyCall: TChangePassword = {
            currentMasterPasswordHash: encryptPasswordPBKDF2(masterKey, body.currentMasterPasswordHash, 1),
            newMasterPasswordHash: credentials.masterPasswordHash,
            newProtectedSymmetricKey: credentials.protectedSymmetricKey.toString(),
            newInitializationVector: credentials.initializationVector.toString()
        };
        return instanceAxios.put(BASEPATH + "changePassword", bodyCall, getHeaders());
    });
}

async function logIn(body: TBodyLogin): Promise<TLoginResponse> {
    const masterKey = encryptPasswordPBKDF2(body.password, body.email, Number(ENCRYPTION_PBKDF2_INTERATIONS));
    const loginRequest: TLoginRequest = {
        email: body.email,
        masterPasswordHash: encryptPasswordPBKDF2(masterKey, body.password, 1),
        ipAddress: sessionStorage.getItem(USER_IP) ?? "1.1.1.1",
        deviceType: browserDetect(),
        localDateTime: new Date().toLocaleString(navigator.language)
    };
    const responsePromise = instanceAxios.post(BASEPATH + "logIn", loginRequest);

    const [response, stretchedMasterKey] = await Promise.all([responsePromise, generateStretchedMasterKey(masterKey)]);

    sessionStorage.setItem(MASTER_PASSWORD_HASH, loginRequest.masterPasswordHash);
    sessionStorage.setItem(STRETCHED_MASTER_KEY, stretchedMasterKey);
    sessionStorage.setItem(EMAIL, body.email);

    const symmetricKey = CryptoJS.AES.decrypt(response.data.protectedSymmetricKey, stretchedMasterKey, {
        iv: CryptoJS.enc.Hex.parse(response.data.initializationVector),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const symmetricKeyUtf8 = symmetricKey.toString(CryptoJS.enc.Utf8);

    return response.data;
}

async function changeInformation(body: TChangeInformationRequest): Promise<void> {
    const config = {
        headers: {Authorization: `Bearer ${sessionStorage.getItem(TOKEN)}`}
    };

    return instanceAxios.put(BASEPATH + "changeInformation", body, config);
}

async function changeEmail(body: TChangeEmailRequest): Promise<void> {
    const currentEmail = sessionStorage.getItem(EMAIL) ?? body.email;
    const masterKey = encryptPasswordPBKDF2(body.masterPasswordHash, currentEmail, Number(ENCRYPTION_PBKDF2_INTERATIONS));
    body.masterPasswordHash = encryptPasswordPBKDF2(masterKey, body.masterPasswordHash, 1);
    return instanceAxios.put(BASEPATH + "changeEmail", body, getHeaders());
}

async function deleteAccount(body: TDeleteRequest): Promise<void> {
    const currentEmail = sessionStorage.getItem(EMAIL) as string;
    const masterKey = encryptPasswordPBKDF2(body.masterPasswordHash, currentEmail, Number(ENCRYPTION_PBKDF2_INTERATIONS));
    body.masterPasswordHash = encryptPasswordPBKDF2(masterKey, body.masterPasswordHash, 1);
    return instanceAxios.delete(BASEPATH + "deleteAccount", {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem(TOKEN)}`
        },
        data: {
            masterPasswordHash: body.masterPasswordHash
        }
    });
}

async function confirmChangeEmail(input: any): Promise<void> {
    return getCredentials(input.newMasterPasswordHash, input.email).then(credentials => {
        const bodyCall: TConfirmChangeEmailRequest = {
            email: input.email,
            masterPasswordHash: sessionStorage.getItem(MASTER_PASSWORD_HASH) ?? '',
            verificationCode: input.verificationCode,
            newMasterPasswordHash: credentials.masterPasswordHash,
            newProtectedSymmetricKey: credentials.protectedSymmetricKey.toString(),
            newInitializationVector: credentials.initializationVector.toString(),
        };
        const masterKey = encryptPasswordPBKDF2(input.newMasterPasswordHash, input.email, Number(ENCRYPTION_PBKDF2_INTERATIONS));
        bodyCall.newMasterPasswordHash = encryptPasswordPBKDF2(masterKey, input.newMasterPasswordHash, 1);
        return instanceAxios.put(BASEPATH + "confirmChangeEmail", bodyCall, getHeaders());
    });
}

export {signUp, logIn, getIPAddress, changeInformation, changeEmail, confirmChangeEmail, deleteAccount, changePassword};
