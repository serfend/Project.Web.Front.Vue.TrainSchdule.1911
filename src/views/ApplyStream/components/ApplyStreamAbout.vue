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
import { download, requestFile } from '@/api/common/file'
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
      var self = this
      requestFile(this.path, this.fileName)
        .then(data => {
          if (data.file.isRemoved) {
            self.value = `文件:${this.path}/${this.fileName} 已于${data.file.removeDate}被移除`
            return
          }
          download(data.file.id).then(data => {
            var reader = new FileReader()
            reader.onload = function(event) {
              var content = reader.result
              self.value = content
            }
            // it seem sometimes occur that data is just simply `string`
            if (typeof data === 'string') {
              self.value = data
            } else {
              reader.readAsText(data)
            }
          })
        })
        .catch(e => {
          self.value = `读取${self.path}/${self.fileName}异常:${e.message}`
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
