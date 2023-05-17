<template>
    <div>
          <div class="container my-3">
            <div class="row justify-content-center">
              <div class="col-md-6">
                <label for="dc_select" class="form-label">Select a Datacenter:</label>
                <ComboBox :options="datacenters" :multiple="false"  @option-selected="onDatacenterSelected"></ComboBox>
              </div>
              <div class="col-md-6">
                <label for="env-select" class="form-label">Select an Environment:</label>
                <ComboBox :options="environments" :multiple="false" @option-selected="onEnvironmentSelected"></ComboBox> 
              </div>
            </div>
          </div>
          <div class="container">
            <form class="my-4">
              <div v-for="(field, index) in formFields" :key="index" class="mb-1">
                <label class="form-label">
                  {{ field.label }}
                  <span v-if="field.required" class="required">*</span>
                </label>
                <template v-if="field.type === 'text'">
                  <input
                    :type="field.type"
                    v-model="formData[field.name]"
                    class="form-control"
                    :style="field.style"
                  />
                </template>
                <template v-else-if="field.type === 'textarea'">
                  <textarea
                    v-model="formData[field.name]"
                    class="form-control"
                    :style="field.style"
                  ></textarea>
                </template>
                <template v-else-if="field.type === 'number'">
                  <input
                    v-model="formData[field.name]"
                    class="form-control"
                    :style="field.style"
                    type="number"
                  />
                </template>
              </div>
              <button @click.prevent="submitForm" class="btn btn-primary">Next</button>
            </form>
          </div>
      </div>
      
    
  </template>
  
  <script>

  
  import axios from 'axios'
  import ComboBox from './ComboBox.vue'
  
  export default {
  components:{
    ComboBox
  },
    
  props: {
    appId:Number
  },
    data() {
      return {
        
        environments: [],
        datacenters: [],
        selectedDataCenter: {},
        selectedEnvironment: {},
        formData: {},
        responseServer: {},
        formFields: [
          { name: 'serverName', label: 'Server Name', type: 'text', required: true },
          { name: 'ipAddress', label: 'IP Address', type: 'text', required: true },
          { name: 'dataSource', label: 'Data Source', type: 'text', required: true },
          { name: 'type', label: 'Type', type: 'text', required: true },
          { name: 'currentRamGb', label: 'Ram in GB', type: 'number', required: true },
          { name: 'currentNumberOfCores', label: 'Number Of Cores', type: 'number', required: true },
          { name: 'operatingSystem', label: 'Operating System', type: 'text', required: true },
          {
            name: 'serverNotes',
            label: 'Notes',
            type: 'textarea',
            required: false,
            style: { height: '100px' }
          }
        ],
        
      
      }
    },
    created() {
      
     
        axios.get('http://localhost:8080/api/v1/environments/non-archived').then((response) => {
          const Environments = response.data.map((environment) => {
          return {
            id: environment.id,
            name: environment.environmentName
          }
        })
          this.environments = Environments
        }),
        axios.get('http://localhost:8080/api/v1/datacenters/non-archived').then((response) => {
          const DCs = response.data.map((datacenter) => {
          return {
            id: datacenter.id,
            name: datacenter.name
          }
        })
          this.datacenters = DCs
        })
    },
    methods: {
      onDatacenterSelected(selectedOption) {
      this.selectedDataCenter = selectedOption
    },
    onEnvironmentSelected(selectedOption) {
      this.selectedEnvironment = selectedOption
      console.log(this.selectedEnvironment)
    },
      
      envDcAdd(resp, dcId, envId) {
        return new Promise((resolve) => {
          if (dcId && envId) {
            axios
              .put(`http://localhost:8080/api/v1/servers/${resp}/datacenter/link/${dcId}`)
              .then(() => {
                axios
                  .put(`http://localhost:8080/api/v1/servers/${resp}/environment/link/${envId}`)
                  .then(() => {
                    resolve()
                  })
                  .catch(console.error)
              })
              .catch(console.error)
          } else if (dcId) {
            axios
              .put(`http://localhost:8080/api/v1/servers/${resp}/datacenter/link/${dcId}`)
              .catch(console.error)
          } else if (envId) {
            axios
              .put(`http://localhost:8080/api/v1/servers/${resp}/environment/link/${envId}`)
              .catch(console.error)
          } else {
            console.log('nothing to map')
          }
        })
      },
      
      
      submitForm() {
        // Check if required fields are empty
        for (const field of this.formFields) {
          if (field.required && !this.formData[field.name]) {
            alert(`${field.label} is required`)
            return
          }
        }
        
        this.responseServer = JSON.stringify(this.formData)

        axios
              .post('http://localhost:8080/api/v1/servers', this.responseServer, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then((response) => {

              
                this.envDcAdd(response.data.id, this.selectedDataCenter.id, this.selectedEnvironment.id)
                  .then(() => {
                    
                axios
                    .put(
              `http://localhost:8080/api/v1/applications/${this.appId}/server/link2/${response.data.id}`,

              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            ).then(() => {
                alert('Resource created and linked successfully!')
                    window.location.reload()
            })
            .catch((error) => {
              console.error(error)
            })


                  })
                  .catch((error) => {
                    console.error(error)
                  })
              })
              .catch((error) => {
                console.error(error)
              })
      }
    }
  }
  </script>
  