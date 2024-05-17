<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar >
        <ion-buttons slot="start">
          <ion-back-button defaultHref="#"/>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar class="ion-padding">
        <ion-segment v-model="authMode" class="w-full">
          <ion-segment-button expand="block" value="login">Login</ion-segment-button>
          <ion-segment-button expand="block" value="signup">Signup</ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding-start ion-padding-end">
      <component :is="authModeComponent" @authSuccess="handleAuthSuccess"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/vue';
import {ref, computed} from 'vue';
//import { useRouter } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';
import SignupForm from '@/components/SignupForm.vue';

const authMode = ref('login');
//const router = useRouter();

const authModeComponent = computed(() =>
    authMode.value === 'login' ? LoginForm : SignupForm
);

const handleAuthSuccess = () => {
  //await router.push('/');
  console.log('Authentication successful');
};
</script>
