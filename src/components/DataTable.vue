<template>
  <div>
    <caption class="wide-column">
      <div>{{ title }}</div>
      <div class="btn-group dropend">
        <button
          type="button"
          class="menuItem-active-link btn btn-sm btn-secondary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ button }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <a
              class="dropdown-item"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggle"
              >Via excel</a
            >
          </li>
          <li>
            <a
              v-if="button === 'Add Database'"
              class="dropdown-item"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggleDB"
              >Via formulaire</a
            >
            <a v-else class="dropdown-item" @click="GoToAddLink">Via formuaire</a>
          </li>
        </ul>
      </div>
    </caption>

    <input
      type="text"
      v-model="searchTerm"
      v-bind:placeholder="'Search'"
      class="form-control"
      style="width: 204px; height: 35px"
    />
    <table class="table table-hover">
      <thead>
        <tr>
          <th v-for="(column, index) in visibleColumns" :key="index" @click="sortBy(column.name)">
            {{ column.label }}
            <span
              v-if="sortColumn === column.name"
              v-bind:class="[sortDirection === 'asc' ? 'asc' : 'desc']"
            ></span>
          </th>
          <th class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                ...
              </button>
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                <div v-for="(column, index) in columns" :key="index">
                  <label class="dropdown-item">
                    <input
                      type="checkbox"
                      v-model="visibleColumnsNames"
                      v-bind:value="column.name"
                    />
                    {{ column.label }}
                  </label>
                </div>
              </ul>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredData" v-bind:key="row.id">
          <td v-for="(column, index) in visibleColumns" :key="index" @click="goToDashbort(row.id)">
            {{ row[column.name] }}
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-secondary">Actions</button>
              <button
                type="button"
                class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="deleteRessource(row.id)">Delete</a></li>
                <router-link :to="getEditRoute(row.id)">
                  <li><a class="dropdown-item" href="#">Edit</a></li>
                </router-link>
                <li v-if="title === 'List of Applications'">
                  <a class="dropdown-item" @click="onclickDownoald(row)">Download</a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="editResource">
      <div
        class="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title h5" id="exampleModalToggleLabel">Upload Via Excel</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <span class="visually-hidden">Close</span>
              </button>
            </div>
            <div class="modal-body">
              <UploadExcel></UploadExcel>
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="showAddDataBase">
      <div
        class="modal fade"
        id="exampleModalToggleDB"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title h5" id="exampleModalToggleLabel">Add Database</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <span class="visually-hidden">Close</span>
              </button>
            </div>
            <div class="modal-body">
              <MapDB></MapDB>
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="showColumns">
      <div
        class="modal fade"
        id="exampleModalToggleShow"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title h5" id="exampleModalToggleLabel">Select Columns</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <span class="visually-hidden">Close</span>
              </button>
            </div>
            <div class="modal-body">
              <div v-for="(column, index) in columns" :key="index">
                <label>
                  <input type="checkbox" v-model="visibleColumnsNames" v-bind:value="column.name" />
                  {{ column.label }}
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-sm btn-primary"
                data-bs-dismiss="modal"
                @click="saveVisibleColumns"
              >
                Save
              </button>
              <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isTemplateNode } from '@vue/compiler-core'
import UploadExcel from '../views/UploadExcel.vue'
import MapDB from '../views/MapDB.vue'
import axios from 'axios'
//import AddInterfaceView from '../views/AddInterfaceView.vue'

export default {
  components: {
    UploadExcel,
    MapDB
  },
  name: 'DataTable',
  //components: {AddInterfaceView},
  props: {
    endpoint: {
      type: String,
      required: true
    },
    delete: {
      type: String,
      required: true
    },
    edit: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Ressources List'
    },
    addLink: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      searchTerm: '',
      sortColumn: '',
      sortDirection: 'asc',
      visibleColumnsNames: [],
      noDC: 'no Dc ',
      noENV: 'no ENV '
    }
  },
  created() {
    axios
      .get(this.endpoint)
      .then((response) => {
        console.log(response.data)
        //testing on delete !!! not endpoint
        if (this.delete == 'http://localhost:8080/api/v1/interfaces') {
          this.data = response.data.map((item) => ({
            id: item.id,
            applicationSrc: item.applicationSrc.appName,
            applicationTarget: item.applicationTarget.appName,
            protocol: item.protocol,
            dataFormat: item.dataFormat,
            notes: item.notes,
            flow: item.flow,
            frequency: item.frequency,
            processingMode: item.processingMode
          }))
          this.visibleColumnsNames = this.columns.map((column) => column.name)
        } else if (this.delete == 'http://localhost:8080/api/v1/servers') {
          console.log(response.data)
          this.data = response.data.map((item) => ({
            id: item.id,
            environment: item.environment ? item.environment.environmentName : this.noENV,
            datacenter: item.datacenter ? item.datacenter.name : this.noDC,
            serverName: item.serverName,
            dataSource: item.dataSource,
            type: item.type,
            role: item.role,
            currentNumberOfCores: item.currentNumberOfCores,
            currentRamGb: item.currentRamGb,
            currentDiskGb: item.currentDiskGb,
            powerStatus: item.powerStatus,
            serverNotes: item.serverNotes,
            ipAddress: item.ipAddress,
            operatingSystem: item.operatingSystem
          }))
          this.visibleColumnsNames = this.columns.map((column) => column.name)
        } else {
          this.data = response.data
          this.visibleColumnsNames = this.columns.map((column) => column.name)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  computed: {
    filteredData() {
      let filtered = this.data
      if (this.searchTerm) {
        filtered = filtered.filter((row) => {
          return Object.values(row).some((val) => {
            return val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
          })
        })
      }

      if (this.sortColumn) {
        const column = this.columns.find((c) => c.name === this.sortColumn)
        filtered = filtered.sort((a, b) => {
          const valueA = a[this.sortColumn]
          const valueB = b[this.sortColumn]
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB)
          } else {
            return valueA - valueB
          }
        })

        if (this.sortDirection === 'desc') {
          filtered = filtered.reverse()
        }
      }

      return filtered
    },
    visibleColumns() {
      return this.columns.filter((column) => this.visibleColumnsNames.includes(column.name))
    }
  },
  methods: {
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    },
    onclickDownoald(row) {
      fetch(`http://127.0.0.1:5000/api/v1/generate_report/${row.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.target = '_blank'
          link.download = `${row.appName}.pdf`
          link.click()
        })
        .catch((error) => {
          console.error('Erreur lors du téléchargement du PDF', error)
        })
    },
    deleteRessource(id) {
      const confirmed = window.confirm('Are you sure you want to delete this resource?')
      if (!confirmed) {
        return
      }
      
        axios
          .delete(this.delete + '/' + id)
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.error(error)
          })
      
    },
    getEditRoute(id) {
      let viewName = ''
      let params
      //  params = { id1: row.id.applicationSrcId , id2: row.id.applicationTargetId }
     
        params = { id: id }
        
      

      switch (this.edit) {
        case '/applications/edit/':
          viewName = 'EditAppView'
          break
        case '/servers/edit/':
          viewName = 'EditServerView'
          break
        case '/databases/edit/':
          viewName = 'EditDatabaseView'
          break
        case '/interfaces/edit/':
          viewName = 'EditInterfaceView'
          break
        case '/contacts/edit/':
          viewName = 'EditContactView'
          break
        case '/datacenters/edit/':
          viewName = 'EditDataCenterView'
          break
        case '/environments/edit/':
          viewName = 'EditEnvironmentView'
          break
        default:
          console.error(`Unknown edit value: ${this.edit}`)
      }

      return { name: viewName, params }
    },
    goToDashbort(id) {
      if (this.title === 'List of Applications') {
        this.$router.push({ path: `/applications/${id}` })
      }
    },
    GoToAddLink() {
      this.$router.push({ path: `${this.addLink}` })
    }
  }
}
</script>
<style>
.wide-column {
  display: flex;
  align-items: center;
}

.menuItem-active-link {
  margin-left: 10px;
}
</style>
