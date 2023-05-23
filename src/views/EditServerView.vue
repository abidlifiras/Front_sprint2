<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <div class="container my-3">
            <div class="row justify-content-center">
              <div class="col-md-6">
                <label for="dc_select" class="form-label">Select a Datacenter:</label>
                <ComboBox :options="datacenters" :multiple="false"  @option-selected="onDatacenterSelected" :defaultValue="defaultValueDC"></ComboBox>
              </div>
              <div class="col-md-6">
                <label for="env-select" class="form-label">Select an Environment:</label>
                <ComboBox :options="environments" :multiple="false" @option-selected="onEnvironmentSelected" :defaultValue="defaultValueENV"></ComboBox> 
              </div>
            </div>
          </div>
      <form class="my-4">
        <div v-for="(field, index) in formFields" :key="index" class="mb-3">
          <template v-if="field.type === 'text'">
            <label class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
            <input
              :type="field.type"
              v-model="formData[field.name]"
              class="form-control"
              :style="field.style"
            />
          </template>
          <template v-else-if="field.type === 'textarea'">
            <label class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
            <textarea
              v-model="formData[field.name]"
              class="form-control"
              :style="field.style"
            ></textarea>
          </template>
          <template v-else-if="field.type === 'number'">
            <label class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
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
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import ComboBox from '../components/ComboBox.vue'

const FORM_CONFIGS = {
  applicationsView: [
    { name: 'appName', label: 'Application Name', type: 'text', required: true },
    {
      name: 'appDescription',
      label: 'Application Description',
      type: 'textarea',
      required: true,
      style: { height: '100px' }
    }
  ],
  serversView: [
    { name: 'datacenter', label: 'Datacenter', type: 'selectDCs', required: false},
    { name: 'environment', label: 'Environment', type: 'selectENVs', required: false},

    { name: 'serverName', label: 'Server Name', type: 'text', required: true },
    { name: 'ipAddress', label: 'Adress IP', type: 'text', required: true },
    { name: 'dataSource', label: 'Data Source', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text', required: true },
    { name: 'currentRamGb', label: 'Ram in GB', type: 'number', required: true },
    { name: 'currentNumberOfCores', label: 'Numbre Of Cores', type: 'number', required: true },
    { name: 'operatingSystem', label: 'Operating System', type: 'text', required: true },
    {
      name: 'serverNotes',
      label: 'Notes',
      type: 'textarea',
      required: true,
      style: { height: '100px' }
    }
  ]
}

export default {
  components: {
    Navbar,
    Footer,
    ComboBox
  },
  data() {
    return {
      formData: {},
      formFields: [],
      endpoint: '',
      datacenters: [],
      environments: [],
      defaultValueDC:null,
      defaultValueENV:null,
      selectedDataCenter: 0,
      selectedEnvironment: 0,
      formDataMinusEnvDc: {}
    }
  },

  created() {
    const formConfig = FORM_CONFIGS.serversView
    this.formFields = formConfig || []

    this.endpoint = 'http://localhost:8080/api/v1/servers'
  },
  mounted() {     
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
  

    const id = this.$route.params.id
    console.log(id)
    axios
      .get(`${this.endpoint}/${id}`)
      .then((response) => {
        this.formData = response.data
        this.defaultValueDC={id:this.formData.datacenter.id,name:this.formData.datacenter.name}
        console.log('haw Dc'+this.defaultValueDC)
        this.selectedDataCenter=this.formData.datacenter.id
        this.defaultValueENV={id:this.formData.environment.id ,name:this.formData.environment.environmentName}
        console.log('haw ENV'+this.defaultValueENV)

        this.selectedEnvironment=this.formData.environment.id

      })
      .catch((error) => {
        console.log(error)
      })
  },

  methods: {
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
      const id = this.$route.params.id
      this.envDcAdd(id,this.selectedDataCenter,this.selectedEnvironment)
      axios
        .put(`${this.endpoint}/${id}`, this.formData)
        .then((response) => {
          console.log(response.data)
          alert('Server' + this.formData.serverName + 'has been updated')
          this.$router.push({ path: '/servers' })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onDatacenterSelected(selectedOption) {
      this.selectedDataCenter = selectedOption.id
    },
    onEnvironmentSelected(selectedOption) {
      this.selectedEnvironment = selectedOption.id
    },
  }
}
</script>

<style scoped>
.required {
  color: red;
}
</style>

<style>
.form-label {
  font-weight: bold;
}

.form-control {
  margin-bottom: 1rem;
}

.btn-primary {
  margin-top: 1rem;
}
</style>
