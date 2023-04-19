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
            >Create Contact</a
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
            Choose application for {{ formData.fullName }} :
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
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Footer
  },

  data() {
    return {
      applications: [],
      databases: [],
      selectedApplications: [],
      formData: {},
      responseContact: {},
      formFields: [
        { name: 'fullName', label: 'Contact Name', type: 'text', required: true },
        { name: 'title', label: 'Contact Title', type: 'text', required: true },
        { name: 'department', label: 'Contact department', type: 'text', required: true },
        { name: 'email', label: 'Contact email', type: 'text', required: true }
      ],
      currentStep: 1,
      steps: [
        { title: 'Map Applications', isComplete: true },
        { title: 'Create Contacts', isComplete: false }
      ],
      addLink: 'serversView' // Ajouter la propriété addLink ici
    }
  },
  created() {
    axios.get('http://localhost:8088/api/v1/applications/all').then((response) => {
      this.applications = response.data
    })
  },
  methods: {
    submitApplications() {
      this.responseContact = JSON.stringify(this.formData)
      if (this.selectedApplications.length === 0) {
        axios
          .post('http://localhost:8088/api/v1/contacts', this.responseContact, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log(response.data)
            alert('Resource created successfully!')
            this.$router.push('/contacts')
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        axios
          .post('http://localhost:8088/api/v1/contacts', this.responseContact, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            const contactID = response.data.id
            this.selectedApplications.forEach((application) => {
              const applicationId = application.id
              axios
                .put(
                  `http://localhost:8088/api/v1/contacts/${contactID}/application/link/${applicationId}`,
                  this.responseContact,
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                )
                .then(() => {
                  alert('Resource created successfully!')
                  this.$router.push('/contacts')
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
