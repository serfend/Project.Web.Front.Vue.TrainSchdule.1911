<template>
  <div ref="code" :style="{height}" />
</template>

<script>
const default_setting = {
  theme: 'vs-dark', // 主题
  value: 'console.log(1111)', // 默认显示的值
  language: 'javascript',
  folding: true, // 是否折叠
  foldingHighlight: true, // 折叠等高线
  foldingStrategy: 'indentation', // 折叠方式  auto | indentation
  showFoldingControls: 'always', // 是否一直显示折叠 always | mouseover
  disableLayerHinting: true, // 等宽优化
  emptySelectionClipboard: false, // 空选择剪切板
  selectionClipboard: false, // 选择剪切板
  automaticLayout: true, // 自动布局
  codeLens: false, // 代码镜头
  scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
  colorDecorators: true, // 颜色装饰器
  accessibilitySupport: 'off', // 辅助功能支持  "auto" | "off" | "on"
  lineNumbers: 'on', // 行号 取值： "on" | "off" | "relative" | "interval" | function
  lineNumbersMinChars: 5, // 行号最小字符   number
  enableSplitViewResizing: false,
  readOnly: false, // 是否只读  取值 true | false
}
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
export default {
  name: 'JsonEditor',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    options: { type: Object, default: () => Object.assign({}, default_setting) },
    height: { type: String, default: '10rem' },
    data: { type: String, default: null }
  },
  data: () => ({
    changing: false,
    instance: null
  }),
  watch: {
    data: {
      handler (val) {
        this.update_value(val)
      },
      immediate: true
    }
  },
  mounted () {
    this.instance = monaco.editor.create(this.$refs.code, this.options)
    this.instance.onDidChangeModelContent(event => {
      // const { changes, isFlush, isRedoing, isUndoing, versionId } = event
      // console.log(changes, isFlush, isRedoing, isUndoing, versionId)
      if (this.changing) return
      this.$emit('change', this.getValue())
    })
    this.update_value(this.data)
  },
  destroyed() {
    this.instance.dispose()
  },
  methods: {
    update_value (val) {
      if (!this.instance) return
      if (this.getValue() === val) return
      this.changing = true
      this.instance.setValue(val)
      this.changing = false
    },
    getValue () {
      return this.instance.getValue()
    }
  },
}
</script>
