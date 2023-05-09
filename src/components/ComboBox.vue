<template>
  <div>
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-secondary dropdown-toggle"
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
      <div class="dropdown-menu">
        <div class="input-group ">
          <span class="input-group-text" id="search-icon">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-icon"
            v-model="searchTerm"
          />
        </div>
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
        <h6 v-if="filteredOptions.length == 0" class="no-results-text"> No results found</h6>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
  },
  data() {
    return {
      selectedOption: null,
      searchTerm: "",
      selectedOptions: [],
      selectedOptionName: [],
    };
  },
  computed: {
    filteredOptions() {
      if (!this.searchTerm) {
        return this.options;
      }
      const term = this.searchTerm.toLowerCase();
      return this.options.filter((option) =>
        option.name.toLowerCase().includes(term)
      );
    },
  },
  methods: {
    onOptionSelected(option) {
      if (this.selectedOptions.includes(option)) {
        const index = this.selectedOptions.indexOf(option);
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
      this.selectedOptionName = this.selectedOptions.map(
        (option) => option.name
      );
      this.$emit("option-selected", this.selectedOptions);
    },
  },
};
</script>