// fronted/proyecto-vue/src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../pages/Dashboard.vue";
import Patients from "../pages/Patients.vue";
import Medications from "../pages/Medications.vue";
import Prescriptions from "../pages/Prescriptions.vue";
import Staff from "../pages/Staff.vue";
import PatientDetail from "../pages/PatientDetail.vue";
import PrescriptionDetail from "../pages/PrescriptionDetail.vue";

const routes = [
    { path: "/", component: Dashboard },
    { path: "/patients", component: Patients },
    { path: "/patients/:id", component: PatientDetail },
    { path: "/medications", component: Medications },
    { path: "/prescriptions", component: Prescriptions },
    { path: "/prescriptions/:id", component: PrescriptionDetail },
    { path: "/staff", component: Staff },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
