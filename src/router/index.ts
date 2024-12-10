import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/views/layout/index.vue';

export const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'XBotS',
        component: () => import('@/views/XBotS/index.vue')
      },
      {
        path: 'xBOTModelSPlus',
        name: 'XBOTModelSPlus',
        component: () => import('@/views/XBotSPlus/index.vue')
      },
      {
        path: 'xBOTModelIC',
        name: 'XBOTModelIC',
        component: () => import('@/views/XBotSPlus/index.vue')
      },
      {
        path: 'xBOTModelTk',
        name: 'XBOTModelTk',
        component: () => import('@/views/XBotSPlus/index.vue')
      },
      {
        path: 'about',
        name: 'About Us',
        component: () => import('@/views/XBotSPlus/index.vue')
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/Contact/index.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
