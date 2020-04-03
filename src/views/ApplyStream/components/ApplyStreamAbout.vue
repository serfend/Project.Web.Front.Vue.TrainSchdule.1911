<template>
  <div>
    <div v-if="value">
      <mavon-editor
        v-model="value"
        :ishljs="true"
        :toolbars-flag="false"
        :editable="false"
        :subfield="false"
        default-open="preview"
      />
    </div>
    <div v-else>加载中...</div>
  </div>
</template>

<script>
import { download, requestFile } from '@/api/file'
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
    var fn = this.$route.query.filename
    if (fn) this.fileName = fn
    this.refreshDoc()
  },
  methods: {
    refreshDoc() {
      var self = this
      requestFile(this.path, this.fileName)
        .then(data => {
          download(data.file.id).then(data => {
            var reader = new FileReader()
            reader.onload = function(event) {
              var content = reader.result // 内容就在这里
              self.value = content
            }
            reader.readAsText(data)
          })
        })
        .catch(e => {
          self.value = `读取${self.path}/${self.fileName}异常:${e.message}`
        })
    }
  }
}
</script>

<style>
</style>
