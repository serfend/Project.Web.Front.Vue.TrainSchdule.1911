<template>
  <el-tag
    v-if="statusDic[status]"
    :color="statusDic[status].color"
    class="white--text"
    :type="type"
  >{{ statusDic[status].desc }}</el-tag>
</template>
<script>
export default {
  name: 'AuditStatusTag',
  model: {
    prop: 'status',
    event: 'change'
  },
  props: {
    status: { type: Number, default: null },
    type: { type: String, default: null },
  },
  data: () => ({}),
  computed: {
    statusDic() {
      return this.$store.state.vacation.statusDic
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped></style>
