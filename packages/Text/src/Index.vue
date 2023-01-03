<template>
  <div class="comp-text">
    this is a text {{ title }}
  </div>
</template>

<script>
export default {
  name: 'CompText',
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style>

</style>
