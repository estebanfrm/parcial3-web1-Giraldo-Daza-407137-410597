export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber: string;
    birthDate?: string; // Formato ISO: YYYY-MM-DD
    phone?: string;
    address?: string;
    createdAt: string; // Fecha de creación en formato ISO
}
