<template>
  <el-table :data="innerList">
    <el-table-column label="目标">
      <template slot-scope="{row}">
        <component :is="itemTemplate" v-if="itemTemplate" v-bind="{id:row[0],userid:row[0]}" />
        <span v-else>{{ row[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column v-for="(i,index) in params" :key="i.name" :label="i.alias">
      <template slot-scope="{row}">{{ row[index+1] }}</template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{row}">
        <el-button type="text" @click="$emit('onClick',row[0])">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'IndicatorUserList',
  components: {
    UserFormItem: () => import('@/components/User/UserFormItem'),
    VehicleFormItem: () => import('@/components/Vehicle/VehicleFormItem'),
  },
  props: {
    list: { type: Array, default: () => null },
    params: { type: Array, default: () => [] },
    itemTemplate: { type: String, default: null }
  },
  computed: {
    innerList () {
      const { list } = this
      if (!list) return []
      return list.map(i => i.split('##'))
    }
  },
  methods: {
  }
}
</script>
