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

import { Incident } from './support';

export interface ServiceRequest {
    id?: number;
    client?: number;
    worker?: number;
    category: number;
    category_name?: string;
    client_email?: string;
    client_name?: string;
    worker_email?: string;
    worker_name?: string;
    status?: ServiceStatus;
    scheduled_at: string;
    address: string;
    latitude?: number;
    longitude?: number;
    details: string;
    total_price?: string;
    created_at?: string;
    completed_at?: string;
    is_billed?: boolean;
    review?: Review;
    incidents?: Incident[];
    unread_messages_count?: number;
    unread_coordination_count?: number;
    unread_support_count?: number;
}

export interface CreateServiceRequestDTO {
    category: number;
    scheduled_at: string;
    address: string;
    latitude?: number;
    longitude?: number;
    details: string;
    worker?: number; // Optional direct worker assignment
}

export type NotificationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface ServiceRequestNotification {
    id: number;
    service_request: number;
    service_request_details: ServiceRequest;
    worker: number;
    status: NotificationStatus;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}

