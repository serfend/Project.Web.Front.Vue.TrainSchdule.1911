<template>
  <el-select v-model="value">
    <el-option v-for="i in conferTypes" :key="i.id">{{ i.alias }}</el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ConferTypeSelector',
  data: () => ({
    value: null
  }),
  computed: {
    conferTypes() {
      return this.$store.state.party.conferTypes
    }
  }
}
</script>
