export type User = {
    username: string
}

export type loginUser = {
    username: string,
    password: string
}

export type registerUser = {
    username: string,
    password: string,
    passwordConfirm: string
}

export type AuthInfo = {
    user: User | null,
    token: string | null,
    isAuthorized: boolean,
    loginFunction: (username:string, newtoken:string) => void,
    logoutFunction: () => void
}

export type errorResponse = {
    message: string
}

export type SideBarProp = {
    open: boolean,
    setOpen: (open : boolean) => void
}

export type DateStr = {
    $d: string
}

export type questionInfo = {
    type: string,
    difficulty: number,
    title: string,
    solveTime: DateStr
}

export type questionInfoSubmit = {
    type: string,
    difficulty: number,
    title: string,
    solveTime: string
}