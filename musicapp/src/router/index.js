import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RecommendMusicList from '../views/RecommendMusicList.vue'
import NewestMusic from '../views/NewestMusic.vue'
import NewastMv from '../views/NewastMv.vue'
import Playlist from '../views/Playlist.vue'
import Search from '../views/Search.vue'
import Mv from '../views/Mv.vue'
import page404 from '../views/page404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    component: page404,
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/RecommendMusicList',
    name: 'RecommendMusicList',
    component: RecommendMusicList
  },
  {
    path: '/NewestMusic',
    name: 'NewestMusic',
    component: NewestMusic
  },
  {
    path: '/NewastMv',
    name: 'NewastMv',
    component: NewastMv
  },
  {
    path: '/Playlist',
    name: 'Playlist',
    component: Playlist
  },
  {
    path: '/Search',
    name: 'Search',
    component: Search
  },
  {
    path: '/Mv',
    name: 'Mv',
    component: Mv
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: "/dist/",
  routes
})
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router
