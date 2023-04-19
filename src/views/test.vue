<!-- <template>
<div>
    <Navbar />
    <div class="container my-5 mx-5">
        
    </div>
    <Footer />
</div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
  import Footer from "@/components/Footer.vue";
export default {
    components: {
        Navbar,
        Footer,
    },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script> -->

<!-- <template>
    <div>
      <Navbar />
      <div class="container my-5 mx-5">
        <div v-if="servers.length">
          <h1>Choose servers for this APP: {{ dataSent }}</h1>
          <form @submit.prevent="submitServers">
      <label v-for="server in servers" :key="server">
        <input type="checkbox"
               :value="server"
               v-model="selectedServers"
        >
        {{ server.serverName }}
      </label>
      <button type="submit">Create App</button>
    </form>
          
        </div>
      </div>
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  import Footer from "@/components/Footer.vue";
  import axios from "axios";
  
  export default {
    components: {
      Navbar,
      Footer,
    },
    
    data() {
      return {
        servers: [],
        selectedServers: [],
        formDataa:{},
        
      };
    },
    created() {
      
      const formData = JSON.parse(this.$route.query.formData ); 
      this.formDataa = JSON.parse(this.$route.query.formData );
  console.log(formData);
      axios.get("http://localhost:8080/api/v1/servers/non-archived").then((response) => {
        this.servers = response.data;
        console.log(this.servers);
        

      });
    },
    methods: {
      submitServers() {
        console.log(this.formDataa);
        axios.post("http://localhost:8080/api/v1/applications",this.formDataa).then((response) => {
          const appID = response.data.id;
          console.log("post done");
          this.selectedServers.forEach((server) => {
            const serverId = server.id;
          axios.put(`http://localhost:8080/api/v1/applications/${appID}/server/link/${serverId}`,this.formDataa).then((response) => {
            console.log(response.data);
          });
        });

        });
        
      },
    },
  };
  </script> -->

<template>
  <div>
    <nav class="stepped-process" aria-label="Checkout process">
      <p class="float-start mt-2 me-2 fw-bold d-sm-none">Step</p>
      <ol>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 1, complete: currentStep > 1 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="1. Map Applications"
            @click.prevent="setCurrentStep(1)"
            >Map Applications</a
          >
        </li>
        <li
          class="stepped-process-item"
          :class="{ active: currentStep === 2, complete: currentStep > 2 }"
        >
          <a
            class="stepped-process-link"
            href="#"
            title="2. Map Databases"
            aria-current="step"
            @click.prevent="setCurrentStep(2)"
            >Map Databases</a
          >
        </li>
      </ol>
    </nav>
    <div class="container my-5 mx-5">
      <div v-if="currentStep === 1">
        <div v-if="servers.length">
          <h1 class="d-flex flex-column justify-content-center align-items-center">
            Choose servers for {{ formDataa.appName }} :
          </h1>
          <form
            @submit.prevent="submitServers"
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <div class="list-group">
              <div
                v-for="server in servers"
                :key="server.id"
                class="list-group-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  :value="server"
                  v-model="selectedServers"
                  class="form-check-input"
                />
                <label class="form-check-label ms-3">{{ server.serverName }}</label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
          </form>
        </div>
        <button class="btn btn-primary" @click.prevent="setCurrentStep(2)">Next</button>
      </div>
      <div v-if="currentStep === 2">
        <P>step 2</P>
      </div>
    </div>
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
      servers: [],
      selectedServers: [],
      formDataa: {},
      currentStep: 1,
      steps: [
        { title: 'Map Applications', isComplete: true },
        { title: 'Map Databases', isComplete: false }
      ]
    }
  },
  created() {
    const formData = JSON.parse(this.$route.query.formData)
    this.formDataa = JSON.parse(this.$route.query.formData)
    axios.get('http://localhost:8088/api/v1/servers/non-archived').then((response) => {
      this.servers = response.data
    })
  },
  methods: {
    submitServers() {
      if (this.selectedServers.length === 0) {
        axios.post('http://localhost:8088/api/v1/applications', this.formDataa).then((response) => {
          console.log(response.data)
          this.$router.push('/applications')
        })
      } else {
        axios.post('http://localhost:8088/api/v1/applications', this.formDataa).then((response) => {
          const appID = response.data.id
          this.selectedServers.forEach((server) => {
            const serverId = server.id
            axios
              .put(
                `http://localhost:8088/api/v1/applications/${appID}/server/link/${serverId}`,
                this.formDataa
              )
              .then((response) => {
                console.log(response.data)
                this.$router.push('/applications')
              })
          })
        })
      }
    },
    setCurrentStep(step) {
      this.currentStep = step
    },

    prevStep() {
      this.currentStep--
    },

    nextStep() {
      this.currentStep++
      this.steps[this.currentStep - 2].isComplete = true
    }
  }
}
</script>
