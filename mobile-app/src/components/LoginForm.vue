<template>
  <form @submit.prevent="handleLogin" class="relative ion-padding-horizontal">
    <ion-input type="email" fill="outline" placeholder="Email" v-model="email" required
               class="mt-4 border-b border-gray-300 rounded-md" label="Email" label-placement="floating"/>
    <ion-input type="password" fill="outline" placeholder="Password" v-model="password" required
               class="mt-4 border-b border-gray-300 rounded-md" label="Password" label-placement="floating"/>
    <ion-text v-if="errorMessage" color="danger"> {{ errorMessage }}</ion-text>
    <ion-button type="submit" expand="block" class="ion-padding fixed inset-x-0 bottom-5">Continue</ion-button>
  </form>
</template>

<script setup lang="ts">
import {IonButton, IonInput, IonText} from '@ionic/vue';
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {login} from '@/services/api';
import {handleError} from '@/utils';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

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
    errorMessage.value = handleError(error, 'Login failed.');
  }
};
</script>

<style scoped>
</style>
