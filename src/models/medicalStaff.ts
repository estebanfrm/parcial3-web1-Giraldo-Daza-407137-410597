export interface MedicalStaff {
    id: number;
    firstName: string;
    lastName: string;
    role: string; // Médico, Enfermero, Auxiliar
    specialty?: string;
    licenseId?: string;
    createdAt: string;
}
