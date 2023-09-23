import { createRouter, createWebHistory } from 'vue-router';
import PlayGround from '@/components/PlayGround.vue';

const routes = [
    {
        path: '/game',
        name: 'game',
        component: PlayGround,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
