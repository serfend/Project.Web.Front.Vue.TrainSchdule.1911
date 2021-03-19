<template>
  <el-card style="margin:2%">
    <component :is="component" v-if="component" :file-name="fileName" v-bind="$attrs" />
  </el-card>
</template>

<script>
import Editor from './Editor'
import Viewer from './Viewer'
export default {
  name: 'MarkdownEditor',
  components: { Editor, Viewer },
  model: {
    prop: 'value',
    event: 'change'
  },
  data: () => ({
    fileName: '',
    component: ''
  }),
  mounted() {
    const fn = this.$route && this.$route.query && this.$route.query.filename
    if (fn) {
      this.fileName = fn
      this.component = 'Viewer'
    } else {
      this.component = 'Editor'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
