<template>
  <Editor
    ref="Editor"
    :options="Object.assign(defaultOptions,options)"
    :initial-value="value"
    :initial-edit-type="'wysiwyg'"
    @load="init"
  />
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
export default {
  name: 'MarkdownEditor',
  components: { Editor },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    defaultOptions: {
      minHeight: '500px',
      language: 'zh-CN',
      useCommandShortcut: true,
      useDefaultHTMLSanitizer: true,
      usageStatistics: true,

      hideModeSwitch: true,
      toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        // 'image',
        'link',
        // 'divider',
        // 'code',
        // 'codeblock'
      ]
    }
  }),
  mounted() {
  },
  methods: {
    init() {
      const editor = this.$refs.Editor
      console.log(editor)
    },
    get_content() {
      return this.$refs.Editor.editor.getMarkdown()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
