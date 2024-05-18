<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <h2 class="text-xl font-bold mb-2">Select Your Game Genres</h2>
        <p class="subtitle">Fine-tune discoveries to match your playstyle</p>
        <div class="chips-container">
          <ion-chip
              v-for="genre in genres"
              :key="genre"
              :outline="!selectedGenres.includes(genre)"
              @click="toggleGenre(genre)"
          >
            <ion-label>#{{ genre }}</ion-label>
          </ion-chip>
        </div>
        <div class="buttons-container">
          <ion-button expand="block" fill="clear" @click="skipOnboarding">Skip</ion-button>
          <ion-button expand="block" @click="nextStep">
            Next
            <ion-icon aria-hidden="true" :icon="chevronForward"/>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonChip, IonLabel, IonButton, IonContent, IonPage} from '@ionic/vue';
import {chevronForward} from 'ionicons/icons';
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {getGenres, getUserGenres, updateUserGenres} from '@/services/api/genres';
import handleError from './handleError';

const genres = ref<string[]>([]);
const selectedGenres = ref<string[]>([]);
const toastOpen = ref(false);
const toastMessage = ref('');
const router = useRouter();

const fetchGenres = async () => {
  try {
    const response = await getGenres();
    genres.value = response.genres;

    const userGenresResponse = await getUserGenres();
    selectedGenres.value = userGenresResponse.genres;
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to fetch genres.');
    console.error(errorMessage);
    toastMessage.value = errorMessage;
    toastOpen.value = true;
  }
};

const toggleGenre = (genre: string) => {
  if (selectedGenres.value.includes(genre)) {
    selectedGenres.value = selectedGenres.value.filter(g => g !== genre);
  } else {
    selectedGenres.value.push(genre);
  }
};

const nextStep = async () => {
  try {
    await updateUserGenres(selectedGenres.value);
    await router.push('/onboarding/get-started');
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update genres.');
    console.error(errorMessage);
    toastMessage.value = errorMessage;
    toastOpen.value = true;
  }
};

const skipOnboarding = () => {
  router.push('/home');
};

onMounted(async () => {
  await fetchGenres();
});
</script>

<style scoped>
.container {
  padding: 16px;
  text-align: center;
}

.text-xl {
  font-size: 1.25rem;
  font-weight: bold;
}

.subtitle {
  margin-bottom: 20px;
  color: #8c8c8c;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.buttons-container {
  margin-top: 20px;
}
</style>
