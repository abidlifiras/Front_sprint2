<template>
  <div class="container my-5 mx-5">
    <form class="my-4">
      <h3>{{ currentCategory.category }}</h3>
      <div v-for="(question, index) in currentCategory.questions" :key="index" class="mb-3">
        <div v-if="question.response === null">
          <p>{{ question.question }}</p>
          <div v-if="question.type === 'text'">
            <input
              type="text"
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            />
          </div>
          <div v-else-if="question.type === 'textarea'">
            <textarea
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            ></textarea>
          </div>
          <div v-else-if="question.type === 'select'">
            <select
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            >
              <option
                v-for="(option, index) in question.options"
                :key="index"
                :value="option.option"
              >
                {{ option.option }}
              </option>
            </select>
          </div>
          <div v-else-if="question.type === 'checkbox_group'">
            <div v-for="(option, index) in question.options" :key="index">
              <input
                type="checkbox"
                :id="option.id"
                :value="option.option"
                v-model="formResponse[question.id]"
                @change="updateFormResponse(question.id)"
                :required="question.required"
              />
              <label :for="option.id">{{ option.option }}</label>
            </div>
          </div>
          <div v-else-if="question.type === 'radio_group'" class="form-check">
            <div v-for="(option, index) in question.options" :key="index">
              <input
                class="form-check-input"
                type="radio"
                :id="option.id"
                :value="option.option"
                v-model="formResponse[question.id]"
                @change="updateFormResponse(question.id)"
                :name="'question_' + question.id"
                :required="question.required"
              />
              <label class="form-check-label" :for="option.id">{{ option.option }}</label>
            </div>
          </div>
          <div v-else-if="question.type === 'number'">
            <input
              type="number"
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            />
          </div>
          <div v-else-if="question.type === 'paragraph'">
            <textarea
              :required="question.required"
              style="200 px"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            ></textarea>
          </div>
        </div>
        <div v-else>
          <p>{{ question.question }}</p>
          <div v-if="question.type === 'radio_group'" class="form-check">
            <div v-for="(option, index) in question.options" :key="index">
              <input
                class="form-check-input"
                type="radio"
                :id="option.id"
                :value="option.option"
                v-model="formResponse[question.id]"
                @change="updateFormResponse(question.id)"
                :name="'question_' + question.id"
                :required="question.required"
                :checked="option.option == question.response"
              />
              <label class="form-check-label" :for="option.id">{{ option.option }}</label>
            </div>
          </div>
          <div v-else-if="question.type === 'text'">
            <input
              type="text"
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
              v-bind:placeholder="question.response"
            />/>
          </div>
          <div v-else-if="question.type === 'textarea'">
            <textarea
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
              v-bind:placeholder="question.response"
            ></textarea>
          </div>
          <div v-else-if="question.type === 'paragraph'">
            <textarea
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
              v-bind:placeholder="question.response"
            ></textarea>
          </div>
          <div v-else-if="question.type === 'number'">
            <input
              type="number"
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            />
          </div>
          <div v-else-if="question.type === 'select'">
            <select
              :required="question.required"
              v-model="formResponse[question.id]"
              @change="updateFormResponse(question.id)"
            >
              <option
                v-for="(option, index) in question.options"
                :value="option.option"
                :key="index"
              >
                {{ option.option }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Formulaire',

  props: {
    currentCategory: {},
    appId: 0
  },
  data() {
    return {
      formResponse: {}
    }
  },

  methods: {
    submit() {
      const keys = Object.keys(this.formResponse)
      console.log(this.formResponse)
      for (const id of keys) {
        const url = `http://localhost:8088/api/v1/responses/${this.appId}/question/${id}`
        const data = { response: this.formResponse[id].toString() }
        console.log(data.response)
        axios
          .post(url, data)
          .then((response) => console.log(response))
          .catch((error) => console.error(error))
      }
    },
    updateFormResponse(id) {
      const url = `http://localhost:8088/api/v1/responses/${this.appId}/question/${id}`
      const data = { response: this.formResponse[id].toString() }
      console.log(data.response)
      axios
        .post(url, data)
        .then((response) => console.log(response))
        .catch((error) => console.error(error))
    }
  }
}
</script>
<style>
.wide-column {
  display: flex;
  align-items: center;
}
</style>
