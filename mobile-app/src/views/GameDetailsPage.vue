<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <div class="relative ion-padding-horizontal">
          <ion-card class="h-36 object-cover rounded-lg">
            <img :src="game?.artwork" :alt="game?.name" class="w-full rounded-lg"/>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg p-2">
              {{ game?.name }}
            </div>
          </ion-card>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ion-padding-horizontal">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-xl font-bold">{{ game?.name }}</h1>
          <ion-button @click="toggleFavorite" slot="end" fill="clear" shape="round">
            <ion-icon :icon="isFavorite ? checkmarkCircle : addCircle" slot="icon-only" size="large" color="primary"/>
          </ion-button>
        </div>

        <div class="flex justify-between mb-2">
          <div>Rating: {{ game?.rating }}%</div>
          <div>HowLongToBeat: {{ game?.howLongToBeat }}h</div>
        </div>

        <div class="mb-2">
          <div v-for="genre in game?.genres" :key="genre" class="inline-block">
            <ion-chip>#{{ genre }}</ion-chip>
          </div>
        </div>

        <div class="mb-2">
          <p>{{ game?.summary }}</p>
        </div>

        <div>
          <h2 class="text-lg font-bold">Similar content</h2>
          <GameList :games="similarGames"/>
        </div>
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
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonChip,
  IonToast,
  IonCard
} from '@ionic/vue';
import {addCircle, checkmarkCircle} from 'ionicons/icons';
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import GameList from '@/components/GameList.vue';
import {Game} from '@/types';
import {getGameDetails, getSimilarGames, addGameToFavorites, removeGameFromFavorites} from '@/services/api/games';
import {isGameInPreferences} from "@/services/preferences";
import {handleError} from '@/utils';

const route = useRoute();
const gameName = route.params.name as string;
const game = ref<Game | null>(null);
const similarGames = ref<Game[]>([]);
const isFavorite = ref(false);
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const fetchGameDetails = async () => {
  try {
    game.value = await getGameDetails(gameName);
    const similarGamesList = await getSimilarGames(game.value.genres);
    similarGames.value = similarGamesList.filter(similarGame => similarGame.name !== gameName);
    isFavorite.value = await isGameInPreferences(gameName);
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load game details.');
    showToast(errorMessage, 'danger');
  }
};

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await removeGameFromFavorites(gameName);
      showToast('Game removed from favorites.', 'success');
    } else {
      await addGameToFavorites(gameName);
      showToast('Game added to favorites.', 'success');
    }
    isFavorite.value = !isFavorite.value;
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update favorites.');
    showToast(errorMessage, 'danger');
  }
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(() => {
  fetchGameDetails();
});
</script>

<style scoped>
</style>
