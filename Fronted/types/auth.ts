export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type UserRole = 'CLIENT' | 'WORKER' | 'ADMIN';

export interface ClientProfile {
    address: string;
    phone_number: string;
    city: string;
}

export interface WorkerProfile {
    identity_document: string;
    bio: string;
    profile_picture: string | null;
    is_verified: boolean;
    is_available: boolean;
    average_rating: number;
}

export interface UserDetail {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    profile: ClientProfile | WorkerProfile | null;
}

// Legacy alias
export type User = UserDetail;
