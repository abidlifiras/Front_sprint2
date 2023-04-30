<template>
    <Navbar></Navbar>
    <div v-if="assessmentExist" class="row">
      <div class="col-md-3 col-lg-3">
        <nav id="sidebarMenu" role="navigation" class="col-md-3 col-lg-3 d-md-block bg-light sidebar collapse">
          <div class="sidebar-sticky ">
            <ul class="nav flex-column">
              <li class="nav-item">
                <button class="btn btn-primary" @click="toggleSteps()">{{ currentAppName }}</button>
                <ul v-if="showSteps">
                  <li v-for="(step, index) in steps" :key="step.id">
                    <a class="nav-link" @click="() => { onStepChange(index + 1); toggleCategories(); }">{{ step.step }}</a>
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
      <div class="col-md-11 col-lg-8">
        <Formulaire :currentCategory="currentCategory"  :appId =appID />
      </div>
    </div>
    <div v-else class="row">
      <h3> pas d'assessment</h3>
    </div>
    <Footer></Footer>
  </template>
  
  <script>
  import axios from "axios";
  import Formulaire from "../components/Formulaire.vue";
  import Footer from "@/components/Footer.vue";
  import Navbar from "@/components/Navbar.vue";
  
  export default {
    components: {
      Formulaire,
      Footer,
      Navbar,
    },
    data() {
      return {
        categories: {},
        steps: [],
        showSteps: false,
        showCategories: false,
        currentStepIndex: 1,
        currentCategoryIndex: 0,
        currentAppName : "" ,
        appID : 0,
        assessmentExist : true
      };
    },
    computed: {
      currentStepCategories() {
        return this.categories[this.currentStepIndex] || [];
      },
      currentCategory() {
        return this.currentStepCategories[this.currentCategoryIndex] || {};
      }
    },
    mounted() {
      this.appID = this.$route.params.id
      this.fetchSteps(this.appID);
    },
    methods: {
      async fetchSteps(id) {
        try {
          const response = await axios.get(`http://localhost:8088/api/v1/applications/${id}`);
          this.currentAppName =response.data.appName
          const response1 = await axios.get(`http://localhost:8088/api/v1/applications/${id}/assessment`);
          if (!response1.data){
            this.assessmentExist=false
          }
          else{this.steps = response1.data.steps;
          this.steps.forEach((step) => {
            this.categories[step.id] = step.categories;
          });}
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
        if (!this.showSteps) {
          this.showCategories = false;
        }
      },
      toggleCategories() {
        this.showCategories = !this.showCategories;
      },
    },
  };
  </script>
  
  <style></style>
  