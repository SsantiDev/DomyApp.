export interface Category {
    id: number;
    name: string;
    description: string;
    icon_name: string;
    base_price: string;
    is_active: boolean;
}

export type ServiceStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
}

export interface ServiceRequest {
    id?: number;
    client?: number;
    worker?: number;
    category: number;
    category_name?: string;
    client_email?: string;
    status?: ServiceStatus;
    scheduled_at: string;
    address: string;
    latitude?: number;
    longitude?: number;
    details: string;
    total_price?: string;
    created_at?: string;
    completed_at?: string;
    review?: Review;
}

export interface CreateServiceRequestDTO {
    category: number;
    scheduled_at: string;
    address: string;
    latitude?: number;
    longitude?: number;
    details: string;
}
