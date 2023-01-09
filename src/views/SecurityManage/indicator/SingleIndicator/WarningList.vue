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
            v-bind="calculateAttr(componentType.component.user,i)"
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
          <div>
            <h2>详细{{ componentType.component.records.alias }}记录</h2>
            <component
              :is="componentType.component.records.name"
              v-if="showDetailDialog"
              v-bind="calculateAttr(componentType.component.records)"
            />
          </div>
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
    TravelFormItem: () => import('@/components/Vehicle/TravelFormItem'),
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
    listFormItemDict: null,
    listUserDetailDict: null
  }),
  computed: {
    componentType () {
      if (!this.listFormItemDict) return null
      const { exceedingUserType } = this.data
      if (!exceedingUserType) return null
      const result = {
        component: {},
        params: null
      }
      const r = exceedingUserType.split('##').filter(x => x)
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
  mounted() {
    this.initDict()
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
    calculateAttr(attrConfig, item) {
      const r = {}
      Object.keys(attrConfig)
        .map(key => {
          const t = attrConfig[key]
          const isFunc =
            Object.prototype.toString.call(t) === '[object Function]'
          const tmp = { key, val: isFunc ? t(this, item) : t }
          r[tmp.key] = tmp.val
        })
      return r
    },
    initDict () {
      const m = (g, x) => this.getItem(x)
      this.listFormItemDict = {
        user: { name: 'UserFormItem', id: m, userid: m },
        car: { name: 'VehicleFormItem', id: m, userid: m },
        travel: { name: 'TravelFormItem', id: m, userid: m }
      }

      this.listUserDetailDict = {
        'inday-apply': {
          name: 'AppliesList',
          alias: '请假',
          id: self => self.showDetailDialogId,
          entityType: 'inday',
          hideAddBtn: true
        },
        'vac-apply': {
          name: 'AppliesList',
          alias: '休假',
          id: self => self.showDetailDialogId,
          entityType: 'vacation',
          hideAddBtn: true
        },
        travelInfo: {
          name: 'TravelList',
          alias: '出车',
          id: self => self.showDetailDialogId
        }
      }
    },
    getItem (item) {
      const { componentType } = this
      const { params } = componentType
      if (!params) return item // 无参数，则直接返回id
      return item.split('##').filter(x => x)[0]
    }
  }
}
</script>
<style lang="scss" scoped></style>
