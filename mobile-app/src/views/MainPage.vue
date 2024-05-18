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
      <ion-tab-bar slot="bottom" class="custom-shadow">
        <ion-tab-button tab="home" href="/home">
          <ion-icon aria-hidden="true" :icon="home"/>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon aria-hidden="true" :icon="search"/>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <ion-icon aria-hidden="true" :icon="person"/>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonIcon} from '@ionic/vue';
import {home, search, person} from 'ionicons/icons';
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
}
</style>