<template>
  <div>
    <h1>Dashboard</h1>
    <div class="grid">
      <div class="card">
        <h3>Pacientes</h3>
        <p>{{ patientsCount }}</p>
        <RouterLink to="/patients" class="button btn-primary">Ver pacientes</RouterLink>
      </div>
      <div class="card">
        <h3>Medicamentos</h3>
        <p>{{ medsCount }}</p>
        <RouterLink to="/medications" class="button btn-primary">Ver medicamentos</RouterLink>
      </div>
      <div class="card">
        <h3>Prescripciones</h3>
        <p>{{ prescriptionsCount }}</p>
        <RouterLink to="/prescriptions" class="button btn-primary">Ver prescripciones</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'

const patientsCount = ref(0)
const medsCount = ref(0)
const prescriptionsCount = ref(0)

async function load() {
  try {
    const [p, m, pr] = await Promise.all([
      api.get('/patients'),
      api.get('/medications'),
      api.get('/prescriptions')
    ])
    patientsCount.value = Array.isArray(p.data) ? p.data.length : 0
    medsCount.value = Array.isArray(m.data) ? m.data.length : 0
    prescriptionsCount.value = Array.isArray(pr.data) ? pr.data.length : 0
  } catch (err) {
    console.error('Dashboard load error', err)
  }
}

onMounted(load)
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.card { background: #fff; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
</style>
