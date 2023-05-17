<template>
  <div>
    <table class="table table-responsive table-hover">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="header in headers" :key="header.name">
            <template v-if="header.name === 'environment'">
              {{ item[header.name] ? item[header.name].environmentName : this.noEnv }}
            </template>
            <template v-else-if="header.name === 'datacenter'">
              {{ item[header.name] ? item[header.name].name : this.noDc }}
            </template>
            <template v-else>
              {{ item[header.name] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    apiUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: [],
      noEnv: 'No Environment',
      noDc: 'No Datacenter'
    }
  },
  watch: {
    apiUrl: {
      immediate: true,
      handler() {
        this.fetchItems()
      }
    }
  },

  methods: {
    fetchItems() {
      axios
        .get(this.apiUrl)
        .then((response) => {
          this.items = response.data
          console.log(this.items)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}
</script>
