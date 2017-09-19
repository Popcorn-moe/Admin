import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import Tags from '../components/tags/Tags'
import Users from '../components/users/Users'
import Authors from '../components/authors/Authors'
import { AddAnime, ListAnime } from '../components/animes';
Vue.use(Router)

export const routes = [
  {
    icon: 'home',
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    icon: 'people',
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    icon: 'video_library',
    path: '/animes',
    name: "Animes",
    submenus: [
      {
        icon: 'list',
        path: '/',
        name: 'List',
        component: ListAnime
      },
      {
        icon: 'add',
        path: '/add',
        name: 'Add',
        component: AddAnime
      }
    ]
  },
  {
    icon: 'label',
    path: '/tags',
    name: 'Tags',
    component: Tags
  },
  {
    icon: 'people',
    path: '/authors',
    name: 'Authors',
    component: Authors
  }
];

const router = new Router({
  routes: convert(routes),
  mode: 'history'
});

function convert(routes)
{
  let newRoutes = [];
  routes.forEach((v) =>
  {
    if(v.hasOwnProperty("submenus"))
    {
      v.submenus.forEach((s) => {
        s.path = v.path + s.path;
        newRoutes.push(s);
      })
    }
    else
      newRoutes.push(v);
  });

  return newRoutes;
}

export default router;
