export interface Worker {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    city: string;
    bio: string;
    is_available: boolean;
    average_rating: number;
}

export interface WorkerPaginationResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Worker[];
}
