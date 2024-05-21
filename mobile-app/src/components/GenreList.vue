<template>
  <ion-list>
    <ion-item-sliding v-for="genre in genres" :key="genre">
      <ion-item @click="goToGenrePage(genre)" class="hover:bg-gray-100 transition" button>
        <ion-label>
          <h3>#{{ genre }}</h3>
        </ion-label>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option @click="toggleFavorite(genre)" :color="isFavorite(genre) ? 'danger' : 'success'">
          <ion-icon :icon="isFavorite(genre) ? removeCircle : addCircle" slot="icon-only"></ion-icon>
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
  IonItemOptions,
  IonItemOption,
  IonIcon
} from '@ionic/vue';
import {addCircle, removeCircle} from 'ionicons/icons';
import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {addGenreToFavorites, removeGenreFromFavorites} from '@/services/api';
import {getPreferenceGenres} from '@/services/preferences';
import {handleError} from '@/utils';

const props = defineProps<{
  genres: string[];
}>();

const emit = defineEmits(['update-favorites', 'show-toast']);

const router = useRouter();
const favorites = ref<string[]>([]);

const fetchFavorites = async () => {
  try {
    favorites.value = await getPreferenceGenres();
  } catch (error) {
    console.error('Failed to fetch favorite genres:', error);
  }
};

const goToGenrePage = (name: string) => {
  router.push({name: 'GenrePage', params: {name}});
};

const toggleFavorite = async (genre: string) => {
  try {
    if (isFavorite(genre)) {
      await removeGenreFromFavorites(genre);
      favorites.value = favorites.value.filter(fav => fav !== genre);
    } else {
      await addGenreToFavorites(genre);
      favorites.value.push(genre);
    }
    emit('update-favorites');
  } catch (error) {
    const errorMessage = handleError(error, 'Failed to update favorites.');
    emit('show-toast', errorMessage, 'danger');
  }
};

const isFavorite = (genre: string) => {
  return favorites.value.includes(genre);
};

onMounted(() => {
  fetchFavorites();
});

watch(() => props.genres, () => {
  fetchFavorites();
});

</script>
