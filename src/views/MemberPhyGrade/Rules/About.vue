<template>
  <div>
    <div v-if="value">
      <mavonEditor
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
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { loadDocument } from '@/utils/file'
export default {
  name: 'About',
  components: { mavonEditor },
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
