import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Newsiew from '../views/News.vue'
import MeView from '../views/Me.vue'
import XjcxView from '../views/XjcxView.vue' 
import EditView from '../views/EditView.vue' 
import AccountView from '../views/AccountView.vue' 
import AboutView from '../views/AboutView.vue' 
import LogoutView from '../views/LogoutView.vue' 

const routes = [
  { path: '/', component: HomeView },
  { path: '/new', component: Newsiew },
  { path: '/me', component: MeView },
  { path: '/xjcx', component: XjcxView } ,
  { path: '/edit', component: EditView } ,
  { path: '/account', component: AccountView } ,
  { path: '/about', component: AboutView } ,
  { path: '/logout', component: LogoutView } ,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router