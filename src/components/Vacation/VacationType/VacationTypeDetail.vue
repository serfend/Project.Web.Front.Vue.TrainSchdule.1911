<template>
  <div>
    <ul v-if="type" class="tooltip-vacation">
      <li v-if="showTag">
        <h1>{{ type.alias }}</h1>
        <el-divider />
      </li>
      <li>
        <b>类型</b>
        <component
          :is="showTag?'el-tag':'span'"
          :type="type.primary?'primary':'danger'"
        >{{ type.primary?'主假期':'非主假期' }}</component>
      </li>
      <li>
        <b>长度范围</b>
        <span>{{ type.minLength }}天 到 {{ type.primary?'剩余假期天数':`${type.maxLength}天` }}</span>
      </li>
      <li>
        <b>政策</b>
        <div>
          <component :is="showTag?'el-tag':'span'" v-if="!type.allowBeforePrimary">仅正休结束后可提交</component>
          <component :is="showTag?'el-tag':'span'" v-if="!type.caculateBenefit">无福利假</component>
          <component :is="showTag?'el-tag':'span'" v-if="!type.canUseOnTrip">无路途</component>
          <component :is="showTag?'el-tag':'span'" v-if="type.minusNextYear">次年扣正休</component>
          <component :is="showTag?'el-tag':'span'" v-if="type.notPermitCrossYear">不允许跨年</component>
        </div>
      </li>
      <li>
        <b>备注</b>
        <div v-for="(l,i) in type.description.split('\n')" :key="i">{{ l }}</div>
      </li>
    </ul>
    <div v-else>无效的信息</div>
  </div>
</template>

<script>
export default {
  name: 'VacationTypeDetail',
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: {
      type: Object,
      default: null
    },
    showTag: {
      type: Boolean,
      default: true
    },
    leftLength: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-vacation {
  list-style: none;
}
</style>
