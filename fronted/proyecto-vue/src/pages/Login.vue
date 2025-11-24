<template>
  <div class="login-container">
    <h1>Iniciar sesión</h1>

    <form @submit.prevent="login">
      <label>Email</label>
      <input type="email" v-model="email" required />

      <label>Contraseña</label>
      <input type="password" v-model="password" required />

      <button class="button btn-primary" type="submit" :disabled="loading">
        {{ loading ? "Ingresando..." : "Entrar" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function login() {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    // Guardar token
    localStorage.setItem("token", response.data.token);

    router.push("/");
  } catch (err: any) {
    error.value = err.response?.data?.message || "Error al iniciar sesión";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
.error {
  margin-top: 1rem;
  color: red;
}
</style>
