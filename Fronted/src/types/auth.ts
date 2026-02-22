export interface LoginResponse {
    access: string;
    refresh: string;
    LoginRequest: {
        username: string;
        password: string;
    }
}
