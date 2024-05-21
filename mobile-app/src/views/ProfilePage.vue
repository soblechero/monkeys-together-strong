<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar class="ion-padding-horizontal ion-padding-top">
        <div class="flex items-center mb-4">
          <ion-avatar class="w-24 h-24 mr-4">
            <img src="@/assets/logo.webp" alt="User Avatar">
          </ion-avatar>
          <div class="pl-5">
            <h2 class="text-lg font-bold">{{ email }}</h2>
          </div>
        </div>

        <div class="flex space-x-2">
          <ion-chip :color="selectedTab === 'games' ? 'primary' : 'medium'" @click="selectedTab = 'games'">
            <ion-label>Favorites</ion-label>
          </ion-chip>
          <ion-chip :color="selectedTab === 'genres' ? 'primary' : 'medium'" @click="selectedTab = 'genres'">
            <ion-label>Genres</ion-label>
          </ion-chip>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="selectedTab === 'games'">
        <GameList :games="favoriteGames" @update-favorites="updateFavorites" @show-toast="showToast"></GameList>
      </div>
      <div v-else-if="selectedTab === 'genres'">
        <GenreList :genres="favoriteGenres" @update-favorites="updateFavorites" @show-toast="showToast"></GenreList>
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
  IonAvatar,
  IonChip,
  IonLabel,
  IonToast,
  onIonViewWillEnter
} from '@ionic/vue';
import {ref, onMounted} from 'vue';
import GameList from '@/components/GameList.vue';
import GenreList from '@/components/GenreList.vue';
import {getPreferenceGames, getPreferenceGenres, getUserEmailFromPreferences} from '@/services/preferences';
import {searchGames} from '@/services/api';
import {Game} from '@/types';
import {handleError} from '@/utils';

const email = ref('');
const favoriteGames = ref<Game[]>([]);
const favoriteGenres = ref<string[]>([]);
const selectedTab = ref('games');
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const loadUserData = async () => {
  try {
    email.value = await getUserEmailFromPreferences() as string;
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load user data.');
    showToast(errorMessage, 'danger');
  }
};

const loadFavoriteGames = async () => {
  try {
    const gameNames = await getPreferenceGames();
    if (gameNames.length > 0) {
      favoriteGames.value = await searchGames([], gameNames, [], []);
    } else {
      favoriteGames.value = [];
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load favorite games.');
    showToast(errorMessage, 'danger');
  }
};

const loadFavoriteGenres = async () => {
  try {
    favoriteGenres.value = await getPreferenceGenres();
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load favorite genres.');
    showToast(errorMessage, 'danger');
  }
};

const updateFavorites = () => {
  loadFavoriteGames();
  loadFavoriteGenres();
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

const loadProfileData = () => {
  loadUserData();
  loadFavoriteGames();
  loadFavoriteGenres();
};

onMounted(() => {
  loadProfileData();
});

onIonViewWillEnter(() => {
  loadProfileData();
});
</script>
