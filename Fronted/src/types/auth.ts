export interface LoginResponse {
    access: string;
    refresh: string;
    LoginRequest: {
        username: string;
        password: string;
    }
}

export interface User {
    id: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}
