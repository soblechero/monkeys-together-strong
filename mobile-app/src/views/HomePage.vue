<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar class="ion-padding-horizontal ion-padding-top">
        <ion-chip :color="activeTag === 'all' ? 'primary' : 'medium'" @click="tagChanged('all')">
          <ion-label>All</ion-label>
        </ion-chip>
        <ion-chip :color="activeTag === 'new' ? 'primary' : 'medium'" @click="tagChanged('new')">
          <ion-label>New</ion-label>
        </ion-chip>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-padding-top relative">
        <h2 class="text-lg font-bold pl-1">Chosen for you</h2>
        <ion-card class="h-36 object-cover rounded-lg" @click="goToGameDetails(chosenGame?.name)">
          <img :src="chosenGame?.artwork" alt="Chosen game" class="w-full rounded-lg"/>
          <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg p-2">
            {{ chosenGame?.name }}
          </div>
        </ion-card>
      </div>

      <div v-for="(games, genre) in filteredGamesByGenre" :key="genre" class="pt-4">
        <h2 class="text-lg font-bold pl-1">{{ `#${genre}` }}</h2>
        <swiper
            :modules="[Pagination, FreeMode, Navigation, Scrollbar, A11y]"
            :slides-per-view="2"
            :space-between="0"
            :free-mode="true"
            :title="genre"
            :pagination="{ clickable: true }"
        >
          <swiper-slide v-for="game in gamesByGenre[genre]" :key="game.name">
            <ion-card @click="goToGameDetails(game.name)" class="object-cover">
              <img :src="game.thumb" :alt="game.name" class="w-full"/>
              <ion-card-content class="font-bold text-left">
                {{ game.name }}
              </ion-card-content>
            </ion-card>
          </swiper-slide>
        </swiper>
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
  IonCard,
  IonToast,
  IonCardContent,
  onIonViewWillEnter
} from '@ionic/vue';
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {Game} from '@/types';
import {getPreferenceGenres} from '@/services/preferences';
import {searchGames} from '@/services/api';
import {handleError, groupGamesByProvidedGenres, groupGamesByGameGenres} from '@/utils';
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation, Pagination, FreeMode, Scrollbar, A11y} from 'swiper/modules';
import 'swiper/css/bundle';
// import 'swiper/css'
// import 'swiper/css/pagination'

const genres = ref<string[]>([]);
const gamesByGenre = ref<Record<string, Game[]>>({});
const chosenGame = ref<Game | null>(null);
const activeTag = ref('all');
const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const router = useRouter();

const fetchGames = async () => {
  try {
    genres.value = await getPreferenceGenres();
    const releaseYears = activeTag.value === 'new' ? [new Date().getFullYear()] : [];
    const gamesList = await searchGames(genres.value, [], releaseYears, []);

    if (genres.value.length > 0) {
      gamesByGenre.value = groupGamesByProvidedGenres(gamesList, genres.value);
    } else {
      gamesByGenre.value = groupGamesByGameGenres(gamesList);
    }

    chosenGame.value = gamesList[0]; // Suponiendo que el primer juego es el elegido
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to load games.');
    showToast(errorMessage, 'danger');
  }
};


const filteredGamesByGenre = computed(() => {
  return Object.fromEntries(Object.entries(gamesByGenre.value).filter(([, games]) => games.length > 0));
});

const tagChanged = (value: string) => {
  activeTag.value = value;
  fetchGames();
};

const goToGameDetails = (gameName: string | undefined) => {
  if (!gameName) {
    return;
  }
  //router.push({path: `/game/${name}`});
  router.push({name: 'GameDetails', params: {name: gameName}});
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(() => {
  fetchGames();
});

onIonViewWillEnter(() => {
  fetchGames();
});

</script>

