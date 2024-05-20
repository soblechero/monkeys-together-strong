<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar class="ion-padding-top ion-padding-horizontal">
        <ion-searchbar v-model="searchQuery" @ionInput="onSearch" :debounce="500"></ion-searchbar>
        <div v-if="searchQuery">
          <ion-chip :color="searchType === 'game' ? 'primary' : 'medium'" @click="selectSearchType('game')">
            <ion-label>Game</ion-label>
          </ion-chip>
          <ion-chip :color="searchType === 'genre' ? 'primary' : 'medium'" @click="selectSearchType('genre')">
            <ion-label>Genre</ion-label>
          </ion-chip>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="!searchQuery">
        <h2 class="text-lg font-bold mt-4 pl-2">Your genres</h2>
        <ion-grid>
          <ion-row>
            <ion-col size="6" v-for="(genre, index) in yourGenres" :key="genre">
              <ion-card :class="sequentialBgColor(index)" class="h-32 p-4 flex flex-col justify-between text-white"
                        @click="goToGenrePage(genre)">
                <ion-icon :icon="icon" size="large" class="self-end"></ion-icon>
                <div class="text-left">
                  <p class="font-semibold text-base">#{{ genre }}</p>
                </div>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
        <h2 class="text-lg font-bold mt-4 pl-2">All genres</h2>
        <ion-grid>
          <ion-row>
            <ion-col size="6" v-for="(genre, index) in filteredAllGenres" :key="genre">
              <ion-card :class="sequentialBgColor(index)" class="h-32 p-4 flex flex-col justify-between text-white"
                        @click="goToGenrePage(genre)">
                <ion-icon :icon="icon" size="large" class="self-end"></ion-icon>
                <div class="text-left">
                  <p class="font-semibold text-base">#{{ genre }}</p>
                </div>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div v-else>
        <GameList :games="filteredGames"></GameList>
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
  IonSearchbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonChip,
  IonLabel,
  IonToast,
  IonIcon
} from '@ionic/vue';
import {pricetag} from 'ionicons/icons';
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import GameList from '@/components/GameList.vue';
import {Game} from '@/types';
import {searchGames, getGenres} from '@/services/api';
import {getPreferenceGenres} from '@/services/preferences';
import {handleError} from '@/utils';

const router = useRouter();
const yourGenres = ref<string[]>([]);
const allGenres = ref<string[]>([]);
const searchQuery = ref('');
const filteredGames = ref<Game[]>([]);
const searchType = ref<'game' | 'genre'>('game');
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const icon = pricetag;

const onSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      if (searchType.value === 'game') {
        filteredGames.value = await searchGames([], [searchQuery.value], [], []);
      } else {
        filteredGames.value = await searchGames([searchQuery.value], [], [], []);
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Failed to search games.');
      showToast(errorMessage, 'danger');
    }
  }
};

const selectSearchType = (type: 'game' | 'genre') => {
  searchType.value = type;
  onSearch(); // Trigger the search whenever the search type changes
};

const loadGenres = async () => {
  try {
    yourGenres.value = await getPreferenceGenres();
    allGenres.value = await getGenres();
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load genres.');
    showToast(errorMessage, 'danger');
  }
};

const filteredAllGenres = computed(() => {
  return allGenres.value.filter(genre => !yourGenres.value.includes(genre));
});

const sequentialBgColor = (index: number) => {
  const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500'
  ];
  return colors[index % colors.length];
};

const goToGenrePage = (genre: string) => {
  if (!genre) {
    return;
  }
  router.push({name: 'GenrePage', params: {genre}});
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(() => {
  loadGenres();
});
</script>
