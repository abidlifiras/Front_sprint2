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

import InterfacesView from './views/InterfacesView.vue'
import EditInterfaceView from './views/EditInterfaceView.vue'
import AddInterfaceView from './views/AddInterfaceView.vue'
import DataCenterView from './views/DataCenterView.vue'
import EditDataCenterView from './views/EditDataCenterView.vue'
import AddDataCenterView from './views/AddDataCenterView.vue'
import EnvironmentView from './views/EnvironmentView.vue'
import EditEnvironmentView from './views/EditEnvironmentView.vue'
import AddEnvironmentView from './views/AddEnvironmentView.vue'
import Assessment from './views/Assessment.vue'
import MainDashboard from './views/MainDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/assessments:id', component: Assessment },
    { path: '/applications', component: ApplicationsView },
    { path: '/datacenters', component: DataCenterView },
    { path: '/environments', component: EnvironmentView },
    { path: '/servers', component: ServersView },
    { path: '/contacts', component: ContactView },
    { path: '/databases', component: DatabaseView },

    { path: '/interfaces', component: InterfacesView, name: 'interfaceView' },
    { path: '/applications/:id', component: MainDashboard, name: 'MainDashboard' },

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
      path: '/datacenters/edit/:id',
      component: EditDataCenterView,
      props: true,
      name: 'EditDataCenterView'
    },
    {
      path: '/environments/edit/:id',
      component: EditEnvironmentView,
      props: true,
      name: 'EditEnvironmentView'
    },
    {
      path: '/interfaces/edit/:id1/:id2',
      component: EditInterfaceView,
      props: true,
      name: 'EditInterfaceView'
    },
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
    {
      path: '/interfaces/add',
      component: AddInterfaceView,
      props: true,
      name: 'AddInterfaceView'
    },
    {
      path: '/datacenters/add',
      component: AddDataCenterView,
      props: true,
      name: 'AddDataCenterView'
    },
    {
      path: '/environments/add',
      component: AddEnvironmentView,
      props: true,
      name: 'AddEnvironmentView'
    },

    { path: '/Upload', component: UploadExcel }
  ]
})

const app = createApp(App)
app.use(router)

app.mount('#app')
