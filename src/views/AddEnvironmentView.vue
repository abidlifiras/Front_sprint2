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
            <template v-else-if="field.type === 'select'">
              <select v-model="formData[field.name]" class="form-select" :style="field.style">
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </template>
          </div>
          <button @click.prevent="submitForm" class="btn btn-primary">Next</button>
        </form>
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
      environments: [],

      formData: {},
      responseEnvironments: {},
      formFields: [
        { name: 'environmentName', label: 'ENV Name', type: 'text', required: true },
        { name: 'description', label: 'description', type: 'textarea', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'PROD', value: 'PROD' },
            { label: 'PREPROD', value: 'PREPROD' },
            { label: 'UAT', value: 'UAT' },
            { label: 'QA', value: 'QA' },
            { label: 'DEV', value: 'DEV' },
            { label: 'STAGING', value: 'STAGING' },
            { label: 'TEST', value: 'TEST' }
          ]
        }
      ]
    }
  },
  created() {},
  methods: {
    submitForm() {
      // Check if required fields are empty
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          alert(`${field.label} is required`)
          return
        }
      }
      this.responseEnvironments = JSON.stringify(this.formData)

      axios
        .post('http://localhost:8080/api/v1/environments', this.responseEnvironments, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log(response.data)
          alert('Resource created successfully!')
          this.$router.push('/environments')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}
</script>
