<template>
  <div class="mb-3">
    <div class="container">
      <div class="mt-5">
        <form>
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
        </form>
        <label class="form-label">Select Servers</label>
        <ComboBox :options="servers" @option-selected="onServerSelected"></ComboBox>
        <button @click.prevent="submitServers()" class="btn btn-primary">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ComboBox from '@/components/ComboBox.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Footer,
    ComboBox
  },

  data() {
    return {
      applications: [],
      databases: [],
      servers: [],
      selectedServers: [],
      formData: {},
      responseDatabase: {},
      formFields: [
        { name: 'nameDb', label: 'Database Name', type: 'text', required: true },
        { name: 'versionDb', label: 'Database Version', type: 'text', required: true }
      ],
      currentStep: 1,
      steps: [
        { title: 'Map Servers', isComplete: true },
        { title: 'Create Database', isComplete: false }
      ],
      addLink: 'serversView' // Ajouter la propriété addLink ici
    }
  },
  mounted() {
    axios
      .get('http://localhost:8080/api/v1/servers/all')
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
  },
  methods: {
    onServerSelected(selectedOptions) {
      this.selectedServers = selectedOptions
    },
    submitServers() {
      if (this.submitForm() == true) {
        this.responseDatabase = JSON.stringify(this.formData)
        if (this.selectedServers.length === 0) {
          axios
            .post('http://localhost:8080/api/v1/databases', this.responseDatabase, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              console.log(response.data)
              alert('Resource created successfully!')
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          axios
            .post('http://localhost:8080/api/v1/databases', this.responseDatabase, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const DbID = response.data.id
              this.selectedServers.forEach((server) => {
                const serverId = server.id
                axios
                  .put(
                    `http://localhost:8080/api/v1/databases/${DbID}/server/link/${serverId}`,
                    this.responseDatabase,
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

              alert('Resource created successfully!')
              window.location.reload()
            })
        }
      }
    },
    setCurrentStep(step) {
      this.currentStep = step
    },
    submitForm() {
      // Check if required fields are empty
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          alert(`${field.label} is required`)
          return false
        }
      }
      return true
    }
  }
}
</script>
