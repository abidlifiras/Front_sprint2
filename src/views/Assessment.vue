<template>
    <div>
    <Navbar></Navbar>
      <nav class="stepped-process" aria-label="Checkout process">
        <p class="float-start mt-2 me-2 fw-bold d-sm-none">Step</p>
        <ol>
          <li
            v-for="(category, index) in categories"
            :key="index"
            class="stepped-process-item"
            :class="{ active: currentCategoryIndex === index, complete: currentCategoryIndex > index }"
          >
            <a
              class="stepped-process-link"
              @click.prevent="setCurrentCategoryIndex(index)"
            ></a>
          </li>
        </ol>
      </nav>
      <div v-if="category"  class="container">
        <h2 v-if="category">{{ category.category }}</h2>
        <form class="my-4">
          <div v-for="(question, index) in category.questions" :key="index" class="mb-3">
            <p>{{ question.question }}</p>
            <div v-if="question.type === 'text'">
              <input type="text" :required="question.required" />
            </div>
            <div v-else-if="question.type === 'textarea'">
              <textarea :required="question.required"></textarea>
            </div>
            <div v-else-if="question.type === 'select'">
              <select :required="question.required">
                <option
                  v-for="(option, index) in question.options"
                  :key="index"
                  :value="option.id"
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
              <textarea :required="question.required"></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary"  @click.prevent="submit()">Submit</button>
        </form>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
      <Footer></Footer>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import Navbar from '@/components/Navbar.vue'
  import Footer from '@/components/Footer.vue'
  
  export default {
    components: {
    Navbar,
    Footer
  },
    data () {
      return {
        categories: [],
        currentCategoryIndex: 0
      }
    },
    mounted () {
      this.fetchCategories()
    },
    methods: {
      async fetchCategories () {
        const response = await axios.get('http://localhost:8088/api/v1/categories')
        this.categories = response.data
      },
      setCurrentCategoryIndex (index) {
        this.currentCategoryIndex = index
      },
      submit(){
        if(this.currentCategoryIndex+1<this.categories.length){
        this.currentCategoryIndex =  this.currentCategoryIndex + 1}
        else {
            this.$router.push({ path: '/applications' })

        }
      }
    },
    computed: {
      category () {
        return this.categories[this.currentCategoryIndex]
      }
    }
  }
  </script>
  