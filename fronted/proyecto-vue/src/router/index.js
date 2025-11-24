// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../pages/Dashboard.vue";
import Login from "../pages/Login.vue";
import Patients from "../pages/Patients.vue";
import PatientDetail from "../pages/PatientDetail.vue";
import Medications from "../pages/Medications.vue";
import Prescriptions from "../pages/Prescriptions.vue";
import PrescriptionDetail from "../pages/PrescriptionDetail.vue";
import Staff from "../pages/Staff.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/login", component: Login },

  // Pacientes
  { path: "/patients", component: Patients },
  { path: "/patients/:id", component: PatientDetail },

  // Medicamentos
  { path: "/medications", component: Medications },

  // Prescripciones
  { path: "/prescriptions", component: Prescriptions },
  { path: "/prescriptions/:id", component: PrescriptionDetail },

  // Staff
  { path: "/staff", component: Staff },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔥 AQUI ESTÁ LO QUE TE FALTABA:
export default router;
