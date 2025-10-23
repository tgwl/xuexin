import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Newsiew from '../views/News.vue'
import MeView from '../views/Me.vue'
import XjcxView from '../views/XjcxView.vue' 

const routes = [
  { path: '/', component: HomeView },
  { path: '/new', component: Newsiew },
  { path: '/me', component: MeView },
  { path: '/xjcx', component: XjcxView } 
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router