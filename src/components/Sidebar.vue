<template>
  <div class="flex-shrink-0 p-3 bg-white" style="width: 280px">
    <a class="d-flex align-items-center pb-3 mb-3 text-decoration-none border-bottom">
      <span class="fs-5 fw-semibold">{{ appName }}</span>
    </a>
    <ul class="list-unstyled ps-0">
      <li class="mb-1">
        <button
          class="btn btn-toggle align-items-center rounded collapsed"
          data-bs-toggle="collapse"
          data-bs-target="#home-collapse"
          aria-expanded="false"
        >
          Technical Gallery
        </button>
        <div class="collapse show" id="home-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" class="rounded" @click="handleLinkClick('Servers')">Servers</a></li>
            <li><a href="#" class="rounded" @click="handleLinkClick('Databases')">Databases</a></li>
            <li>
              <a href="#" class="rounded" @click="handleLinkClick('Interfaces')">Interfaces</a>
            </li>
          </ul>
        </div>
      </li>
      <li class="mb-1">
        <button
          @click="handleLinkClick('Assessment')"
          class="btn btn-toggle align-items-center rounded collapsed"
          data-bs-toggle="collapse"
          data-bs-target="#dashboard-collapse"
          aria-expanded="false"
        >
          Assessment
        </button>
        <div class="collapse" id="dashboard-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li v-for="(step, index) in steps" :key="step.id">
              <a
                class="rounded"
                data-bs-toggle="collapse"
                data-bs-target="#category-collapse"
                aria-expanded="false"
                @click="onStepChange(index + 1)"
              >
                {{ step.step }}
              </a>
              <div class="collapse" id="category-collapse" v-if="currentStepIndex === index + 1">
                <ul v-if="showCategories">
                  <li v-for="(category, index) in step.categories" :key="category.id">
                    <a class="rounded" @click="onCategoryChange(index)">{{ category.category }}</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </li>

      <li class="mb-1">
        <button class="btn btn-toggle align-items-center rounded collapsed">
          App. Assessment Report
        </button>
        <div class="collapse" id="report-collapse"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Sidebar',
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
  props: {
    appName: {
      type: String,
      required: true
    },
    id: Number
  },
  computed: {
    currentStepCategories() {
      return this.categories[this.currentStepIndex] || []
    },
    currentCategory() {
      console.log(this.currentStepIndex)
      return this.currentStepCategories[this.currentCategoryIndex] || {}
    }
  },
  mounted() {
    this.appID = this.$route.params.id
    this.fetchSteps(this.appID)
    this.fetchAssessments()
  },
  methods: {
    handleLinkClick(link) {
      this.$emit('linkClicked', link)
      if (link === 'Assessment') {
        this.$emit('categoryChanged', this.categories[1][0])
      }
    },
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
          }, console.log(this.categories))
        }
      } catch (error) {
        console.log(error)
      }
    },
    onStepChange(index) {
      this.currentStepIndex = index
      console.log(index)
      this.currentCategoryIndex = 0
      this.showCategories = true
    },
    onCategoryChange(index) {
      this.currentCategoryIndex = index
      this.$emit('categoryChanged', this.categories[this.currentStepIndex][index])
    },
    toggleSteps() {
      this.showSteps = !this.showSteps
      if (!this.showSteps) {
        this.showCategories = false
      }
    },
    toggleCategories(index) {
      this.currentCategoryIndex = index
    }
  }
}
</script>

<style>
.b-example-divider {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1), inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.bi {
  vertical-align: -0.125em;
  pointer-events: none;
  fill: currentColor;
}

.dropdown-toggle {
  outline: 0;
}

.nav-flush .nav-link {
  border-radius: 0;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  background-color: transparent;
  border: 0;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, 0.85);
  background-color: transparent;
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform 0.35s ease;
  transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded='true'] {
  color: rgba(0, 0, 0, 0.85);
}
.btn-toggle[aria-expanded='true']::before {
  transform: rotate(90deg);
}

.btn-toggle-nav a {
  display: inline-flex;
  padding: 0.1875rem 0.5rem;
  margin-top: 0.125rem;
  margin-left: 1.25rem;
  text-decoration: none;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: transparent;
}

.scrollarea {
  overflow-y: auto;
}

.fw-semibold {
  font-weight: 600;
}
.lh-tight {
  line-height: 1.25;
}
</style>
