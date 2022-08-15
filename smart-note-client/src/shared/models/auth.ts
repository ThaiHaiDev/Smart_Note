export interface SignUpData {
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
}

interface UserInfo {
    id: number,
    username: string,
    email: string,
    updated_at: string,
    created_at: string,
}

export interface SignUpInfoResponse {
    data: {
        user: UserInfo,
        token: string,
    }
    message: string,
}

export interface SignUpErrorResponse {
    message: string,
    errors: {
        username?: string,
        email?: string,
        password?: string,
    }
}

export interface SignInErrorResponse {
    message: string,
    errors: {
        email?: string,
        password?: string,
    }
}