<template>
  <div>
    <Navbar></Navbar>
    <div class="container my-5 mx-5 footer">
      <Datatable
        :endpoint="`http://localhost:8080/api/v1/contacts/non-archived?filepageSize=5&page=${
          page - 1
        }`"
        :delete="'http://localhost:8080/api/v1/contacts'"
        :edit="'/contacts/edit/'"
        :columns="contactsColumns"
        title="List of Contacts"
        addLink="/contact/applications"
        button="Add Contacts"
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
import axios from 'axios'
import Datatable from '@/components/Datatable.vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import SearchableDropdown from '@/components/SearchableDropdown.vue'

export default {
  components: {
    Datatable,
    SearchableDropdown,
    Footer,
    Navbar
  },
  data() {
    return {
      contactsColumns: [
        { name: 'fullName', label: 'Contact Name' },
        { name: 'title', label: 'Contact Title' },
        { name: 'department', label: 'Contact department' },
        { name: 'email', label: 'Contact email' }
      ],
      page: 1,
      pages: 0,
      pageSize: 5
    }
  },
  mounted() {
    axios
      .get(` http://localhost:8080/api/v1/contacts/all`)
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
.footer {
  display: flex;
  flex-direction: column;
}
</style>
