<template>
  <form @submit.prevent="handleSignup" class="signup-form">
      <ion-input type="text" fill="outline" placeholder="Username" v-model="username" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Username" label-placement="floating"/>
      <ion-input type="email" fill="outline" placeholder="Email" v-model="email" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Email" label-placement="floating"/>
      <ion-input type="password" fill="outline" placeholder="Password" v-model="password" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Password" label-placement="floating"/>
      <ion-text v-if="errorMessage" color="danger">{{ errorMessage }}</ion-text>
    <ion-button type="submit" expand="block" class="mt-8">Continue</ion-button>
  </form>
</template>

<script setup lang="ts">
import { IonInput, IonText, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '@/services/api';
import handleError from './handleError';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleSignup = async () => {
  errorMessage.value = '';

  if (!username.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill all fields';
    return;
  }

  try {
    await signup(username.value, email.value, password.value);
    await router.push('/onboarding');
  } catch (error) {
    errorMessage.value = handleError(error, 'Signup failed.');
  }
};
</script>

<style scoped>
</style>
