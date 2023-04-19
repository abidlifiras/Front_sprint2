<template>
  <button class="btn loginButtonSubmit btn-primary" @click="$emit('clicked')">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'MyButton'
}
</script>
