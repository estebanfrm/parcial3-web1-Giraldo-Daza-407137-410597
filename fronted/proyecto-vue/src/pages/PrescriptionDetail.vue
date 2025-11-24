<template>
  <div>
    <h1>Detalle de Prescripción</h1>

    <button class="button btn-secondary" @click="goBack">
      ⬅ Volver
    </button>

    <!-- Datos principales -->
    <div class="card" v-if="prescription">
      <h2>Prescripción #{{ prescription.id }}</h2>
      <p><strong>Fecha:</strong> {{ prescription.date }}</p>
      <p><strong>Paciente:</strong> {{ prescription.patientName }}</p>
      <p><strong>Médico:</strong> {{ prescription.doctorName }}</p>
    </div>

    <hr />

    <!-- AGREGAR ITEM -->
    <div class="card">
      <h3>Añadir medicamento</h3>

      <form @submit.prevent="addItem">
        <label>Medicamento</label>
        <select v-model="itemForm.medicationId" required>
          <option value="">Seleccione...</option>
          <option
            v-for="m in medications"
            :value="m.id"
            :key="m.id"
          >
            {{ m.name }}
          </option>
        </select>

        <label>Dosis</label>
        <input v-model="itemForm.dose" required />

        <label>Frecuencia</label>
        <input v-model="itemForm.frequency" required />

        <button class="button btn-primary" type="submit">
          Agregar
        </button>
      </form>
    </div>

    <hr />

    <!-- LISTA DE ITEMS -->
    <h3>Medicamentos Recetados</h3>

    <table border="1" cellpadding="8" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Medicamento</th>
          <th>Dosis</th>
          <th>Frecuencia</th>
          <th>Administraciones</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in items" :key="i.id">
          <td>{{ i.id }}</td>
          <td>{{ i.medicationName }}</td>
          <td>{{ i.dose }}</td>
          <td>{{ i.frequency }}</td>

          <td>
            <ul>
              <li v-for="adm in i.administrations" :key="adm.id">
                {{ adm.date }} - {{ adm.notes }}
                <button
                  class="button btn-danger"
                  @click="deleteAdministration(adm.id)"
                >
                  X
                </button>
              </li>
            </ul>

            <!-- Registrar administración -->
            <form
              @submit.prevent="addAdministration(i.id)"
              class="admin-form"
            >
              <input
                v-model="adminForm.notes"
                placeholder="Notas"
                required
              />
              <button class="button btn-primary">Registrar</button>
            </form>
          </td>

          <td>
            <button
              class="button btn-danger"
              @click="deleteItem(i.id)"
            >
              Eliminar Item
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="items.length === 0">No hay medicamentos en esta prescripción.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();

const prescription = ref<any>(null);
const items = ref<any[]>([]);
const medications = ref<any[]>([]);

// Formularios
const itemForm = ref({
  medicationId: "",
  dose: "",
  frequency: "",
});

const adminForm = ref({
  notes: "",
});

// ----------------------
// Cargar datos
// ----------------------
async function loadAll() {
  const id = route.params.id;

  prescription.value = (await api.get(`/prescriptions/${id}`)).data;
  items.value = (await api.get(`/prescriptions/${id}/items`)).data;
  medications.value = (await api.get(`/medications`)).data;
}

onMounted(() => {
  loadAll();
});

// ----------------------
// Agregar item
// ----------------------
async function addItem() {
  const id = route.params.id;
  await api.post(`/prescriptions/${id}/items`, itemForm.value);

  itemForm.value = { medicationId: "", dose: "", frequency: "" };
  loadAll();
}

// ----------------------
// Eliminar item
// ----------------------
async function deleteItem(itemId: number) {
  await api.delete(`/prescription-items/${itemId}`);
  loadAll();
}

// ----------------------
// Registrar administración
// ----------------------
async function addAdministration(itemId: number) {
  await api.post(`/prescription-items/${itemId}/administrations`, {
    notes: adminForm.value.notes,
  });

  adminForm.value.notes = "";
  loadAll();
}

// ----------------------
// Eliminar administración
// ----------------------
async function deleteAdministration(adminId: number) {
  await api.delete(`/administrations/${adminId}`);
  loadAll();
}

function goBack() {
  router.push("/prescriptions");
}
</script>

<style scoped>
.card {
  background: #f7f7f7;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.admin-form {
  margin-top: 1rem;
}
</style>
