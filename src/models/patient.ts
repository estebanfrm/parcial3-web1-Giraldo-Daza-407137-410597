export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber: string;
    birthDate?: string; // ISO string
    phone?: string;
    address?: string;
    createdAt: string; // ISO date-time
}
