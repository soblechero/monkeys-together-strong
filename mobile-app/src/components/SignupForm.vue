<template>
  <form @submit.prevent="handleSignup" class="relative ion-padding-horizontal">
      <ion-input type="text" fill="outline" placeholder="Name" v-model="name" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Name" label-placement="floating"/>
      <ion-input type="email" fill="outline" placeholder="Email" v-model="email" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Email" label-placement="floating"/>
      <ion-input type="password" fill="outline" placeholder="Password" v-model="password" required
                 class="mt-4 border-b border-gray-300 rounded-md" label="Password" label-placement="floating"/>
      <ion-text v-if="errorMessage" color="danger">{{ errorMessage }}</ion-text>
    <ion-button type="submit" expand="block" class="ion-padding fixed inset-x-0 bottom-5">Continue</ion-button>
  </form>
</template>

<script setup lang="ts">
import { IonInput, IonText, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '@/services/api';
import {handleError} from '@/utils';

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleSignup = async () => {
  errorMessage.value = '';

  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill all fields';
    return;
  }

  try {
    await signup(name.value, email.value, password.value);
    await router.push('/onboarding');
  } catch (error) {
    errorMessage.value = handleError(error, 'Signup failed.');
  }
};
</script>

<style scoped>
</style>
