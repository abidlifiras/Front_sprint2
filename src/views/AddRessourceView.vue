<template>
  <div>
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
    { name: 'serverName', label: 'Server Name', type: 'text', required: true },
    { name: 'dataSource', label: 'Data Source', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text', required: true },
    { name: 'currentRamGb', label: 'Ram in GB', type: 'number', required: true }
  ],
  databasesView: [
    { name: 'nameDb', label: 'Database Name', type: 'text', required: true },
    { name: 'versionDb', label: 'Database Version', type: 'text', required: true }
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
      endpoint: ''
    }
  },

  created() {
    const from = this.$route.query.from

    const formConfig = FORM_CONFIGS[from]
    this.formFields = formConfig || []
    if (from === 'applicationsView') {
      this.endpoint = 'http://localhost:8080/api/v1/applications'
    } else if (from === 'serversView') {
      this.endpoint = 'http://localhost:8080/api/v1/servers'
    } else if (from === 'databasesView') {
      this.endpoint = 'http://localhost:8080/api/v1/databases'
    }
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
      if (this.endpoint === 'http://localhost:8080/api/v1/applications') {
        this.$router.push({
          name: 'MapAppServers',
          query: { formData: JSON.stringify(this.formData) } // add form data to query parameter
        })
      } else if (this.endpoint === 'http://localhost:8080/api/v1/servers') {
        this.$router.push({
          name: 'MapServerApps',
          query: { formData: JSON.stringify(this.formData) } // add form data to query parameter
        })
      } else if (this.endpoint === 'http://localhost:8080/api/v1/databases') {
        axios
          .post(this.endpoint, this.formData)
          .then((response) => {
            console.log(response.data)
            this.$router.push({ path: '/databases' })
          })
          .catch((error) => {
            console.log(error)
          })
      }
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
