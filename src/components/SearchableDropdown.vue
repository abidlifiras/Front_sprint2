<!-- <template>
    <div id="app">
  <h1>Vue Select - Vue 3</h1>
  <v-select :options="books" label="title"></v-select>
</div>
  </template>
  
  <script>
  
  import 'vue-select/dist/vue-select.css';
  import vSelect from 'vue-select';



    export default {
       
  components: {
    vSelect : vSelect
  },


  data() {
    return {
      books: []
    };
  }
};  

console.log();
    
  </script>
  
  <style>
  




  </style>
   -->
<template>
  <div>
    <VueMultiselect v-model="selected" :options="options"> </VueMultiselect>
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
export default {
  components: { VueMultiselect },
  data() {
    return {
      selected: null,
      options: ['list', 'of', 'options']
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
