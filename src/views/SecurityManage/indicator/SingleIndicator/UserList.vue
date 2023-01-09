<template>
  <el-table :data="innerList">
    <el-table-column label="目标">
      <template slot-scope="{ row }">
        <component
          :is="itemTemplate"
          v-if="itemTemplate"
          v-bind="{ id: row[0], userid: row[0] }"
        />
        <span v-else>{{ row[0] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(i, index) in innerParams"
      :key="i.name"
      :label="i.alias"
    >
      <template slot-scope="{ row }">
        <div
          v-for="(content, cindex) in getContent(row[index + 1])"
          :key="cindex"
        >
          {{ content }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{ row }">
        <el-button
          type="text"
          @click="$emit('onClick', row[0])"
        >查看详情</el-button>
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
    TravelFormItem: () => import('@/components/Vehicle/TravelFormItem')
  },
  props: {
    list: { type: Array, default: () => null },
    params: { type: Array, default: () => [] },
    itemTemplate: { type: String, default: null }
  },
  computed: {
    innerList() {
      const { list } = this
      if (!list) return []
      return list.map(i => i.split('##').filter(x => x))
    },
    innerParams() {
      const { params } = this
      if (!params) return []
      return params.slice(1)
    }
  },
  methods: {
    getContent(v) {
      const val = v && v.split(';')
      if (!val) return '无'
      return val
    }
  }
}
</script>
