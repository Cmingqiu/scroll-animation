import { createApp } from 'vue';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import './style.scss';
import App from './App.vue';
import router from '@/router';

gsap.registerPlugin(ScrollTrigger);
createApp(App).use(router).mount('#app');
