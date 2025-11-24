import axios from "axios";

const apiBase = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
});


const api = {
    // ---- PACIENTES ----
    getPatients() {
        return apiBase.get("/patients");
    },
    getPatient(id: number) {
        return apiBase.get(`/patients/${id}`);
    },
    createPatient(data: any) {
        return apiBase.post("/patients", data);
    },
    updatePatient(id: number, data: any) {
        return apiBase.put(`/patients/${id}`, data);
    },
    deletePatient(id: number) {
        return apiBase.delete(`/patients/${id}`);
    },

    // ---- MEDICAMENTOS ----
    getMedications() {
        return apiBase.get("/medications");
    },
    createMedication(data: any) {
        return apiBase.post("/medications", data);
    },
    updateMedication(id: number, data: any) {
        return apiBase.put(`/medications/${id}`, data);
    },
    deleteMedication(id: number) {
        return apiBase.delete(`/medications/${id}`);
    },

    // ---- STAFF ----
    getStaff() {
        return apiBase.get("/staff");
    },
    createStaff(data: any) {
        return apiBase.post("/staff", data);
    },
    updateStaff(id: number, data: any) {
        return apiBase.put(`/staff/${id}`, data);
    },
    deleteStaff(id: number) {
        return apiBase.delete(`/staff/${id}`);
    },

    // ---- PRESCRIPCIONES ----
    getPrescriptions() {
        return apiBase.get("/prescriptions");
    },
    createPrescription(data: any) {
        return apiBase.post("/prescriptions", data);
    },


    get(url: string) {
        return apiBase.get(url);
    },
    post(url: string, data?: any) {
        return apiBase.post(url, data);
    },
    put(url: string, data?: any) {
        return apiBase.put(url, data);
    },
    delete(url: string) {
        return apiBase.delete(url);
    },
};

export default api;
