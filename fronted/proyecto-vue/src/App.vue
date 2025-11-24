<template>
  <div>
    <header>
      <div class="container" style="display:flex; align-items:center; justify-content:space-between;">
        <div><strong>Gestor Medicamentos y Pacientes</strong></div>
        <nav>
          <RouterLink class="nav-link" to="/">Dashboard</RouterLink>
          <RouterLink class="nav-link" to="/patients">Pacientes</RouterLink>
          <RouterLink class="nav-link" to="/medications">Medicamentos</RouterLink>
          <RouterLink class="nav-link" to="/prescriptions">Prescripciones</RouterLink>
          <RouterLink class="nav-link" to="/staff">Personal</RouterLink>
        </nav>
      </div>
    </header>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// nothing here yet
</script>
