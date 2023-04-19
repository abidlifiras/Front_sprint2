import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ApplicationsView from './views/ApplicationsView.vue'
import ServersView from './views/ServersView.vue'
import AddRessourceView from './views/AddRessourceView.vue'
import MapAppServers from './views/MapAppServers.vue'
import MapServerApps from './views/MapServerApps.vue'
import EditAppView from './views/EditAppView.vue'
import EditServerView from './views/EditServerView.vue'
import UploadExcel from './views/UploadExcel.vue'
import DatabaseView from './views/DatabaseView.vue'
import EditDatabaseView from './views/EditDatabaseView.vue'
import ContactView from './views/ContactView.vue'
import EditContactView from './views/EditContactView.vue'
import MapAppContacts from './views/MapAppContacts.vue'
import MapDb from './views/MapDB.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/applications', component: ApplicationsView },
    { path: '/servers', component: ServersView },
    { path: '/contacts', component: ContactView },
    { path: '/databases', component: DatabaseView },
    { path: '/ressources/add', component: AddRessourceView, props: true, name: 'AddRessourceView' },
    {
      path: '/application/servers',
      component: MapAppServers,
      props: (route) => ({ query: route.query }),
      name: 'MapAppServers'
    },
    {
      path: '/server/applications',
      component: MapServerApps,
      props: (route) => ({ query: route.query }),
      name: 'MapServerApps'
    },
    {
      path: '/database/servers',
      component: MapDb,
      props: (route) => ({ query: route.query }),
      name: 'MapDb'
    },
    {
      path: '/contact/applications',
      component: MapAppContacts,
      props: (route) => ({ query: route.query }),
      name: 'MapAppContacts'
    },
    { path: '/applications/edit/:id', component: EditAppView, props: true, name: 'EditAppView' },
    { path: '/servers/edit/:id', component: EditServerView, props: true, name: 'EditServerView' },
    {
      path: '/contacts/edit/:id',
      component: EditContactView,
      props: true,
      name: 'EditContactView'
    },

    {
      path: '/databases/edit/:id',
      component: EditDatabaseView,
      props: true,
      name: 'EditDatabaseView'
    },

    { path: '/Upload', component: UploadExcel }
  ]
})

const app = createApp(App)
app.use(router)

app.mount('#app')
