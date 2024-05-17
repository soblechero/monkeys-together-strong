<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <ion-input type="email" fill="outline" placeholder="Email" v-model="email" required
               class="mt-4 border border-gray-100 rounded-md" label="Email" label-placement="floating"/>
    <ion-input type="password" fill="outline" placeholder="Password" v-model="password" required
               class="mt-4 border border-gray-100 rounded-md" label="Password" label-placement="floating"/>
    <ion-text v-if="errorMessage" color="danger" > {{ errorMessage }}</ion-text>
    <ion-button type="submit" expand="block" class="mt-8">Continue</ion-button>
  </form>
</template>

<script setup lang="ts">
import {IonButton, IonInput, IonText} from '@ionic/vue';
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {login} from '@/services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

// const validateEmailField = () => {
//   emailTouched.value = true;
//   isEmailValid.value = isValidEmail(email.value);
// };


const handleLogin = async () => {
  errorMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill all fields';
    return;
  }

  try {
    await login(email.value, password.value);
    await router.push('/');
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials and try again.';
    console.error('Error en login:', error);
  }
};
</script>

<style scoped>
</style>
