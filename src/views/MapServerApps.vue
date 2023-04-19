<template>
  <div>
    <Navbar></Navbar>
    <nav class="stepped-process" aria-label="Checkout process">
      <p class="float-start mt-2 me-2 fw-bold d-sm-none">Step</p>
      <ol>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 1, complete: currentStep > 1 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="1. Create Server"
            @click.prevent="setCurrentStep(1)"
            >Create Server</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 2, complete: currentStep > 2 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="2. Map Databases"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map Applications</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 3, complete: currentStep > 2 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="2. Map Databases"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map Databases</a
          >
        </li>
      </ol>
    </nav>
    <div class="container my-5 mx-5">
      <div v-if="currentStep === 1">
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
      <div v-if="currentStep === 2">
        <div v-if="applications.length">
          <h1 class="d-flex flex-column justify-content-center align-items-center">
            Choose application for {{ formData.serverName }} : :
          </h1>
          <form
            @submit.prevent="submitApplications"
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="list-group">
              <div
                v-for="application in applications"
                :key="application.id"
                class="list-group-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  :value="application"
                  v-model="selectedApplications"
                  class="form-check-input"
                />
                <label class="form-check-label ms-3">{{ application.appName }}</label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Next</button>
          </form>
        </div>
      </div>
      <div v-if="currentStep === 3">
        <div v-if="databases.length">
          <h1 class="d-flex flex-column justify-content-center align-items-center">
            Choose database for {{ formData.serverName }} : :
          </h1>
          <form
            @submit.prevent="submitDatabases"
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="list-group">
              <div
                v-for="database in databases"
                :key="database.id"
                class="list-group-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  :value="database"
                  v-model="selectedDatabases"
                  class="form-check-input"
                />
                <label class="form-check-label ms-3">{{ database.nameDb }}</label>
              </div>
            </div>
            <button @click.prevent="submitDatabases" type="submit" class="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import AddRessourceView from './AddRessourceView.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Footer,
    AddRessourceView
  },

  data() {
    return {
      applications: [],
      databases: [],
      selectedApplications: [],
      selectedDatabases: [],
      formData: {},
      responseServer: {},
      formFields: [
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
      ],
      currentStep: 1,
      steps: [
        { title: 'Map Applications', isComplete: true },
        { title: 'Map Databases', isComplete: false },
        { title: 'Create Server', isComplete: false }
      ],
      addLink: 'serversView' // Ajouter la propriété addLink ici
    }
  },
  created() {
    axios.get('http://localhost:8088/api/v1/applications/all').then((response) => {
      this.applications = response.data
    })
    axios.get('http://localhost:8088/api/v1/databases/non-archived').then((response) => {
      this.databases = response.data
    })
  },
  methods: {
    submitApplications() {
      this.currentStep = 3
      console.log(this.selectedApplications)
      console.log(this.formData)
    },
    submitDatabases() {
      this.responseServer = JSON.stringify(this.formData)
      console.log(this.responseServer)

      if (this.selectedApplications.length === 0) {
        if (this.selectedDatabases.length === 0) {
          axios
            .post('http://localhost:8088/api/v1/servers', this.responseServer, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              console.log(response.data)
              alert('Resource created successfully!')
              this.$router.push('/servers')
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          axios
            .post('http://localhost:8088/api/v1/servers', this.responseServer, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const serverID = response.data.id
              this.selectedDatabases.forEach((database) => {
                const databaseId = database.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/servers/${serverID}/database/link/${databaseId}`,
                    this.responseServer,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/servers')
                  })
              })
            })
        }
      } else {
        if (this.selectedDatabases.length === 0) {
          axios
            .post('http://localhost:8088/api/v1/servers', this.responseServer, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const serverID = response.data.id
              this.selectedApplications.forEach((application) => {
                const appId = application.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/servers/${serverID}/application/link/${appId}`,
                    this.responseServer,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/servers')
                  })
              })
            })
        } else {
          axios
            .post('http://localhost:8088/api/v1/servers', this.responseServer, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const serverID = response.data.id
              this.selectedApplications.forEach((application) => {
                const appId = application.id
                axios.put(
                  `http://localhost:8088/api/v1/servers/${serverID}/application/link/${appId}`,
                  this.responseServer,
                  { headers: { 'Content-Type': 'application/json' } }
                )
              })
              this.selectedDatabases.forEach((database) => {
                const databaseId = database.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/servers/${serverID}/database/link/${databaseId}`,
                    this.responseServer,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/servers')
                  })
              })
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
          return
        }
      }
      this.currentStep = 2
    }
  }
}
</script>
