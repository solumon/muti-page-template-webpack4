import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Loading = () => import(/* webpackChunkName: "loading" */ '@/components/Loading');
const DiagnosticTest = () => import(/* webpackChunkName: "diagnostic-test" */ '../templates/DiagnosticTest');
const MicroSkills = () => import(/* webpackChunkName: "micro-skills" */ '../templates/MicroSkills');

const routes = [
    {
        path: '/',
        component: Loading,
        // redirect: '/diagnostic-test',
    },
    {
        path: '/diagnostic-test',
        component: DiagnosticTest,
    },
    {
        path: '/micro-skills',
        component: MicroSkills,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
