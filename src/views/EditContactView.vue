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
    { name: 'serverName', label: 'Server Name', type: 'text', required: true },
    { name: 'dataSource', label: 'Data Source', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text', required: true },
    { name: 'currentRamGb', label: 'Ram in GB', type: 'number', required: true }
  ],
  contactsView: [
    { name: 'fullName', label: 'Contact Name', type: 'text', required: true },
    { name: 'title', label: 'Contact Title', type: 'text', required: true },
    { name: 'department', label: 'Contact department', type: 'text', required: true },
    { name: 'email', label: 'Contact email', type: 'text', required: true }
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
    const formConfig = FORM_CONFIGS.contactsView
    this.formFields = formConfig || []

    this.endpoint = 'http://localhost:8088/api/v1/contacts'
  },
  mounted() {
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

      axios
        .put(`${this.endpoint}/${id}`, this.formData)
        .then((response) => {
          console.log(response.data)
          alert('Contacts' + this.formData.fullName + 'has been updated')
          this.$router.push({ path: '/contacts' })
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
