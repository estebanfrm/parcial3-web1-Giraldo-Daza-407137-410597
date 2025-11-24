export interface PrescriptionItem {
    id: number;
    prescriptionId: number;
    medicationId: number;
    schedule: string; // ej: Cada 8 horas
    quantity: string; // ej: 1 tableta
    durationDays: number;
}

export interface Prescription {
    id: number;
    patientId: number;
    medicalStaffId: number;
    issuedAt: string;
    notes?: string;
}

export interface PrescriptionWithItems extends Prescription {
    items: PrescriptionItem[];
}
