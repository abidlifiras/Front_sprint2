<template>
  <div class="multiselect-container" ref="container">
    <div class="multiselect-selected" @click="toggleDropdown">
      {{ placeholder }}
    </div>
    <div v-if="isDropdownOpen" class="multiselect-dropdown">
      <input type="text" v-model="searchTerm" class="multiselect-search" placeholder="Search..." />
      <div v-if="isDropdownOpen" class="multiselect-items">
        <div v-for="item in filteredItems" :key="item.id" @click="selectItem(item)">
          <select :class="{ checked: isSelected(item) }"></select>
          <select>
            {{
              item.serverName
            }}
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select...'
    }
  },
  data() {
    return {
      isDropdownOpen: false,
      searchTerm: ''
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchTerm) {
        return this.items
      }
      const term = this.searchTerm.toLowerCase()
      return this.items.filter((item) => item.name.toLowerCase().includes(term))
    }
  },
  watch: {
    selectedItems(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    selectItem(item) {
      if (this.isSelected(item)) {
        this.removeItem(item)
      } else {
        this.selectedItems.push(item)
      }
    },
    removeItem(item) {
      const index = this.selectedItems.findIndex((i) => i.id === item.id)
      this.selectedItems.splice(index, 1)
    },
    isSelected(item) {
      return this.selectedItems.findIndex((i) => i.id === item.id) !== -1
    }
  }
}
</script>
