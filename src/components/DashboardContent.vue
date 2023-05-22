<template>
  <div>
    <div class="container mt-4">
      <div class="col-md-9 col-lg-9">
        <div class="d-flex align-items-center">
          <h3 class="text-left">Technical gallery :</h3>
          <h4 style="padding-top: 4px; padding-left: 7px">{{ selectedLink }} list</h4>
        </div>
        <a
          v-if="selectedLink === 'Servers'"
          class="btn btn-secondary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalToggleServer"
          >Link {{ selectedLink.toLowerCase() }}</a
        >
        <a
          v-if="selectedLink === 'Databases'"
          class="btn btn-secondary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalToggleDatabase"
          >Link {{ selectedLink.toLowerCase() }}</a
        >
        <a
          v-if="selectedLink === 'Interfaces'"
          class="btn btn-secondary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalToggleInterface"
          >Configure {{ selectedLink.toLowerCase() }}</a
        >
        <Modal :appName="appName" :id="id" :selectedLink="selectedLink"></Modal>
      </div>

      <new-data-table :headers="passHeaders()" :apiUrl="passUrl()" ></new-data-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Modal from '@/components/Modal.vue'
import NewDataTable from '@/components/NewDataTable.vue'
export default {
  components: {
    NewDataTable,
    Modal
  },
  props: {
    selectedLink: {
      type: String,
      default: 'Error'
    },
    id: Number,
    appName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      serverHeaders: [
        {
          name: 'serverName',
          label: 'Server Name'
        },
        {
          name: 'ipAddress',
          label: 'IP Address'
        },
        {
          name: 'dataSource',
          label: 'Data Source'
        },
        {
          name: 'type',
          label: 'Type'
        },
        {
          name: 'currentRamGb',
          label: 'RAM in GB',
          type: 'number',
          required: true
        },
        {
          name: 'currentNumberOfCores',
          label: 'Number of Cores'
        },
        {
          name: 'operatingSystem',
          label: 'Operating System'
        },
        {
          name: 'serverNotes',
          label: 'Notes',
          type: 'textarea'
        },
        {
          name: 'environment',
          label: 'Environment'
        },
        {
          name: 'datacenter',
          label: 'Datacenter'
        }
      ],
      DatabaseHeaders: [
        {
          name: 'nameDb',
          label: 'Database Name'
        },
        {
          name: 'versionDb',
          label: 'Database Version'
        }
      ],
      InterfaceHeaders: [
        {
          name: 'applicationSrc',
          label: 'Source'
        },
        {
          name: 'applicationTarget',
          label: 'Target'
        },
        {
          name: 'protocol',
          label: 'Protocol'
        },
        {
          name: 'dataFormat',
          label: 'Data Format'
        },
        {
          name: 'notes',
          label: 'notes'
        },
        {
          name: 'flow',
          label: 'Flow'
        },
        {
          name: 'frequency',
          label: 'Frequency'
        },
        {
          name: 'processingMode',
          label: 'Processing Mode'
        }
      ],
      headers: [],
    }
  },

  methods: {
    passHeaders() {
      if (this.selectedLink === 'Servers') {
        this.headers = this.serverHeaders
      } else if (this.selectedLink === 'Databases') {
        this.headers = this.DatabaseHeaders
      } else {
        this.headers = this.InterfaceHeaders
        
      }
      return this.headers
    },
    passUrl() {
      if (this.selectedLink === 'Servers') {
        return `http://localhost:8080/api/v1/applications/${this.id}/servers`
      } else if (this.selectedLink === 'Databases') {
        return `http://localhost:8080/api/v1/applications/${this.id}/databases`
      } else {
        return `http://localhost:8080/api/v1/applications/${this.id}/interfaces`
      }
    }
  }
}
</script>
