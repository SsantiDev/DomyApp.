export interface WorkerReview {
    id: number;
    rating: number;
    comment: string;
    client_name: string;
    created_at: string;
}

export interface Worker {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    city: string;
    bio: string;
    is_available: boolean;
    average_rating: number;
    profile_picture?: string | null;
    reviews?: WorkerReview[];
}

export interface WorkerPaginationResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Worker[];
}

export interface UserAddress {
    id: number;
    alias: string;
    address_line: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
}

export interface CreateUserAddressDTO {
    alias: string;
    address_line: string;
    latitude?: number | null;
    longitude?: number | null;
    is_default?: boolean;
}

export interface FavoriteWorker {
    id: number;
    worker_id: number;
    name: string;
    avatar_url: string | null;
    avg_rating: number;
    created_at: string;
}
