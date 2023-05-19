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
          <template v-else-if="field.type === 'select'">
            <select
              v-model="formData[field.name]"
              class="form-select"
              :style="field.style"
              :required="field.required"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </template>
          <template v-else-if="field.type === 'selectApps'">
            <select
              v-model="formData[field.name]"
              class="form-select"
              :style="field.style"
              :required="field.required"
            >
              <option v-for="option in applications" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
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

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      formData: {},
      formFields: [],
      endpoint: '',
      applications: []
    }
  },

  mounted() {
    axios
      .get('http://localhost:8080/api/v1/applications')
      .then((response) => {
        this.applications = response.data.map((app) => ({
          label: app.appName,
          value: app.id
        }))

        console.log(this.applications)
      })
      .catch((error) => {
        console.log(error)
      })
    const FORM_CONFIGS = {
      interfacesView: [
        { name: 'applicationSrc', label: 'Source app', type: 'selectApps', required: true },
        { name: 'applicationTarget', label: 'Target app', type: 'selectApps', required: true },
        { name: 'protocol', label: 'Protocol', type: 'text', required: true },
        { name: 'dataFormat', label: 'Data format', type: 'text', required: true },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          required: true,
          style: { height: '100px' }
        },
        {
          name: 'flow',
          label: 'Flow',
          type: 'select',
          required: true,
          options: [
            { label: 'EXTERNAL', value: 'EXTERNAL' },
            { label: 'INTERNAL', value: 'INTERNAL' }
          ]
        },
        {
          name: 'frequency',
          label: 'Frequency',
          type: 'select',
          required: true,
          options: [
            { label: 'HOURLY', value: 'HOURLY' },
            { label: 'DAILY', value: 'DAILY' },
            { label: 'WEEKLY', value: 'WEEKLY' },
            { label: 'MONTHLY', value: 'MONTHLY' },
            { label: 'ON_DEMAND', value: 'ON_DEMAND' }
          ]
        },
        {
          name: 'processingMode',
          label: 'Processing mode',
          type: 'select',
          required: true,
          options: [
            { label: 'REAL_TIME', value: 'REAL_TIME' },
            { label: 'BATCH', value: 'BATCH' }
          ]
        }
      ]
    }

    const formConfig = FORM_CONFIGS.interfacesView
    this.formFields = formConfig || []

    this.endpoint = 'http://localhost:8080/api/v1/interfaces'

    const id = this.$route.params.id
    
    

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
      console.log("el formdata melowel")
      console.log(this.formData)
      console.log("el formdata melowel")
      // Check if required fields are empty
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          alert(`${field.label} is required`)
          return
        }
      }

      const id = this.$route.params.id
      const idsrc = this.formData.applicationSrc
      const idtarget = this.formData.applicationTarget
      const protocol = this.formData.protocol
      const dataFormat = this.formData.dataFormat
      const notes = this.formData.notes
      const flow = this.formData.flow
      const frequency = this.formData.frequency
      const processingMode = this.formData.processingMode
      const x = {
        applicationSrc: idsrc.id ? { id: idsrc.id } : { id: idsrc },
        applicationTarget: idtarget.id ? { id: idtarget.id } : { id: idtarget },
        protocol: protocol,
        dataFormat: dataFormat,
        notes: notes,
        flow: flow,
        frequency: frequency,
        processingMode: processingMode
      }
      axios
        .put(`${this.endpoint}/${id}`, x)
        .then((response) => {
          console.log(response.data)
          alert('Interface' + this.formData + 'has been updated')
          this.$router.push({ path: '/interfaces' })
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
