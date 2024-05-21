<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar class="flex justify-between items-center pr-4">
          <ion-title slot="start" class="text-xl font-bold text-left">#{{ genreName }}</ion-title>
        <ion-button @click="toggleFavorite" slot="end" fill="clear" shape="round">
          <ion-icon :icon="isFavorite ? checkmarkCircle : addCircle" slot="icon-only" size="large" color="primary"/>
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <GameList :games="games"></GameList>
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
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonToast
} from '@ionic/vue';
import {addCircle, checkmarkCircle} from 'ionicons/icons';
import GameList from '@/components/GameList.vue';
import {Game} from '@/types';
import {searchGames} from '@/services/api/games';
import {isGenreInPreferences} from '@/services/preferences/';
import {addGenreToFavorites, removeGenreFromFavorites} from '@/services/api';
import {handleError} from '@/utils';

const route = useRoute();
const genreName = route.params.name as string;

const games = ref<Game[]>([]);
const isFavorite = ref<boolean>(false);
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const fetchGames = async () => {
  try {
    games.value = await searchGames([genreName], [], [], []);
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load games for this genre.');
    showToast(errorMessage, 'danger');
  }
};

const checkFavorite = async () => {
  try {
    isFavorite.value = await isGenreInPreferences(genreName);
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to check favorite status.');
    showToast(errorMessage, 'danger');
  }
};

const toggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await removeGenreFromFavorites(genreName);
      isFavorite.value = false;
      showToast('Genre removed from favorites', 'success');
    } else {
      await addGenreToFavorites(genreName);
      isFavorite.value = true;
      showToast('Genre added to favorites', 'success');
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update favorite status.');
    showToast(errorMessage, 'danger');
  }
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(() => {
  fetchGames();
  checkFavorite();
});
</script>
