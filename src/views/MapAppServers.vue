<template>
  <div>
    <Navbar></Navbar>
    <div class="container my-5 mx-5">
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
            <label class="form-label">Select Servers</label>
            <ComboBox :options="servers" @option-selected="onServerSelected"></ComboBox>
            <br>
            <label class="form-label">Select Contacts</label>
            <ComboBox :options="contacts" @option-selected="onContactSelected"></ComboBox>

            <button  @click.prevent="submitApplications" class="btn btn-primary">Submit</button>          </form>
        </div>
      </div>
    </div>
    <Footer></Footer>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import ComboBox from '../components/ComboBox.vue'

export default {
  components: {
    Navbar,
    Footer,
    ComboBox
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
    axios.get('http://localhost:8080/api/v1/servers/non-archived')
    .then((response) => {
        const Servs = response.data.map((server) => {
          return {
            id: server.id,
            name: server.serverName
          }
        })
        this.servers = Servs
      })
    axios.get('http://localhost:8080/api/v1/contacts/non-archived')
    .then((response) => {
        const Contacts = response.data.map((contact) => {
          return {
            id: contact.id,
            name: contact.fullName
          }
        })
        this.contacts = Contacts
      })
  },
  methods: {
    submitServers() {
      this.currentStep = 3
      console.log(this.selectedApplications)
      console.log(this.formData)
    },
    submitApplications() {
      this.responseApplication = JSON.stringify(this.formData)
      console.log(this.responseApplication)
      if(this.submitForm()==true){
      if (this.selectedServers.length === 0) {
        if (this.selectedContacts.length === 0) {
          axios
            .post('http://localhost:8080/api/v1/applications', this.responseApplication, {
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
            .post('http://localhost:8080/api/v1/applications', this.responseApplication, {
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
                    `http://localhost:8080/api/v1/applications/${appID}/contact/link/${contactId}`,
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
            .post('http://localhost:8080/api/v1/applications', this.responseApplication, {
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
                    `http://localhost:8080/api/v1/applications/${appID}/server/link/${serverId}`,
                    this.responseApplication,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {})
              })
              alert('Resource created successfully!')
              this.$router.push('/applications')
            })
        } else {
          axios
            .post('http://localhost:8080/api/v1/applications', this.responseApplication, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              const applicationID = response.data.id
              this.selectedServers.forEach((server) => {
                const serverId = server.id
                axios.put(
                  `http://localhost:8080/api/v1/applications/${applicationID}/server/link/${serverId}`,
                  this.responseApplication,
                  { headers: { 'Content-Type': 'application/json' } }
                )
              })
              this.selectedContacts.forEach((contact) => {
                const contactId = contact.id
                axios
                  .put(
                    `http://localhost:8080/api/v1/applications/${applicationID}/contact/link/${contactId}`,
                    this.responseApplication,
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(() => {})
              })
              alert('Resource created successfully!')
              this.$router.push('/applications')
            })
        }
      }}
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
      return true
    },
    onContactSelected(selectedOptions){
      this.selectedContacts=selectedOptions
    },
    onServerSelected(selectedOptions){
      this.selectedServers=selectedOptions
    }
  }
}
</script>
