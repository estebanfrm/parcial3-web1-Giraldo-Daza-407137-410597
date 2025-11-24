<template>
  <div>
    <h1>Personal Médico</h1>

    <!-- FORMULARIO CREAR / EDITAR -->
    <div class="card">
      <h3>
        {{ editMode ? "Editar Personal Médico" : "Crear Personal Médico" }}
      </h3>

      <form @submit.prevent="saveStaff">
        <label>Nombre</label>
        <input v-model="form.name" required />

        <label>Especialidad / Rol</label>
        <input v-model="form.role" required />

        <label>Correo</label>
        <input type="email" v-model="form.email" required />

        <button class="button btn-primary" type="submit">
          {{ editMode ? "Actualizar" : "Crear" }}
        </button>

        <button
          v-if="editMode"
          @click="cancelEdit"
          type="button"
          class="button btn-secondary"
        >
          Cancelar
        </button>
      </form>
    </div>

    <hr />

    <!-- LISTA DE PERSONAL MÉDICO -->
    <h3>Listado</h3>

    <table border="1" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in staff" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.role }}</td>
          <td>{{ s.email }}</td>

          <td>
            <button class="button btn-primary" @click="startEdit(s)">
              Editar
            </button>

            <button class="button btn-danger" @click="deleteStaff(s.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="staff.length === 0">No se ha registrado personal médico.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

const staff = ref<any[]>([]);
const editMode = ref(false);

const form = ref({
  id: null as number | null,
  name: "",
  role: "",
  email: "",
});

// ----------------------
// Cargar personal médico
// ----------------------
async function loadStaff() {
  const res = await api.get("/staff");

  // Adaptar del backend al front
  staff.value = res.data.map((s: any) => ({
    id: s.id,
    name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
    role: s.role,
    email: s.licenseId ?? "",
  }));
}

onMounted(() => {
  loadStaff();
});

// Helper para partir el name en firstName / lastName
function splitName(fullName: string) {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || "-";
  return { firstName, lastName };
}

// ----------------------
// Crear o actualizar
// ----------------------
async function saveStaff() {
  const { firstName, lastName } = splitName(form.value.name);

  const payload = {
    firstName,
    lastName,
    role: form.value.role,
    specialty: "",
    licenseId: form.value.email,
  };

  if (editMode.value && form.value.id != null) {
    await api.put(`/staff/${form.value.id}`, payload);
  } else {
    await api.post("/staff", payload);
  }

  await loadStaff();
  cancelEdit();
}

// ----------------------
// Eliminar
// ----------------------
async function deleteStaff(id: number) {
  await api.delete(`/staff/${id}`);
  await loadStaff();
}

// ----------------------
// Editar
// ----------------------
function startEdit(s: any) {
  editMode.value = true;
  form.value = {
    id: s.id,
    name: s.name,
    role: s.role,
    email: s.email,
  };
}

function cancelEdit() {
  editMode.value = false;
  form.value = { id: null, name: "", role: "", email: "" };
}
</script>

<style scoped>
.card {
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: #f2f2f2;
  border-radius: 8px;
}
</style>
