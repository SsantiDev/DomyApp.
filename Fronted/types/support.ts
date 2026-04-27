export type IncidentType = 'NO_SHOW' | 'DELAY' | 'QUALITY' | 'SAFETY' | 'OTHER';
export type IncidentStatus = 'OPEN' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED';

export interface Incident {
    id: number;
    service_request: number;
    reporter: number;
    reporter_name: string;
    incident_type: IncidentType;
    description: string;
    status: IncidentStatus;
    needs_refund: boolean;
    escalation_note: string;
    created_at: string;
    updated_at: string;
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
    NO_SHOW: 'Inasistencia',
    DELAY: 'Retraso',
    QUALITY: 'Calidad del servicio',
    SAFETY: 'Seguridad',
    OTHER: 'Otro'
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
    OPEN: 'Abierto',
    IN_REVIEW: 'En revisión',
    ESCALATED: 'Escalado',
    RESOLVED: 'Resuelto',
    DISMISSED: 'Desestimado'
};
