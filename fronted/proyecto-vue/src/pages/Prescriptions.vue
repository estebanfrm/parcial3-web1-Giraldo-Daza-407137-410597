<template>
  <div>
    <h1>Prescripciones</h1>

    <!-- FORMULARIO CREAR -->
    <div class="card">
      <h3>Crear Prescripción</h3>

      <form @submit.prevent="createPrescription">
        <label>Paciente</label>
        <select v-model="form.patientId" required>
          <option value="">Seleccione...</option>
          <option v-for="p in patients" :value="p.id" :key="p.id">
            {{ p.name }}
          </option>
        </select>

        <label>Médico</label>
        <select v-model="form.doctorId" required>
          <option value="">Seleccione...</option>
          <option v-for="m in staff" :value="m.id" :key="m.id">
            {{ m.name }} ({{ m.role }})
          </option>
        </select>

        <button class="button btn-primary" type="submit">
          Crear
        </button>
      </form>
    </div>

    <hr />

    <!-- LISTADO -->
    <h3>Listado de Prescripciones</h3>

    <table border="1" width="100%" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in prescriptions" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.patientName }}</td>
          <td>{{ p.doctorName }}</td>
          <td>{{ p.date }}</td>

          <td>
            <button class="button btn-primary" @click="goDetail(p.id)">
              Ver
            </button>

            <button class="button btn-danger" @click="deletePrescription(p.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="prescriptions.length === 0">
      No hay prescripciones registradas.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

interface PatientUI {
  id: number;
  name: string;
}

interface StaffUI {
  id: number;
  name: string;
  role: string;
}

interface PrescriptionUI {
  id: number;
  patientId: number;
  medicalStaffId: number;
  patientName: string;
  doctorName: string;
  date: string;
}

const prescriptions = ref<PrescriptionUI[]>([]);
const patients = ref<PatientUI[]>([]);
const staff = ref<StaffUI[]>([]);

const form = ref({
  patientId: "" as string | number,
  doctorId: "" as string | number,
});

// ----------------------
// Cargar datos iniciales
// ----------------------
async function loadData() {
  const [presRes, patientsRes, staffRes] = await Promise.all([
    api.get("/prescriptions"),
    api.get("/patients"),
    api.get("/staff"),
  ]);

  const patientsRaw = patientsRes.data as any[];
  const staffRaw = staffRes.data as any[];

  const patientsMap = new Map<number, any>();
  for (const p of patientsRaw) {
    patientsMap.set(p.id, p);
  }

  const staffMap = new Map<number, any>();
  for (const s of staffRaw) {
    staffMap.set(s.id, s);
  }

  // prescripciones con nombres "bonitos"
  prescriptions.value = (presRes.data as any[]).map((p: any) => {
    const patient = patientsMap.get(p.patientId);
    const doctor = staffMap.get(p.medicalStaffId);

    const patientName = patient
      ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
      : `Paciente #${p.patientId}`;

    const doctorName = doctor
      ? `${doctor.firstName ?? ""} ${doctor.lastName ?? ""}`.trim()
      : `Médico #${p.medicalStaffId}`;

    return {
      id: p.id,
      patientId: p.patientId,
      medicalStaffId: p.medicalStaffId,
      patientName,
      doctorName,
      date: p.issuedAt ?? "",
    };
  });

  // opciones del select de pacientes
  patients.value = patientsRaw.map((p: any) => ({
    id: p.id,
    name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
  }));

  // opciones del select de médicos
  staff.value = staffRaw.map((s: any) => ({
    id: s.id,
    name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
    role: s.role,
  }));
}

onMounted(() => {
  loadData().catch((err) => {
    console.error("Error loading prescriptions data", err);
  });
});

// ----------------------
// Crear prescripción
// ----------------------
async function createPrescription() {
  const payload = {
    patientId: Number(form.value.patientId),
    medicalStaffId: Number(form.value.doctorId),
    notes: "",
    items: [] as any[], // detalles de la prescripción
  };

  await api.post("/prescriptions", payload);
  await loadData();

  form.value = { patientId: "", doctorId: "" };
}

// ----------------------
// Eliminar
// ----------------------
async function deletePrescription(id: number) {
  await api.delete(`/prescriptions/${id}`);
  await loadData();
}

// ----------------------
// Ver detalle
// ----------------------
function goDetail(id: number) {
  router.push(`/prescriptions/${id}`);
}
</script>

<style scoped>
.card {
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: #f7f7f7;
  border-radius: 8px;
}
</style>
