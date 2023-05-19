<template>
  <div>
    <div class="btn-group" ref="dropdown">
      <button
        type="button"
        class="btn btn-secondary dropdown-toggle"
        :class="{ 'dropdown-open': isOpen, 'multiple-selection': multiple }"
        @click="toggleDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <template v-if="selectedOptionName.length > 0">
          {{ selectedOptionName.slice(0, 3).join(', ') }}
          <template v-if="selectedOptionName.length > 3">
            +{{ selectedOptionName.length - 3 }}
          </template>
        </template>
        <template v-else>
          {{ placeholder }}
        </template>
      </button>
      <div class="dropdown-menu dropdown-menu-scrollable">
        <div class="input-group fixed-top">
          <span class="input-group-text" id="search-icon">
            <i class="bi bi-search"></i>
          </span>
          <div class="container mt-0">
            <div class="row justify-content-center">
              <form class="form-group">
                <input
                  type="text"
                  class="form-control mt-0"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-icon"
                  v-model="searchTerm"
                />
              </form>
            </div>
          </div>
        </div>
        <div class="options-container">
          <button
            v-for="(option, index) in filteredOptions"
            :key="index"
            type="button"
            class="dropdown-item"
            :class="{ active: selectedOptions.includes(option) }"
            @click="onOptionSelected(option)"
          >
            {{ option.name }}
          </button>
          <!-- <h6 v-if="filteredOptions.length == 0" class="no-results-text">No results found</h6> -->
          <button
            v-if="filteredOptions.length === 0"
            type="button"
            class="dropdown-item"
            @click="showAdd"
            data-bs-toggle="modal"
            data-bs-target="#exampleModaleee"
          >
            Add Server
          </button>

          <!-- Button trigger modal -->

          <!-- Modal -->

          <!-- <div class="dropdown-footer" v-show="selectedOptions.length > 0">
          <button type="button" class="btn btn-secondary" @click="toggleDropdown">
            Done
          </button>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedOption: null,
      searchTerm: '',
      selectedOptions: [],
      selectedOptionName: [],
      isOpen: false
    }
  },
  computed: {
    filteredOptions() {
      if (!this.searchTerm) {
        return this.options
      }
      const term = this.searchTerm.toLowerCase()
      return this.options.filter((option) => option.name.toLowerCase().includes(term))
    }
  },
  methods: {
    showAdd() {
      this.$emit('button-pop', true)
    },
    onOptionSelected(option) {
      if (this.multiple) {
        if (this.selectedOptions.includes(option)) {
          const index = this.selectedOptions.indexOf(option)
          this.selectedOptions.splice(index, 1)
        } else {
          this.selectedOptions.push(option)
        }
        this.selectedOptionName = this.selectedOptions.map((option) => option.name)
        this.$emit('option-selected', this.selectedOptions)
      } else {
        this.selectedOptions = [option]
        this.selectedOptionName = option ? [option.name] : []
        this.$emit('option-selected', option)
        this.isOpen = false
      }
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        this.$refs.dropdown.querySelector('.btn').blur()
      }
    }
  }
}
</script>
<style>
.dropdown-menu-scrollable {
  max-height: 200px;
  overflow-y: auto;
}
.fixed-top {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
}
.multiple-selection {
  background-color: #f5f5f5;
}
</style>
