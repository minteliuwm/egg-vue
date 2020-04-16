import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home
  }, {
    path: '/about',
    component: About
  }]
});

router.beforeEach((to, from, next) => {
  to.meta.title && (document.title = to.meta.title);
  next();
});

export default router;
