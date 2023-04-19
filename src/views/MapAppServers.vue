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
            title="1. Create Server"
            @click.prevent="setCurrentStep(1)"
            >Create Application</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 2, complete: currentStep > 1 }"
        >
          <a
            class="stepped-process-link"
            title="2. Map Servers"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map servers</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 3, complete: currentStep > 2 }"
        >
          <a
            class="stepped-process-link"
            title="2. Map Contacts"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map Contacts</a
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
            Choose Servers for {{ formData.appName }} :
          </h1>
          <form
            @submit.prevent="submitServers"
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="list-group">
              <div
                v-for="server in servers"
                :key="server.id"
                class="list-group-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  :value="server"
                  v-model="selectedServers"
                  class="form-check-input"
                />
                <label class="form-check-label ms-3">{{ server.serverName }}</label>
              </div>
              <button type="submit" class="btn btn-primary mt-3">Next</button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="currentStep === 3">
        <div v-if="contacts.length">
          <h1 class="d-flex flex-column justify-content-center align-items-center">
            Choose Contacts for {{ formData.appName }} :
          </h1>
          <form
            @submit.prevent="submitContacts"
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="list-group">
              <div
                v-for="contact in contacts"
                :key="contact.id"
                class="list-group-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  :value="contact"
                  v-model="selectedContacts"
                  class="form-check-input"
                />
                <label class="form-check-label ms-3"
                  >{{ contact.fullName }} : {{ contact.title }}
                </label>
              </div>
            </div>
            <button @click.prevent="submitContacts" type="submit" class="btn btn-primary mt-3">
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
      servers: [],
      contacts: [],
      selectedServers: [],
      selectedContacts: [],
      formData: {},
      responseApplication: {},
      formFields: [
        { name: 'appName', label: 'Application Name', type: 'text', required: true },
        {
          name: 'appDescription',
          label: 'Application Description',
          type: 'textarea',
          required: true,
          style: { height: '100px' }
        }
      ],
      currentStep: 1,
      steps: [
        { title: 'Map Servers', isComplete: false },
        { title: 'Map Contact', isComplete: false },
        { title: 'Create Application', isComplete: false }
      ]
    }
  },
  created() {
    axios.get('http://localhost:8088/api/v1/servers/non-archived').then((response) => {
      this.servers = response.data
    })
    axios.get('http://localhost:8088/api/v1/contacts/non-archived').then((response) => {
      this.contacts = response.data
    })
  },
  methods: {
    submitServers() {
      this.currentStep = 3
      console.log(this.selectedApplications)
      console.log(this.formData)
    },
    submitContacts() {
      this.responseApplication = JSON.stringify(this.formData)
      console.log(this.responseApplication)

      if (this.selectedServers.length === 0) {
        if (this.selectedContacts.length === 0) {
          axios
            .post('http://localhost:8088/api/v1/applications', this.responseApplication, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              console.log(response.data)
              alert('Resource created successfully!')
              this.$router.push('/applications')
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          axios
            .post('http://localhost:8088/api/v1/applications', this.responseApplication, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const appID = response.data.id
              this.selectedContacts.forEach((contact) => {
                const contactId = contact.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/applications/${appID}/contact/link/${contactId}`,
                    this.responseApplication,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/applications')
                  })
              })
            })
        }
      } else {
        if (this.selectedContacts.length === 0) {
          axios
            .post('http://localhost:8088/api/v1/applications', this.responseApplication, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const appID = response.data.id
              this.selectedServers.forEach((server) => {
                const serverId = server.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/applications/${appID}/server/link/${serverId}`,
                    this.responseApplication,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/applications')
                  })
              })
            })
        } else {
          axios
            .post('http://localhost:8088/api/v1/applications', this.responseApplication, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const applicationID = response.data.id
              this.selectedServers.forEach((server) => {
                const serverId = server.id
                axios.put(
                  `http://localhost:8088/api/v1/applications/${applicationID}/server/link/${serverId}`,
                  this.responseApplication,
                  { headers: { 'Content-Type': 'application/json' } }
                )
              })
              this.selectedContacts.forEach((contact) => {
                const contactId = contact.id
                axios
                  .put(
                    `http://localhost:8088/api/v1/applications/${applicationID}/contact/link/${contactId}`,
                    this.responseApplication,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {
                    alert('Resource created successfully!')
                    this.$router.push('/applications')
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
