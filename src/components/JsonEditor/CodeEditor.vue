<template>
  <div>
    <el-select v-model="innerMode" filterable allow-create placeholder="类型" default-first-option>
      <el-option v-for="item in items" :key="item" :label="item" :value="item" />
    </el-select>
    <div class="json-editor">
      <textarea ref="textarea" />
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'CodeEditor',
  props: {
    value: { type: String, default: null },
    theme: { type: String, default: 'material' },
    mode: { type: String, default: 'application/json' },
    lint: { type: Boolean, default: true },
    lineNumbers: { type: Boolean, default: true },
    gutters: { type: Array, default: () => ['CodeMirror-lint-markers'] }
  },
  data: () => ({
    jsonEditor: null,
    innerMode: null,
    items: [
      'application/json',
      'application/javascript',
      'application/cpp'
    ]
  }),
  watch: {
    innerMode (v) {
      this.$emit('update:mode', v)
    },
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    },
    lineNumbers() {
      this.reload()
    },
    mode (v) {
      this.innerMode = v
      this.reload()
    },
    gutters() {
      this.reload()
    },
    theme() {
      this.reload()
    },
    lint() {
      this.reload()
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
    reload() {
      debugger
      if (this.jsonEditor) this.jsonEditor.dispose()
      const { lineNumbers, mode, gutters, theme, lint } = this
      this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers,
        mode,
        gutters,
        theme,
        lint
      })

      this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      this.jsonEditor.on('change', cm => {
        this.$emit('changed', cm.getValue())
        this.$emit('input', cm.getValue())
      })
    }
  }
}
</script>

<style>
.json-editor {
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.json-editor >>> .CodeMirror-scroll {
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
.CodeMirror-lint-tooltip {
  z-index: 2001 !important;
}
</style>
