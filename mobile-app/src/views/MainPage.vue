<template>
  <ion-page>
<!--    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button default-href="/auth" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>-->
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon aria-hidden="true" :icon="homeIcon" />
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon aria-hidden="true" :icon="searchIcon" />
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <ion-icon aria-hidden="true" :icon="profileIcon" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonIcon} from '@ionic/vue';
import { home as homeIcon, search as searchIcon, person as profileIcon } from 'ionicons/icons';
</script>
