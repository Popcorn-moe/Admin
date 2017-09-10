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
    icon: 'video_library',
    path: '/animes',
    name: "Animes",
    submenus: [
      {
        icon: 'list',
        path: '/',
        name: 'List'
      },
      {
        icon: 'add',
        path: '/add',
        name: 'Add'
      }
    ]
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
});


export default router;
