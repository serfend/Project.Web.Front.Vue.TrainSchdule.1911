<template>
  <div
    v-if="
      data.exceedingUsers &&
        Object.keys(data.exceedingUsers).length &&
        componentType
    "
  >
    <el-divider />
    <h2>告警列表</h2>
    <el-collapse
      style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
    >
      <el-collapse-item
        v-for="key in Object.keys(data.exceedingUsers)"
        :key="key"
        title="授权人"
      >
        <template slot="title">
          <el-tag type="danger">{{
            (key_type_dict[key] && key_type_dict[key].name) || key
          }}</el-tag>
          <!-- 标题中的摘要列表FormItem -->
          <component
            :is="componentType.component.user.name"
            v-for="i in data.exceedingUsers[key].item1 &&
              data.exceedingUsers[key].item1.slice(0, 3)"
            :key="i"
            :userid="i"
            @requireEdit="showDetail(i)"
          />
          <span>总数{{ data.exceedingUsers[key].item2 }}</span>
        </template>
        <!-- 详细列表 -->
        <UserList
          :list="data.exceedingUsers[key].item1"
          :params="componentType.params"
          :item-template="componentType.component.user.name"
          @onClick="showDetail"
        />

        <!-- 单个用户的详细记录 -->
        <el-dialog :visible.sync="showDetailDialog" append-to-body>
          <component
            :is="componentType.component.records.name"
            v-if="showDetailDialog"
            v-bind="calculateAttr(componentType.component.records)"
          />
        </el-dialog>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
const key_type_dict = {
  MAX: { name: '达到上限' },
  MIN: { name: '达到下限' },
  RNG: { name: '不在合理范围内' }
}
export default {
  name: 'ExceedingUsers',
  components: {
    User: () => import('@/components/User'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    Vehicle: () => import('@/components/Vehicle'),
    TravelList: () => import('@/components/Vehicle/TravelList'),
    VehicleFormItem: () => import('@/components/Vehicle/VehicleFormItem'),
    AppliesList: () => import('@/views/Apply/MyApply/components/AppliesList'),
    UserList: () => import('./UserList')
  },
  props: {
    data: { type: Object, required: true },
    name: { type: String, default: null }
  },
  data: () => ({
    focus_users: null,
    key_type_dict,
    showDetailDialog: false,
    showDetailDialogId: null,
    listFormItemDict: {
      user: { name: 'UserFormItem', id: 'userid' },
      car: { name: 'VehicleFormItem', id: 'id' }
    },
    listUserDetailDict: {
      'inday-apply': {
        name: 'AppliesList',
        id: self => self.showDetailDialogId,
        entityType: 'inday',
        hideAddBtn: true
      },
      'vac-apply': {
        name: 'AppliesList',
        id: self => self.showDetailDialogId,
        entityType: 'inday',
        hideAddBtn: true
      },
      travelInfo: {
        name: 'TravelList',
        id: self => self.showDetailDialogId
      }
    }
  }),
  computed: {
    componentType() {
      const { exceedingUserType } = this.data
      if (!exceedingUserType) return null
      const result = {
        component: {},
        params: null
      }
      const r = exceedingUserType.split('##')
      const i = r[0].split('@')
      result.component = {
        user: this.listFormItemDict[i[0]],
        records: this.listUserDetailDict[i[1]]
      }
      if (r.length > 1) {
        result.params = r
          .map(i => i.split('@'))
          .map(i => ({ name: i[0], alias: i[1] }))
      } // eg. user@inday-apply##description@原因##title@标题
      return result
    }
  },
  watch: {
    'data.exceedingUsers': {
      handler(v) {
        this.focus_users = v
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showDetail(id) {
      if (!this.componentType.component.records) {
        const error = '不支持显示该目标的详细信息，请进入相关系统查看详情。'
        return this.$message.error(error)
      }
      this.showDetailDialogId = id
      this.showDetailDialog = true
    },
    calculateAttr(attrConfig) {
      const r = {}
      Object.keys(attrConfig)
        .map(i => {
          const t = attrConfig[i]
          const isFunc =
            Object.prototype.toString.call(t) === '[object Function]'
          return { i, r: isFunc ? t(this) : t }
        })
        .map(i => {
          r[i.i] = i.r
        })
      return r
    }
  }
}
</script>
<style lang="scss" scoped></style>
