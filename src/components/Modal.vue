<template>
  <div
    class="modal fade"
    id="exampleModalToggleServer"
    aria-hidden="true"
    aria-labelledby="exampleModalToggleLabel"
    tabindex="-1"
    
  > 
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title h5" id="exampleModalToggleLabel">Link servers to {{ appName }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal">
            <span class="visually-hidden">Close</span>
          </button>
        </div>
        <div class="modal-body">
         
          <ComboBox :options="servers" @option-selected="onServerSelected"  addRessource="Add server" ></ComboBox>
          <button @click.prevent="submitServers()" class="btn btn-primary" >Next</button>
        </div>
        
        
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
  



<!-- Button trigger modal -->


<!-- Modal -->
<div class="modal fade" id="exampleModaleee" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title h5" id="exampleModalLabel">Add and Link Server</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"><span class="visually-hidden">Close</span></button>
      </div>
      <div class="modal-body">
        <AddServer :appId="this.id"></AddServer>
      </div>
      
    </div>
  </div>
</div>




  <div
    class="modal fade"
    id="exampleModalToggleDatabase"
    aria-hidden="true"
    aria-labelledby="exampleModalToggleLabel"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title h5" id="exampleModalToggleLabel">
            Link databases to {{ appName }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal">
            <span class="visually-hidden">Close</span>
          </button>
        </div>
        <div class="modal-body">
          <ComboBox :options="databases" @option-selected="onDatabaseSelected"></ComboBox>
          <button @click.prevent="submitDatabases()" class="btn btn-primary">Next</button>
          
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
  

  

  <div
    class="modal fade"
    id="exampleModalToggleInterface"
    aria-hidden="true"
    aria-labelledby="exampleModalToggleLabel"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title h5" id="exampleModalToggleLabel">
            configure interfaces to {{ appName }}
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal">
            <span class="visually-hidden">Close</span>
          </button>
        </div>
        <div class="modal-body">
          <InterfaceConfig :appId="this.id" :appName="appName"></InterfaceConfig>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
  
</template>
<script>
import ComboBox from './ComboBox.vue'
import InterfaceConfig from './InterfaceConfiguration.vue'


import axios from 'axios'
import AddServer from './AddServer.vue'
export default {
  props: {
    appName: {
      type: String,
      required: true
    },
    id: Number,
    selectedLink: {
      type: String,
      default: 'Error'
    }
  },
  data() {
    return {
      servers: [],
      databases: [],
      selectedServers: [],
      selectedDatabases: [],
      button: false,
      
    }
  },
  mounted() {
    axios
      .get(`http://localhost:8080/api/v1/applications/${this.id}/non-linked-servers`)
      .then((response) => {
        const servers = response.data.map((server) => {
          return {
            id: server.id,
            name: server.serverName
          }
        })
        this.servers = servers
      })
      .catch((error) => {
        console.log(error)
      })

    axios
      .get(`http://localhost:8080/api/v1/applications/${this.id}/non-linked-databases`)
      .then((response) => {
        const databases = response.data.map((database) => {
          return {
            id: database.id,
            name: database.nameDb
          }
        })
        console.log(databases + 'databases')
        this.databases = databases
      })
      .catch((error) => {
        console.log(error)
      })

    console.log('Interfaces')
  },
  methods: {
    toggleButton(bool) {
      this.button = bool
    },
    onServerSelected(selectedOptions) {
      this.selectedServers = selectedOptions.map((option) => option.id)
    },
    onDatabaseSelected(selectedOptions) {
      this.selectedDatabases = selectedOptions.map((option) => option.id)
    },
    submitServers() {
      if (this.selectedServers.length === 0) {
        console.log('No servers selected')
      } else {
        this.selectedServers.forEach((server) => {
          const serverId = server
          console.log(serverId)
          axios
            .put(
              `http://localhost:8080/api/v1/applications/${this.id}/server/link2/${serverId}`,

              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
            .catch((error) => {
              console.error(error)
            })
        })
      }
    }
  },

  components: { ComboBox, AddServer, InterfaceConfig }
}
</script>