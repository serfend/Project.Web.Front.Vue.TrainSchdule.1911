<template>
  <Viewer ref="Viewer" :initial-value="value" />
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import { Viewer } from '@toast-ui/vue-editor'
import { loadDocument } from '@/utils/file'
export default {
  name: 'MarkdownViewer',
  components: { Viewer },
  props: {
    fileName: {
      type: String,
      default: null
    },
    path: {
      type: String,
      default: 'client-sfvue'
    },
  },
  data() {
    return {
      value: '> 加载中...'
    }
  },
  watch: {
    fileName: {
      handler(val) {
        this.refreshDoc()
      }
    },
    path: {
      handler(val) {
        this.refreshDoc()
      }
    }
  },
  mounted() {
    const fn = this.$route && this.$route.query && this.$route.query.filename
    this.refreshDoc(fn)
  },
  methods: {
    refreshDoc(targetFile) {
      targetFile = targetFile || this.fileName
      loadDocument(this.path, targetFile)
        .then(i => {
          this.$refs.Viewer.editor.setMarkdown(i)
        })
        .catch(e => {
          this.$message.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
