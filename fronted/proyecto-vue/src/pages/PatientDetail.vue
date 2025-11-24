<template>
  <div>
    <h1>Detalle del Paciente</h1>

    <button class="button btn-secondary" @click="goBack">
      ⬅ Volver
    </button>

    <!-- Información del paciente -->
    <div class="card" v-if="patient">
      <h2>{{ patient.name }}</h2>
      <p><strong>Edad:</strong> {{ patient.age }}</p>
      <p><strong>Dirección:</strong> {{ patient.address }}</p>
    </div>

    <hr />

    <!-- Prescripciones del paciente -->
    <h3>Prescripciones</h3>

    <table border="1" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Médico</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in prescriptions" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.date }}</td>
          <td>{{ p.doctorName }}</td>

          <td>
            <button
              class="button btn-primary"
              @click="viewPrescription(p.id)"
            >
              Ver
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="prescriptions.length === 0">
      Este paciente no tiene prescripciones registradas.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();

const patient = ref<any>(null);
const prescriptions = ref<any[]>([]);
const staffMap = ref<Record<number, string>>({});

// Helper para calcular edad a partir de birthDate
function calcularEdad(birthDate: string | undefined): string {
  if (!birthDate) return "";
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return String(age);
}

// ----------------------
// Cargar datos del paciente
// ----------------------
async function loadPatient() {
  const id = route.params.id;
  const res = await api.get(`/patients/${id}`);
  const p = res.data;

  patient.value = {
    id: p.id,
    name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
    age: calcularEdad(p.birthDate),
    address: p.address ?? "",
  };
}

// ----------------------
// Cargar prescripciones del paciente
// ----------------------
async function loadPrescriptions() {
  const id = route.params.id;

  // Cargamos personal médico para poder mostrar el nombre del doctor
  const staffRes = await api.get("/staff");
  const staffArr = staffRes.data as any[];
  staffMap.value = {};
  for (const s of staffArr) {
    staffMap.value[s.id] = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
  }

  // Cargamos prescripciones del backend
  const res = await api.get(`/prescriptions/patient/${id}`);
  const data = res.data as any[];

  prescriptions.value = data.map((p: any) => ({
    id: p.id,
    date: p.issuedAt ?? "",
    doctorName: staffMap.value[p.medicalStaffId] || `Médico #${p.medicalStaffId}`,
  }));
}

onMounted(() => {
  loadPatient();
  loadPrescriptions();
});

// ----------------------
//  Acciones
// ----------------------
function goBack() {
  router.push("/patients");
}

function viewPrescription(id: number) {
  router.push(`/prescriptions/${id}`);
}
</script>

<style scoped>
.card {
  background: #f3f3f3;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
</style>
