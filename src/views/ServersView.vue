<template>
  <div>
    <Navbar></Navbar>
    <div class="container my-5 mx-5">
      <Datatable
        :endpoint="`http://localhost:8088/api/v1/servers/non-archived?filepageSize=5&page=${
          page - 1
        }`"
        :columns="serverColumns"
        :delete="'http://localhost:8088/api/v1/servers'"
        :edit="'/servers/edit/'"
        title="List of Servers"
        addLink="/server/applications"
        button="Add Server"
        :key="page"
      />
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)">Previous</a>
          </li>
          <li
            v-for="pageNumber in pages"
            :key="pageNumber"
            class="page-item"
            :class="{ active: pageNumber === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(pageNumber)">{{
              pageNumber
            }}</a>
          </li>
          <li class="page-item" :class="{ disabled: page === pages }">
            <a class="page-link" href="#" @click.prevent="changePage(page + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Datatable from '@/components/Datatable.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Datatable,
    Footer
  },
  data() {
    return {
      serverColumns: [
        { name: 'serverName', label: 'Server Name' },
        { name: 'ipAddress', label: 'Adress IP' },
        { name: 'dataSource', label: 'Data Source' },
        { name: 'type', label: 'Type' },
        { name: 'currentRamGb', label: 'Ram in GB', type: 'number', required: true },
        { name: 'currentNumberOfCores', label: 'Numbre Of Cores' },
        { name: 'operatingSystem', label: 'Operating System' },
        { name: 'serverNotes', label: 'Notes', type: 'textarea' }
      ],
      page: 1,
      pages: 0,
      pageSize: 5
    }
  },
  mounted() {
    axios
      .get(` http://localhost:8088/api/v1/servers/all`)
      .then((response) => {
        const totalItems = response.data.length
        this.pages = Math.ceil(totalItems / this.pageSize)
        console.log(this.pages)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    changePage(newPage) {
      this.page = newPage
      console.log(this.page)
    }
  }
}
</script>
<style>
.navbar {
  height: 80px;
}

.container {
  margin-top: 20px;
}
</style>
