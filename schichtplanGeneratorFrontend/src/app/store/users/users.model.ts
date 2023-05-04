
export interface UserState {
    user: User,
    status: UserStatus,
}

export interface User {
    profileUser: ProfileUser,
    token: string
}
export interface SignUpUser {
    userName: string,
    email: string,
    password: string,
    repeatPassword: string,
}

export interface SignInUser {
    email: string,
    password: string,
}
export interface ProfileUser {
    email: string,
    userName: string,
    _id: number,
    config?: any,
    groups?: any[],
}

export interface ErrorAlert {
    title?: string,
    message?: string,
    error?: any,
    showAlert?: boolean
}


export interface SuccessAlert {
    title?: string,
    message?: string,
    showAlert?: boolean
}

export interface UserStatus {
    isAuthenticated: boolean,
    isLoggedIn: boolean,
    isLoading: boolean;
    loadingMessage?: string;
}
