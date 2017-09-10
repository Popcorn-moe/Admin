import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import Tags from '../components/tags/Tags'

Vue.use(Router)

export const routes = [
  {
    icon: 'home',
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    icon: 'label',
    path: '/tags',
    name: 'Tags',
    component: Tags
  }
];

const router = new Router({
  routes,
  mode: 'history'
})

export default router;
