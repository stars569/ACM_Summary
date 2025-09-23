export type User = {
    username: string
}

export type AuthInfo = {
    user: User | null,
    token: string | null,
    isAuthorized: boolean,
    loginFunction: (username:string, newtoken:string) => void,
    logoutFunction: () => void
}