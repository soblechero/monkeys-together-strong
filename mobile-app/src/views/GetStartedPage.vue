<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button/>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="relative ion-padding">
      <div class="ion-padding flex flex-col items-center">
        <img src="@/assets/getstarted.png" alt="Get Started" class="w-full"/>
        <ion-text>
          <h2 class="text-2xl text-center font-semibold">All Set to Begin!</h2>
          <p class="text-sm text-center mt-2">
            Hit 'Get Started' to launch your adventure. Remember, you can always refine your genre preferences in your
            profile settings for ever-evolving game recommendations.
          </p>
        </ion-text>
      </div>
      <ion-button expand="block" class="ion-padding fixed inset-x-0 bottom-5" @click="start">Get started</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonText, IonButton} from '@ionic/vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const start = () => {
  router.push('/home');
};
</script>

<style scoped>
</style>
