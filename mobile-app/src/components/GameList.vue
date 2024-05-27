<template>
  <ion-list lines="full">
    <ion-item-sliding v-for="game in games" :key="game.name">
      <ion-item @click="goToGamePage(game)" class="hover:bg-gray-100 transition" button>
        <ion-thumbnail slot="start" class="w-24 h-max">
          <img :src="game.thumb" :alt="game.name" class="object-cover w-full h-full"/>
        </ion-thumbnail>
        <ion-label>
          <h3>{{ game.name }}</h3>
          <p>{{ truncateSummary(game.summary) }}</p>
        </ion-label>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option @click="toggleFavorite(game)" :color="isFavorite(game.name) ? 'danger' : 'success'">
          <ion-icon :icon="isFavorite(game.name) ? removeCircle : addCircle" slot="icon-only"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonItemOptions,
  IonItemOption,
  IonIcon
} from '@ionic/vue';
import {addCircle, removeCircle} from 'ionicons/icons';
import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {addGameToFavorites, removeGameFromFavorites} from '@/services/api/games';
import {getPreferenceGames} from '@/services/preferences/games';
import {Game} from '@/types';
import {handleError} from '@/utils';

const props = defineProps<{
  games: Game[];
}>();

const emit = defineEmits(['update-favorites', 'show-toast']);

const router = useRouter();
const favorites = ref<string[]>([]);

const fetchFavorites = async () => {
  try {
    favorites.value = await getPreferenceGames();
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to fetch favorite games.');
    emit('show-toast', errorMessage, 'danger');
  }
};

const goToGamePage = (game: Game) => {
  router.push({name: 'GameDetails', params: {name: game.name}});
};

const toggleFavorite = async (game: Game) => {
  try {
    if (isFavorite(game.name)) {
      await removeGameFromFavorites(game.name);
      favorites.value = favorites.value.filter(fav => fav !== game.name);
    } else {
      await addGameToFavorites(game.name);
      favorites.value.push(game.name);
    }
    emit('update-favorites');
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update favorites.');
    emit('show-toast', errorMessage, 'danger');
  }
};

const isFavorite = (gameName: string) => {
  return favorites.value.includes(gameName);
};

const truncateSummary = (summary: string, maxLength: number = 99) => {
  return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
};

onMounted(() => {
  fetchFavorites();
});

watch(() => props.games, () => {
  fetchFavorites();
});

</script>
