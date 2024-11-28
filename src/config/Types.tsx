export type TBodyLogin = {
    email: string,
    password: string
}

export type TBodySignup = {
    email: string,
    password: string,
    hint: string,
    language: string,
    propic: string
}

export type TCredentials = {
    masterPasswordHash: string,
    protectedSymmetricKey: string,
    initializationVector: string,
}

export type TSignUpRequest = {
    email: string,
    masterPasswordHash: string,
    protectedSymmetricKey: string,
    initializationVector: string,
    hint: string,
    propic: string,
    language: string
}

export type TLoginRequest = {
    email: string,
    masterPasswordHash: string,
    ipAddress: string,
    deviceType: string,
    localDateTime: string
}

export type TLoginResponse = {
    token: string,
    tokenPublicKey: string,
    protectedSymmetricKey: string,
    initializationVector: string,
    language: string,
    propic: string,
    timestampCreation: string,
    timestampLastAccess: string,
    timestampPassword: string
}

export type TChangeInformationRequest = {
    language: string,
    hint: string,
    propic: string
}

export type TChangeEmailRequest = {
    email: string,
    masterPasswordHash: string
}

export type TConfirmChangeEmailRequest = {
    email: string,
    masterPasswordHash: string,
    verificationCode: string,
    newMasterPasswordHash: string,
    newProtectedSymmetricKey: string,
    newInitializationVector: string
}

export type TDeleteRequest = {
    masterPasswordHash: string
}

export type TChangePassword = {
    currentMasterPasswordHash: string,
    newMasterPasswordHash: string,
    newProtectedSymmetricKey: string,
    newInitializationVector: string
}
