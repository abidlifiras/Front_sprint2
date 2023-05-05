<template>
  <div>
    <caption class="wide-column">
      <div>{{ title }}</div>
      <div class="btn-group dropend">
      <button type="button" class="menuItem-active-link btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        {{ button }}
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Via excel</a></li>
        <li><a class="dropdown-item" @click="$router.push(addLink)">Via formuaire</a></li>
      </ul>
    </div>
    </caption>

    <input type="text" v-model="searchTerm" v-bind:placeholder="'Search'" />
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
            Actions
            <button
              type="button"
              class="btn btn-sm btn-secondary"
              data-bs-toggle="modal"
              href="#exampleModalToggleShow"
            >
              ...
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredData" v-bind:key="row.id">
          <td v-for="(column, index) in visibleColumns" :key="index" @click="goToDashbort(row.id)">
            {{ row[column.name] }}
          </td>
          <td>
            <router-link :to="getEditRoute(row)"
              ><button type="button" class="btn btn-sm btn-primary mt-1">Edit</button></router-link
            >

            <button
              @click="deleteRessource(row.id)"
              type="button"
              class="btn btn-sm btn-danger mt-1"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="addResource">
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
              <h1 class="modal-title h5" id="exampleModalToggleLabel">{{ button }}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <span class="visually-hidden">Close</span>
              </button>
            </div>
            <div class="modal-body">Choose an option</div>
            <div class="modal-footer">
              <button
                class="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
                @click="$router.push('Upload')"
              >
                Via Excel
              </button>
              <a
                class="btn btn-sm btn-secondary menuItem-active-link"
                data-bs-dismiss="modal"
                @click="$router.push(addLink)"
                >Via Formulaire</a
              >
            </div>
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
import axios from 'axios'

export default {
  name: 'DataTable',

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
      visibleColumnsNames: []
    }
  },
  created() {
    axios
      .get(this.endpoint)
      .then((response) => {
        this.data = response.data
        this.visibleColumnsNames = this.columns.map((column) => column.name)
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
    deleteRessource(id) {
      axios
        .delete(this.delete + '/' + id)
        .then(() => {
          window.location.reload()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getEditRoute(row) {
      let viewName = ''
      let params = { id: row.id }

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
        case '/contacts/edit/':
          viewName = 'EditContactView'
          break
        default:
          console.error(`Unknown edit value: ${this.edit}`)
      }

      return { name: viewName, params }
    },
    goToDashbort(id) {
      if (this.title === 'List of Applications') {
        this.$router.push({ path: `/assessments${id}` })
      }
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
