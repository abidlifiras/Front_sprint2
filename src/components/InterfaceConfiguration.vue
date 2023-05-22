<template>
    <div>
      <div class="container my-3">
        <div class="row align-items-center">
  <div class="col-md-6">
    <label for="dc_select" class="form-label">Select an application:</label>
    <ComboBox :options="applicationsSource" :multiple="false" @option-selected="onSourceAppSelected" :defaultValue="defaultValueSource"></ComboBox>

  </div>
  <div class="col-md-6">
    <label for="dc_select" class="form-label">Select an application:</label>
    <ComboBox :options="applicationsTarget" :multiple='false' @option-selected="onTargetAppSelected" :defaultValue="defaultValueTarget"></ComboBox>
  </div>
</div>

      </div>
      <div class="container">
        <form class="my-4">
          <div v-for="(field, index) in formFields" :key="index" class="mb-1">
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
  </template>

  <script>
  import axios from 'axios'
  import ComboBox from './ComboBox.vue'
  
  export default {
    components: {
      ComboBox
    },
  
    props: {
      appId: Number,
      appName:String
    },
    data() {
      return {
        toggleVariable: false,
        selectedAppSrc:0,
        selectedAppTarget:0,
        applications: [],
        defaultValueSource:null,
        defaultValueTarget:null,
        applicationsSource: [],
        applicationsTarget: [],
        selectedApplication: {},
        formData: {},
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
      axios.get(`http://localhost:8080/api/v1/applications/interfaces/custom-add/${this.appId}`)
      .then((response) => {
        const apps = response.data.map((application) => {
          return {
            id: application.id,
            name: application.appName
          }
        })
        this.applications = apps
        this.applicationsTarget = this.applications
        this.applicationsSource = this.applications
      
      })
    },
    
    methods: {
      onSourceAppSelected(selectedOption) {
      this.selectedAppSrc = selectedOption.id;
      this.applicationsTarget = this.applications.filter(app => app.id !== selectedOption.id);
      this.defaultValueTarget={id:this.appId ,name:this.appName}
      this.selectedAppTarget = this.appId;

    },
    onTargetAppSelected(selectedOption) {
      this.selectedAppTarget = selectedOption.id;
      this.applicationsSource = this.applications.filter(app => app.id !== selectedOption.id);
      this.defaultValueSource={id:this.appId ,name:this.appName}
      this.selectedAppSrc = this.appId;

    },
      
      submitForm() {
        // Check if required fields are empty
        for (const field of this.formFields) {
          if (field.required && !this.formData[field.name]) {
            alert(`${field.label} is required`)
            return
          }
        }
        
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
    }
  }
    }
  </script>