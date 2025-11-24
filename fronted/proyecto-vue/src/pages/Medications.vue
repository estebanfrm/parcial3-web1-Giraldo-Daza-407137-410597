<template>
  <div>
    <h1>Medicamentos</h1>

    <!-- FORMULARIO CREAR / EDITAR -->
    <div class="card">
      <h3>{{ editMode ? "Editar Medicamento" : "Crear Medicamento" }}</h3>

      <form @submit.prevent="saveMedication">
        <label>Nombre</label>
        <input v-model="form.name" required />

        <label>Descripción</label>
        <input v-model="form.description" required />

        <label>Dosis Recomendada</label>
        <input v-model="form.recommendedDose" required />

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

    <!-- LISTA DE MEDICAMENTOS -->
    <h3>Listado</h3>

    <table border="1" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Dosis Recomendada</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in medications" :key="m.id">
          <td>{{ m.id }}</td>
          <td>{{ m.name }}</td>
          <td>{{ m.description }}</td>
          <td>{{ m.recommendedDose }}</td>

          <td>
            <button class="button btn-primary" @click="startEdit(m)">
              Editar
            </button>

            <button class="button btn-danger" @click="deleteMedication(m.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="medications.length === 0">No hay medicamentos registrados.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

const medications = ref<any[]>([]);
const editMode = ref(false);

const form = ref({
  id: null as number | null,
  name: "",
  description: "",
  recommendedDose: "",
});

// ----------------------
// Cargar medicamentos
// ----------------------
async function loadMedications() {
  const res = await api.get("/medications");

  medications.value = res.data.map((m: any) => ({
    id: m.id,
    name: m.name,
    description: m.description ?? "",
    recommendedDose: m.dosageInfo ?? "",
  }));
}

onMounted(() => {
  loadMedications();
});

// ----------------------
// Crear o actualizar
// ----------------------
async function saveMedication() {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    manufacturer: "",
    presentation: "",
    dosageInfo: form.value.recommendedDose,
  };

  if (editMode.value && form.value.id != null) {
    await api.put(`/medications/${form.value.id}`, payload);
  } else {
    await api.post("/medications", payload);
  }

  await loadMedications();
  cancelEdit();
}

// ----------------------
// Eliminar
// ----------------------
async function deleteMedication(id: number) {
  await api.delete(`/medications/${id}`);
  await loadMedications();
}

// ----------------------
// Editar
// ----------------------
function startEdit(m: any) {
  editMode.value = true;
  form.value = {
    id: m.id,
    name: m.name,
    description: m.description,
    recommendedDose: m.recommendedDose,
  };
}

function cancelEdit() {
  editMode.value = false;
  form.value = { id: null, name: "", description: "", recommendedDose: "" };
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
