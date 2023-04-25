<template>
    <div class="row">
      <div class="col-md-5 col-lg-3">
        <nav id="sidebarMenu" role="navigation" class="col-md-5 col-lg-3 d-md-block bg-light sidebar collapse">
          <div class="sidebar-sticky ">
            <ul class="nav flex-column">
              <li class="nav-item">
                <button class="btn btn-primary" @click="showSteps = !showSteps">Assessment</button>
                <ul v-if="showSteps">
                  <li v-for="(step, index) in steps" :key="step.id">
                    <a class="nav-link" @click="() => { onStepChange(index + 1); showCategories = !showCategories; }">{{ step.step }}</a>
                    <ul v-if="index + 1 === currentStepIndex && showCategories">
                      <li v-for="(category, index) in currentStepCategories" :key="category.id">
                        <a class="nav-link" @click="onCategoryChange(index)">{{ category.category }}</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="col-md-7 col-lg-9">
        <Formulaire :currentCategory="currentCategory" />
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  import Formulaire from "../components/Formulaire.vue";
  
  export default {
    components: {
      Formulaire,
    },
    data() {
      return {
        categories: {},
        steps: [],
        showSteps : false ,
        showCategories : false ,
        currentStepIndex: 1,
        currentCategoryIndex: 0,
      };
    },
    computed: {
      currentStepCategories() {
        console.log(this.steps[this.currentStepIndex])
        console.log(this.categories[this.currentStepIndex] )
        return this.categories[this.currentStepIndex] || [];
      },
      currentCategory() {
        console.log(this.currentStepCategories[this.currentCategoryIndex])
        return this.currentStepCategories[this.currentCategoryIndex] || {};
      },
    },
    mounted() {
      this.fetchSteps();
      console.log(this.steps)
    },
    methods: {
      async fetchSteps() {
        try {
          const response = await axios.get("http://localhost:8088/api/v1/steps");
          this.steps = response.data;
          this.steps.forEach((step) => {
            this.categories[step.id] = step.categories;
          });
        } catch (error) {
          console.log(error);
        }
      },
      onStepChange(index) {
        this.currentStepIndex = index;
        this.currentCategoryIndex = 0;
      },
      onCategoryChange(index) {
        this.currentCategoryIndex = index;
      },
      toggleSteps() {
    this.showSteps = !this.showSteps;
},
    toggleCategories() {
        this.showCategories = !this.showCategories;
    },
    },
  };
  </script>
  
  <style>
  </style>
  