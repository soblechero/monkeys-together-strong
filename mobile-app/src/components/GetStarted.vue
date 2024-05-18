<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="text-center">
        <img src="@/assets/getstarted.png" alt="Get Started" class="mx-auto mb-4"/>
        <h2 class="text-xl font-bold mb-2">All Set to Begin!</h2>
        <p class="mb-4">
          Hit 'Get Started' to launch your adventure. Remember, you can always refine your genre preferences in your
          profile settings for ever-evolving game recommendations.
        </p>
        <ion-button expand="block" @click="navigateToHome">Get started</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonContent, IonButton} from '@ionic/vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const navigateToHome = () => {
  router.push('/home');
};
</script>

<style scoped>
.text-center {
  text-align: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: bold;
}
</style>
