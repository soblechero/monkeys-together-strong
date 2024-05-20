<template>
  <ion-list lines="full">
    <ion-item
        v-for="game in games"
        :key="game.name"
        button
        @click="goToGameDetails(game.name)"
        class="hover:bg-gray-100 transition"
    >
      <ion-thumbnail slot="start" class="w-24 h-max">
        <img :src="game.thumb" :alt="game.name" class="w-full h-full"/>
      </ion-thumbnail>
      <ion-label>
        <h2 class="font-extrabold">{{ game.name }}</h2>
        <p class="text-sm">{{ game.summary }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel
} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {Game} from '@/types';

defineProps<{
  games: Game[];
}>();

const router = useRouter();

const goToGameDetails = (name: string) => {
  router.push({name: 'GameDetails', params: {name}});
};
</script>
