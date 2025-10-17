export type User = {
    username: string
    userId: number,
    difficulty: number
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
    loginFunction: (username:string, userId:number, difficulty:number, newtoken:string) => void,
    logoutFunction: () => void
}

export type errorResponse = {
    message: string
}

export type SideBarProp = {
    open: boolean,
    setOpen: (open : boolean) => void
}

export type questionInfo = {
    type: string,
    difficulty: number,
    solveTime: Date,
    resource: string
}

export type questionInfoSubmit = {
    type: string,
    difficulty: number,
    solveTime: Date,
    userId: number,
    resource: string
}

export type questionDataFeedback = {
    id: number,
    type: string,
    difficulty: number,
    solvetime: string,
    uploadtime: string,
    resource: string,
    lastdone: Date,
    memoryround: number,
    comment: string
}

export type linearChartDataType = {
    name: string,
    pv: number,
    amt: number
}

export type linearChartData = {
    ave: linearChartDataType[],
    count: linearChartDataType[]
}

export type changePasswordData = {
    oldPassword: string,
    newPassword: string
}

export type changeDifficulty = {
    difficulty: number
}

export type commentType = {
    comment: string
}