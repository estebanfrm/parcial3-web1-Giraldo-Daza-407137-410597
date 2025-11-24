<template>
  <div>
    <h1>Pacientes</h1>

    <div class="card">
      <h3>{{ editMode ? "Editar Paciente" : "Crear Paciente" }}</h3>

      <form @submit.prevent="savePatient">
        <label>Nombre</label>
        <input v-model="form.name" required />

        <label>Edad</label>
        <input type="number" v-model.number="form.age" required />

        <label>Dirección</label>
        <input v-model="form.address" required />

        <button class="button btn-primary" type="submit">
          {{ editMode ? "Actualizar" : "Crear" }}
        </button>

        <button v-if="editMode"
          type="button"
          class="button btn-secondary"
          @click="cancelEdit">
          Cancelar
        </button>
      </form>
    </div>

    <h3>Listado</h3>

    <table border="1" width="100%" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in patients" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.age }}</td>
          <td>{{ p.address }}</td>

          <td>
            <button class="button btn-primary" @click="startEdit(p)">
              Editar
            </button>

            <button class="button btn-danger" @click="deletePatient(p.id)">
              Eliminar
            </button>

            <button class="button btn-secondary" @click="goToDetail(p.id)">
              Ver Detalle
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="patients.length === 0">No hay pacientes registrados.</p>
  </div>
</template>

<script setup lang="ts">
import api from "../services/api";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const patients = ref<any[]>([]);
const editMode = ref(false);

const form = ref({
  id: null as number | null,
  name: "",
  age: null as number | null,
  address: "",
});

// ----------------------------
// Convertir edad en birthDate
// ----------------------------
function ageToBirthDate(age: number) {
  const año = new Date().getFullYear() - age;
  return `${año}-01-01`;
}

// ----------------------------
// Convertir birthDate en edad
// ----------------------------
function calcularEdad(birthDate: string) {
  if (!birthDate) return "";
  const fecha = new Date(birthDate);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  if (
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() &&
      hoy.getDate() < fecha.getDate())
  ) {
    edad--;
  }
  return edad;
}

// ----------------------------
// Cargar pacientes
// ----------------------------
async function loadPatients() {
  const res = await api.get("/patients");

  patients.value = res.data.map((p: any) => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    age: calcularEdad(p.birthDate),
    address: p.address,
  }));
}

onMounted(() => loadPatients());

// ----------------------------
// Crear / actualizar
// ----------------------------
async function savePatient() {
  const payload = {
    firstName: form.value.name,
    lastName: "N/A",
    documentNumber: Date.now().toString(),
    address: form.value.address,
    birthDate: ageToBirthDate(form.value.age!),
  };

  if (editMode.value) {
    await api.put(`/patients/${form.value.id}`, payload);
  } else {
    await api.post("/patients", payload);
  }

  await loadPatients();
  cancelEdit();
}

// ----------------------------
// Eliminar
// ----------------------------
async function deletePatient(id: number) {
  await api.delete(`/patients/${id}`);
  await loadPatients();
}

// ----------------------------
// Editar
// ----------------------------
function startEdit(p: any) {
  editMode.value = true;
  form.value = {
    id: p.id,
    name: p.name,
    age: p.age,
    address: p.address,
  };
}

// ----------------------------
// Cancelar edición
// ----------------------------
function cancelEdit() {
  editMode.value = false;
  form.value = { id: null, name: "", age: null, address: "" };
}

// ----------------------------
// Ir al detalle
// ----------------------------
function goToDetail(id: number) {
  router.push(`/patients/${id}`);
}
</script>

<style scoped>
.card {
  padding: 1.5rem;
  background: #f7f7f7;
  border-radius: 8px;
  margin-bottom: 2rem;
}
</style>
