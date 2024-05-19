<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar color="transparent ion-padding">
        <ion-buttons slot="start">
          <ion-back-button/>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding relative">
      <div class="ion-padding-top">
        <h2 class="text-center text-xl font-bold">Select Your Game Genres</h2>
        <p class="mb-4 text-center text-sm">Fine-tune discoveries to match your playstyle</p>
      </div>
      <div class="ion-padding flex flex-wrap justify-center">
        <ion-chip
            v-for="genre in genres"
            :key="genre"
            @click="toggleGenre(genre)"
            :color="selectedGenres.includes(genre) ? 'primary' : 'medium'"
            class="m-1">
          <ion-label>#{{ genre }}</ion-label>
        </ion-chip>
      </div>
      <div class="flex justify-between mt-20 ion-padding w-full fixed bottom-5 inset-x-0 ">
        <ion-button @click="skip" fill="clear">Skip</ion-button>
        <ion-button @click="next" fill="clear">
          Next
          <ion-icon slot="end" :icon="chevronForward"/>
        </ion-button>
      </div>
      <ion-toast
          :is-open="toast.isOpen"
          :message="toast.message"
          :color="toast.color"
          :duration="2000"
          @did-dismiss="toast.isOpen = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonChip,
  IonLabel,
  IonButton,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonToast
} from '@ionic/vue';
import {chevronForward} from 'ionicons/icons';
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {getGenres, updateUserGenres} from '@/services/api/genres';
import {getSelectedGenres, setSelectedGenres} from '@/services/preferences/selectedGenres';
import handleError from '@/utils/handleError';

const genres = ref<string[]>([]);
const selectedGenres = ref<string[]>([]);
const router = useRouter();
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const loadGenres = async () => {
  try {
    genres.value = await getGenres();
    selectedGenres.value = await getSelectedGenres();
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load genres.');
    showToast(errorMessage, 'danger');
  }
};

const toggleGenre = (genre: string) => {
  if (selectedGenres.value.includes(genre)) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== genre);
  } else {
    selectedGenres.value.push(genre);
  }
};

const skip = async () => {
  await setSelectedGenres([]);
  await router.push('/home');
};

const next = async () => {
  try {
    await updateUserGenres(selectedGenres.value);
    await router.push('/onboarding/get-started');
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update genres.');
    showToast(errorMessage, 'danger');
  }
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(loadGenres);
</script>
