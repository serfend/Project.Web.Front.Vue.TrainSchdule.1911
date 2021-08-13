<template>
  <el-tag :style="{'background-color':item.color,color:'#fff'}" effect="plain">{{ item.alias }}</el-tag>
</template>

<script>
export default {
  name: 'ConferenceRecordType',
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: Number, default: -1 }
  },
  computed: {
    conferRecordTypesDict() {
      return this.$store.state.party.conferRecordTypesDict
    },
    item() {
      const dict = this.conferRecordTypesDict
      if (!dict) return null
      return dict[this.type] || { alias: '未知类型', color: '#ccc' }
    }
  }
}
</script>
