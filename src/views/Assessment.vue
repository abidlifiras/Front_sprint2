<template>
  <Navbar></Navbar>
  <div class="container footer" style="margin-top: 10px; margin-bottom: 60px">
    <div v-if="assessmentExist" class="row">
      <div class="col-md-3 col-lg-3">
        <nav
          id="sidebarMenu"
          role="navigation"
          class="col-md-3 col-lg-3 d-md-block bg-light sidebar collapse"
        >
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <button class="wide-column btn btn-primary" @click="toggleSteps()">
                  {{ currentAppName }}
                </button>
                <ul v-if="showSteps">
                  <li v-for="(step, index) in steps" :key="step.id">
                    <a
                      class="nav-link"
                      @click="
                        () => {
                          onStepChange(index + 1)
                          toggleCategories()
                        }
                      "
                      >{{ step.step }}</a
                    >
                    <ul v-if="index + 1 === currentStepIndex && showCategories">
                      <li v-for="(category, index) in currentStepCategories" :key="category.id">
                        <a class="nav-link" @click="onCategoryChange(index)">{{
                          category.category
                        }}</a>
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
        <AssessmentForm :currentCategory="currentCategory" :appId="appID" />
      </div>
    </div>
    <div v-else class="row">
      <div class="col-md-11 col-lg-8">
        <h3>No assessment linked</h3>
        <button
          type="button"
          class="menuItem-active-link btn btn-sm btn-secondary"
          data-bs-toggle="modal"
          href="#exampleModalToggle"
        >
          Link assessment
        </button>
      </div>
      <div
        class="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title h5" id="exampleModalToggleLabel">{{ button }}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal">
                <span class="visually-hidden">Close</span>
              </button>
            </div>
            <div class="modal-body">
              <h4>Choose an Assessment</h4>
              <form>
                <div class="mb-3">
                  <div v-for="assessment in assessments" :key="index">
                    <input
                      class="form-check-input"
                      type="radio"
                      :id="assessment.id"
                      v-model="selectedassessment"
                      @change="LinkAssessment(assessment.id)"
                    />
                    <label class="form-check-label">{{ assessment.assessment }}</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <a
                class="btn btn-sm btn-secondary menuItem-active-link"
                data-bs-dismiss="modal"
                @click="$router.push('/applications')"
                >Cancel</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script>
import axios from 'axios'
import AssessmentForm from '@/components/AssessmentForm.vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    AssessmentForm,
    Footer,
    Navbar
  },
  data() {
    return {
      categories: {},
      steps: [],
      showSteps: true,
      showCategories: false,
      currentStepIndex: 1,
      currentCategoryIndex: 0,
      currentAppName: '',
      appID: 0,
      assessmentExist: true,
      selectedassessment: [],
      assessments: []
    }
  },
  computed: {
    currentStepCategories() {
      return this.categories[this.currentStepIndex] || []
    },
    currentCategory() {
      return this.currentStepCategories[this.currentCategoryIndex] || {}
    }
  },
  mounted() {
    this.appID = this.$route.params.id
    this.fetchSteps(this.appID)
    this.fetchAssessments()
  },
  methods: {
    async fetchAssessments() {
      const response = await axios.get(`http://localhost:8080/api/v1/assessments`)
      this.assessments = response.data
      console.log(response.data)
    },
    async fetchSteps(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/applications/${id}`)
        this.currentAppName = response.data.appName
        const response1 = await axios.get(
          `http://localhost:8080/api/v1/applications/${id}/assessment`
        )
        if (!response1.data) {
          this.assessmentExist = false
        } else {
          this.steps = response1.data.steps
          this.steps.forEach((step) => {
            this.categories[step.id] = step.categories
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    onStepChange(index) {
      this.currentStepIndex = index
      this.currentCategoryIndex = 0
    },
    onCategoryChange(index) {
      this.currentCategoryIndex = index
    },
    toggleSteps() {
      this.showSteps = !this.showSteps
      if (!this.showSteps) {
        this.showCategories = false
      }
    },
    toggleCategories() {
      this.showCategories = !this.showCategories
    },
    LinkAssessment(id) {
      const url = `http://localhost:8080/api/v1/applications/${this.$route.params.id}/addAssessment/${id}`
      axios.post(url).catch((error) => console.error(error))

      this.assessmentExist = true
      window.location.reload()
    }
  }
}
</script>

<style>
.wide-column {
  display: flex;
  align-items: center;
}
.footer {
  display: flex;
  flex-direction: column;
}
</style>
