<template>
  <el-tooltip effect="light">
    <template #content>
      <div style="text-align:center">
        <div style="font-size:0.8rem;">↑点击复制</div>
        <span>{{ label }}</span>
      </div>
    </template>
    <el-button type="text" @click="clipBoard(content||label,$event)">{{ label }}</el-button>
  </el-tooltip>
</template>

<script>
import clipBoard from '@/utils/clipboard'
export default {
  name: 'CopyableLabel',
  props: {
    label: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  },
  methods: {
    clipBoard
  }
}
</script>
