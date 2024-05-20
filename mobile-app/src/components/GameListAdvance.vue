<template>
  <ion-list>
    <ion-item-sliding v-for="game in displayedGames" :key="game.name">
      <ion-item button @click="goToGameDetails(game.name)" class="hover:bg-gray-100 transition">
        <ion-thumbnail slot="start">
          <img :src="game.thumb" :alt="game.name" class="object-cover w-full h-full"/>
        </ion-thumbnail>
        <ion-label>
          <h3 class="font-bold">{{ game.name }}</h3>
          <p class="text-sm">{{ game.summary }}</p>
        </ion-label>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option @click="() => toggleFavorite(game)" expandable>
          <ion-icon :icon="game.isFavorite ? heart : heartOutline"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
  <ion-infinite-scroll @ionInfinite="loadMoreGames">
    <ion-infinite-scroll-content></ion-infinite-scroll-content>
  </ion-infinite-scroll>
  <ion-toast
      :is-open="toast.isOpen"
      :message="toast.message"
      :color="toast.color"
      :duration="2000"
      @did-dismiss="toast.isOpen = false"
  ></ion-toast>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonThumbnail,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonToast,
  IonIcon
} from '@ionic/vue';
import {heart, heartOutline} from 'ionicons/icons';
import {defineProps, ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {Game as OriginalGame} from '@/types';
import {addGameToFavorites, removeGameFromFavorites} from '@/services/api/games';
import {isGameInPreferences} from "@/services/preferences";
import {handleError} from '@/utils';

interface Game extends OriginalGame {
  isFavorite?: boolean;
}

const props = defineProps<{
  games: Game[];
}>();


const router = useRouter();
const displayedGames = ref<Game[]>([]);
const pageSize = 5;
let currentPage = 1;

const toast = ref({
  isOpen: false,
  message: '',
  color: ''
});

const loadMoreGames = (event: Event) => {
  setTimeout(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    displayedGames.value.push(...props.games.slice(start, end));
    currentPage += 1;

    if (displayedGames.value.length >= props.games.length) {
      (event.target as HTMLIonInfiniteScrollElement).disabled = true;
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }, 500);
};

const goToGameDetails = (name: string) => {
  router.push({name: 'GameDetails', params: {name}});
};

const toggleFavorite = async (game: Game) => {
  try {
    const isFavorite = await isGameInPreferences(game.name);
    if (isFavorite) {
      await removeGameFromFavorites(game.name);
      game.isFavorite = false;
      showToast('Game removed from favorites', 'success');
    } else {
      await addGameToFavorites(game.name);
      game.isFavorite = true;
      showToast('Game added to favorites', 'success');
    }
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update favorites.');
    showToast(errorMessage, 'danger');
  }
};

const initializeFavorites = async () => {
  for (const game of displayedGames.value) {
    game.isFavorite = await isGameInPreferences(game.name);
  }
};

const showToast = (message: string, color: string) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

onMounted(async () => {
  displayedGames.value = props.games.slice(0, pageSize);
  await initializeFavorites();
});
</script>
