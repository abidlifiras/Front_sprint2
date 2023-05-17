<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <form class="my-4">
        <div v-for="(field, index) in formFields" :key="index" class="mb-3">
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
          <template v-else-if="field.type === 'selectDCs'">
            <select
              v-model="formData[field.name]"
              class="form-select"
              :style="field.style"
              :required="field.required"
            >
              <option v-for="option in datacenters" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </template>
          <template v-else-if="field.type === 'selectENVs'">
            <select
              v-model="formData[field.name]"
              class="form-select"
              :style="field.style"
              :required="field.required"
            >
              <option v-for="option in environments" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
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
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

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
    { name: 'datacenter', label: 'Datacenter', type: 'selectDCs', required: true },
    { name: 'environment', label: 'Environment', type: 'selectENVs', required: true },

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
    Footer
  },
  data() {
    return {
      formData: {},
      formFields: [],
      endpoint: '',
      datacenters: [],
      environments: [],
      formDataMinusEnvDc: {}
    }
  },

  created() {
    const formConfig = FORM_CONFIGS.serversView
    this.formFields = formConfig || []

    this.endpoint = 'http://localhost:8080/api/v1/servers'
  },
  mounted() {
    axios
      .get('http://localhost:8080/api/v1/environments/non-archived')
      .then((response) => {
        this.environments = response.data.map((env) => ({
          label: env.environmentName,
          value: env.id
        }))
      })
      .catch((error) => {
        console.log(error)
      })
    axios
      .get('http://localhost:8080/api/v1/datacenters/non-archived')
      .then((response) => {
        this.datacenters = response.data.map((dc) => ({
          label: dc.name,
          value: dc.id
        }))
      })
      .catch((error) => {
        console.log(error)
      })

    const id = this.$route.params.id
    console.log(id)
    axios
      .get(`${this.endpoint}/${id}`)
      .then((response) => {
        this.formData = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },

  methods: {
    submitForm() {
      // Check if required fields are empty
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          alert(`${field.label} is required`)
          return
        }
      }
      const id = this.$route.params.id
      this.formDataMinusEnvDc = {
        environment: this.formData.environment,
        datacenter: this.formData.datacenter
      }
      delete this.formData.environment
      delete this.formData.datacenter

      axios
        .put(`${this.endpoint}/${id}`, this.formData)
        .then((response) => {
          axios
            .put(
              `http://localhost:8080/api/v1/servers/${id}/datacenter/link/${this.formDataMinusEnvDc.datacenter}`
            )
            .then(() => {
              axios.put(
                `http://localhost:8080/api/v1/servers/${id}/environment/link/${this.formDataMinusEnvDc.environment}`
              )
            })

          console.log(response.data)
          alert('Server' + this.formData.serverName + 'has been updated')
          this.$router.push({ path: '/servers' })
        })
        .catch((error) => {
          console.log(error)
        })
    }
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
