export interface Message {
    id: number;
    service_request: number;
    sender: number;
    sender_name: string;
    sender_role: string;
    is_support_chat: boolean;
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface SendMessageDTO {
    service_request: number;
    is_support_chat: boolean;
    content: string;
}
