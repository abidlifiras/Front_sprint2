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
    const formConfig = FORM_CONFIGS.databasesView
    this.formFields = formConfig || []

    this.endpoint = 'http://localhost:8088/api/v1/databases'
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
          alert('Database' + this.formData.serverName + 'has been updated')
          this.$router.push({ path: '/databases' })
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
