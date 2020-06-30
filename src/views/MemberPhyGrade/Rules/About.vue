<template>
  <div>
    <div v-if="value">
      <mavon-editor
        v-model="value"
        :ishljs="true"
        :toolbars-flag="false"
        :editable="false"
        :subfield="false"
        style="z-index:0"
        default-open="preview"
      />
    </div>
    <div v-else>加载中...</div>
  </div>
</template>

<script>
import { loadDocument } from '@/utils/file'
export default {
  name: 'About',
  data() {
    return {
      fileName: 'grade.phy.about.md',
      path: 'client-sfvue',
      value: ''
    }
  },
  mounted() {
    this.refreshDoc()
  },
  methods: {
    refreshDoc() {
      loadDocument(this.path, this.fileName)
        .then(i => (this.value = i))
        .catch(e => {
          this.$message.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
