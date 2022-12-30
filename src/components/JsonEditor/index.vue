<template>
  <div>
    <div v-if="showTools">1</div>
    <CodeEditor v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  name: 'JsonEditor',
  components: {
    CodeEditor: () => import('./CodeEditor')
  },
  props: {
    showTools: { type: Boolean, default: true }
  },
  data: () => ({
  }),
}
</script>
