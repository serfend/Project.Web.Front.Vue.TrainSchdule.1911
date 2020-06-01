<template class="mainbox">
  <div class="panel bar">
    <slot name="title" />
    <slot name="chart" />
    <div class="panel-footer" />
  </div>
</template>

<script>
export default {
  name: 'Square'
}
</script>

<style>
</style>
