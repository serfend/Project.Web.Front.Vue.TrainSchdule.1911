<template>
  <span v-if="innerData">
    <span v-if="showPrimary">
      <VacationType :type="vacationType.desc" :entity-type="entityType" />
      <TransportationType :data="data.request.byTransportation" />
    </span>
    <el-tooltip v-if="innerData.isReplentApply" content="此申请可能为外出结束后创建">
      <el-tag size="mini" color="#ff0000" class="white--text">补充申请</el-tag>
    </el-tooltip>
    <span v-if="innerData.type">
      <el-tag
        v-if="innerData.type.isPlan"
        color="#cccccc"
        class="white--text"
      >计划</el-tag>
      <el-tag
        v-if="innerData.type.isForWork"
        color="#cccccc"
        class="white--text"
      >因公</el-tag>
    </span>
  </span>
</template>
<script>
import { formatApplyItem } from '@/utils/vacation'
export default {
  name: 'VacationMainStatus',
  components: {
    VacationType: () => import('@/components/Vacation/VacationType'),
    TransportationType: () => import('@/components/Vacation/TransportationType')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: () => ({}) },
    showPrimary: { type: Boolean, default: true },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    innerData: null
  }),
  computed: {
    vacationType() {
      const result = {}
      const { data } = this
      const x = data && data.request
      const type_name = x && x.vacationType
      const CONST_Primary = '正休'
      // result.show = (type_name !== CONST_Primary) || showPrimary
      result.tag = type_name === CONST_Primary ? 'primary' : 'danger'
      result.desc = type_name
      return result
    }
  },
  watch: {
    data: {
      handler(v) {
        this.innerData = this.formatApplyItem(v)
      },
      immediate: true
    }
  },
  methods: {
    formatApplyItem
  }
}
</script>
<style scoped lang="scss"></style>
