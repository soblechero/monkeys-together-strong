import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { getAuthToken } from '@/services/preferences';
import MainPage from '@/views/MainPage.vue';
//import AuthPage from '@/views/AuthPage.vue';
//import OnboardingPage from "@/views/OnboardingPage.vue";
//import GameDetailsPage from "@/views/GameDetailsPage.vue";

const routes: Array<RouteRecordRaw> = [
/*  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]*/
  {
    path: '/',
    component: MainPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        //component: () => import('@/views/SearchPage.vue'),
        component: () => import('@/views/Tab1Page.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        //component: () => import('@/views/ProfilePage.vue'),
        component: () => import('@/views/Tab3Page.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/onboarding',
    component: () => import('@/views/OnboardingPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/onboarding/preferences'
      },
      {
        path: 'preferences',
        component: () => import('@/views/PreferencesSelectionPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'get-started',
        component: () => import('@/views/GetStartedPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/details/:name',
    name: 'GameDetails',
    component: () => import ("@/views/GameDetailsPage.vue"),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guarda de navegación para verificar la autenticación
router.beforeEach(async (to, from, next) => {
  //const publicPages = ['/auth'];
  //const requiresAuth = !publicPages.includes(to.path);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!(await getAuthToken());

  if (requiresAuth && !isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
})

export default router
