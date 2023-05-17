<template>
  <div>
    <Navbar></Navbar>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <label for="app-select-src" class="form-label">Select a Source Application:</label>
          <select id="app-select-src" v-model="selectedAppSrc" class="form-select mb-3">
            <option disabled value="">Please select one</option>
            <option v-for="app in applications" :key="app.id" :value="app.id">
              {{ app.appName }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="app-select-target" class="form-label">Select a Target Application:</label>
          <select id="app-select-target" v-model="selectedAppTarget" class="form-select mb-3">
            <option disabled value="">Please select one</option>
            <option v-for="app in applications" :key="app.id" :value="app.id">
              {{ app.appName }}
            </option>
          </select>
        </div>
      </div>
    </div>
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
        <button class="btn btn-primary" @click="submitInterfaces">Add interface</button>
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
      applications: [],
      selectedAppSrc: '',
      selectedAppTarget: '',
      formData: {
        protocol: '',
        dataFormat: '',
        notes: '',
        flow: '',
        processingMode: '',
        frequency: ''
      },
      formFields: [
        { name: 'protocol', label: 'protocol', type: 'text', required: true },
        { name: 'dataFormat', label: 'data format', type: 'text', required: true },
        {
          name: 'notes',
          label: 'notes',
          type: 'textarea',
          required: true,
          style: { height: '100px' }
        },
        {
          name: 'flow',
          label: 'Flow',
          type: 'select',
          options: [
            { label: 'EXTERNAL', value: 'EXTERNAL' },
            { label: 'INTERNAL', value: 'INTERNAL' }
          ]
        },
        {
          name: 'frequency',
          label: 'Frequency',
          type: 'select',
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
          label: 'Processing Mode',
          type: 'select',
          options: [
            { label: 'REAL_TIME', value: 'REAL_TIME' },
            { label: 'BATCH', value: 'BATCH' }
          ]
        }
      ],
      flowOptions: [
        { label: 'EXTERNAL', value: 'EXTERNAL' },
        { label: 'INTERNAL', value: 'INTERNAL' }
      ],
      processingModeOptions: [
        { label: 'REAL_TIME', value: 'REAL_TIME' },
        { label: 'BATCH', value: 'BATCH' }
      ],
      frequencyOptions: [
        { label: 'HOURLY', value: 'HOURLY' },
        { label: 'DAILY', value: 'DAILY' },
        { label: 'WEEKLY', value: 'WEEKLY' },
        { label: 'MONTHLY', value: 'MONTHLY' },
        { label: 'ON_DEMAND', value: 'ON_DEMAND' }
      ]
    }
  },
  created() {
    axios.get('http://localhost:8080/api/v1/applications/all').then((response) => {
      this.applications = response.data

      console.log(this.applications)
    })
  },
  methods: {
    submitInterfaces() {
      axios
        .post('http://localhost:8080/api/v1/interfaces', {
          applicationSrc: {
            id: this.selectedAppSrc
          },
          applicationTarget: {
            id: this.selectedAppTarget
          },
          protocol: this.formData.protocol,
          dataFormat: this.formData.dataFormat,
          notes: this.formData.notes,
          flow: this.formData.flow,
          processingMode: this.formData.processingMode,
          frequency: this.formData.frequency
        })
        .then((response) => {
          alert('Resource created successfully!')
        })
        .catch((error) => {
          // handle error response
          console.log(error.response.data)
        })
    }
  }
}
</script>
