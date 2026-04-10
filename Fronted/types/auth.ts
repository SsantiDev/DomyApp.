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
    profile_picture: string | null;
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
    worker_info?: {
        bio: string;
        is_available: boolean;
        average_rating: number;
        categories: number[];
    };
    verification?: {
        is_verified: boolean;
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        rejection_reason?: string;
    };
}

// Legacy alias
export type User = UserDetail;
