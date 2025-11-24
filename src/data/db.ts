import { Patient } from "../models/patient";
import { MedicalStaff } from "../models/medicalStaff";
import { Medication } from "../models/medication";
import { Prescription, PrescriptionItem } from "../models/prescription";

let patientIdCounter = 1;
let staffIdCounter = 1;
let medicationIdCounter = 1;
let prescriptionIdCounter = 1;
let prescriptionItemIdCounter = 1;

export const patients: Patient[] = [];
export const staff: MedicalStaff[] = [];
export const medications: Medication[] = [];
export const prescriptions: Prescription[] = [];
export const prescriptionItems: PrescriptionItem[] = [];

// Funciones helper para crear registros con IDs autoincrementales
export function createPatient(
    data: Omit<Patient, "id" | "createdAt">
): Patient {
    const patient: Patient = {
        id: patientIdCounter++,
        createdAt: new Date().toISOString(),
        ...data,
    };
    patients.push(patient);
    return patient;
}

export function createStaff(
    data: Omit<MedicalStaff, "id" | "createdAt">
): MedicalStaff {
    const member: MedicalStaff = {
        id: staffIdCounter++,
        createdAt: new Date().toISOString(),
        ...data,
    };
    staff.push(member);
    return member;
}

export function createMedication(
    data: Omit<Medication, "id" | "createdAt">
): Medication {
    const med: Medication = {
        id: medicationIdCounter++,
        createdAt: new Date().toISOString(),
        ...data,
    };
    medications.push(med);
    return med;
}

export function createPrescription(
    data: Omit<Prescription, "id" | "issuedAt">
): Prescription {
    const p: Prescription = {
        id: prescriptionIdCounter++,
        issuedAt: new Date().toISOString(),
        ...data,
    };
    prescriptions.push(p);
    return p;
}

export function createPrescriptionItem(
    data: Omit<PrescriptionItem, "id">
): PrescriptionItem {
    const item: PrescriptionItem = {
        id: prescriptionItemIdCounter++,
        ...data,
    };
    prescriptionItems.push(item);
    return item;
}
