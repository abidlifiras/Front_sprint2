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
            title="1. Create Database"
            @click.prevent="setCurrentStep(1)"
            >Create Database</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 2, complete: currentStep > 2 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="2. Map Servers"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map Servers</a
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
        <div v-if="servers.length">
          <h1 class="d-flex flex-column justify-content-center align-items-center">
            Choose servers for {{ formData.nameDb }} :
          </h1>
          <div>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label>Select which Framework you have knowledge</label>
                <select ref="framework" v-model="selectedServers" multiple class="form-control">
                  <option v-for="server in servers" :value="server">{{ server.serverName }}</option>
                </select>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary mt-3">Submit</button>
              </div>
            </form>
            <br />
          </div>
          <button type="submit" class="btn btn-primary mt-3">Next</button>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import Dropdown from '@/components/Dropdown.vue'

export default {
  components: {
    Navbar,
    Footer,
    Dropdown
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
  created() {
    axios.get('http://localhost:8088/api/v1/servers/all').then((response) => {
      this.servers = response.data
      console.log(this.selectedServers)
    })
  },
  methods: {
    submitServers() {
      this.responseDatabase = JSON.stringify(this.formData)
      if (this.selectedServers.length === 0) {
        axios
          .post('http://localhost:8088/api/v1/databases', this.responseDatabase, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log(response.data)
            alert('Resource created successfully!')
            this.$router.push('/databases')
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        axios
          .post('http://localhost:8088/api/v1/databases', this.responseDatabase, {
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
                  `http://localhost:8088/api/v1/databases/${DbID}/server/link/${serverId}`,
                  this.responseDatabase,
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                )
                .then(() => {
                  alert('Resource created successfully!')
                  this.$router.push('/databases')
                })
            })
          })
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
