<template>
  <div class="container">
    <form class="my-4">
      <h3>{{ currentCategory.category }}</h3>
      <div v-for="(question, index) in currentCategory.questions" :key="index" class="mb-3">
      <div v-if ="question.response===null " >
        <p>{{ question.question }}</p>
        <div v-if="question.type === 'text'">
          <input type="text" :required="question.required"  />
        </div>
        <div v-else-if="question.type === 'textarea'">
          <textarea :required="question.required" ></textarea>
        </div>
        <div v-else-if="question.type === 'select'">
          <select :required="question.required">
            <option v-for="(option, index) in question.options" :key="index" :value="option.id">
              {{ option.option }}
            </option>
          </select>
        </div>
        <div v-else-if="question.type === 'checkbox_group'">
          <div v-for="(option, index) in question.options" :key="index">
            <input
              type="checkbox"
              :id="option.id"
              :value="option.id"
              :required="question.required"
            />
            <label :for="option.id">{{ option.option }}</label>
          </div>
        </div>
        <div v-else-if="question.type === 'radio_group'">
          <div v-for="(option, index) in question.options" :key="index">
            <input
              type="radio"
              :id="option.id"
              :value="option.id"
              :name="'question_' + question.id"
              :required="question.required"
            />
            <label :for="option.id">{{ option.option }}</label>
          </div>
        </div>
        <div v-else-if="question.type === 'number'">
          <input type="number" :required="question.required" />
        </div>
        <div v-else-if="question.type === 'paragraph'">
          <textarea :required="question.required" style="200 px"></textarea>
        </div>
    </div>
    <div v-else>
        <p>{{ question.question }}</p>
        <div v-if="question.type === 'radio_group'">
          <div v-for="(option, index) in question.options" :key="index">
            <input
              type="radio"
              :id="option.id"
              :value="option.id"
              :name="'question_' + question.id"
              :required="question.required"
              :checked="option.option == question.response"            />
            <label :for="option.id" >{{ option.option }}</label>
          </div>
        </div>

    </div>
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="submit()">Submit</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'Formulaire',

  props: {
    currentCategory: {}
  }
}
</script>
