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
  name: 'ApplyStreamAbout',
  data() {
    return {
      fileName: 'auditStream.about.md',
      path: 'client-sfvue',
      value: ''
    }
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    var fn = this.$route.query.filename
    if (fn) this.fileName = fn
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
