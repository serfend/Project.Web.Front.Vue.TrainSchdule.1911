<template>
  <span v-if="innerData">
    <span v-if="showPrimary">
      <VacationType :type="vacationType.desc" :entity-type="entityType" />
      <TransportationType :data="data.request.byTransportation" />
    </span>
    <span v-if="innerData">
      <el-tooltip
        v-for="t in filtered_options"
        :key="t.name"
        :content="t.description"
      >
        <el-tag size="mini" :color="t.color" class="white--text">
          {{ t.alias }}
        </el-tag>
      </el-tooltip>
    </span>
  </span>
</template>
<script>
import { formatApplyItem } from '@/utils/vacation'
const _options = [
  {
    name: 'isReplentApply',
    condition: x => x.isReplentApply,
    color: '#ff0000',
    alias: '补',
    description: x => `此申请可能为${x.vacationType.desc}结束后创建`
  },
  {
    name: 'isPlan',
    condition: x => x.type.isPlan,
    color: '#cccccc',
    alias: '计',
    description: '休假计划，不计算全年假'
  },
  {
    name: 'isForWork',
    condition: x => x.type.isForWork,
    color: '#42c0c2',
    alias: '公',
    description: '因公分休，全年最多可3次不计路途'
  }
]
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
    filtered_options() {
      const { innerData } = this
      const default_func = x => x.type[x.name]
      const options = _options.filter(x => {
        const func = x.condition || default_func
        return func(innerData)
      })
      const check_func = ['description']
      return options.map(x => {
        const item = Object.assign({}, x)
        check_func.map(func => {
          if (typeof item[func] === 'function') item[func] = item[func](this)
        })
        return item
      })
    },
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
