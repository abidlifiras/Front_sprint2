<template>
  <Navbar></Navbar>
  <div class="row">
    <div class="col-md-3 col-lg-3">
      <Sidebar
        :appName="applicationName"
        @linkClicked="handleLinkClicked"
        @categoryChanged="handlecategoryChanged"
      ></Sidebar>
    </div>
    <div v-if="selectedLink === 'Assessment'" class="col-md-11 col-lg-8">
      <AssessmentForm :currentCategory="categoryToshow" :appId="appId" />
    </div>
    <div v-else class="col-md-11 col-lg-8">
      <DashboardContent :selectedLink="selectedLink" :id="appId" :appName="applicationName">
      </DashboardContent>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import DashboardContent from '@/components/DashboardContent.vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import AssessmentForm from '../components/AssessmentForm.vue'

export default {
  components: {
    DashboardContent,
    Sidebar,
    Navbar,
    AssessmentForm
  },
  data() {
    return {
      applicationName: '',
      selectedLink: 'Servers',
      appId: 0,
      categoryToshow: {}
    }
  },
  created() {
    this.fetchApplicationName()
  },
  methods: {
    fetchApplicationName() {
      const id = this.$route.params.id
      this.appId = id
      console.log(id + ' is the id')
      axios
        .get(`http://localhost:8080/api/v1/applications/${id}`)
        .then((response) => {
          this.applicationName = response.data.appName
        })
        .catch((error) => {
          console.error(error)
        })
    },
    handleLinkClicked(link) {
      this.selectedLink = link
    },
    handlecategoryChanged(category) {
      this.categoryToshow = category
      console.log(category)
    }
  }
}
</script>
