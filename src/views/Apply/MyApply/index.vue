<template>
  <div>
    <div v-if="iId || (currentUser && currentUser.id)">
      <div v-if="!hideUserCard">
        <div v-if="!$slots.inner">
          <el-row :gutter="20" class="row" s>
            <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
              <div style="width:100%;opacity: 0;">commentsHERE</div>
              <Sticky :sticky-top="55" style="overflow:hidden">
                <UserFormItem
                  :data="iId ? null : currentUser"
                  :userid="iId"
                  :direct-show-card="true"
                  :can-load-avatar="true"
                  :direct-expand-description="true"
                />
                <el-button
                  type="text"
                  style="position:absolute;left:26rem;top:-0.5rem"
                  @click="show_selector=true"
                >查看其他人</el-button>
                <ApplyOverview
                  v-if="showVacationOverview"
                  :userid="iId || currentUser.id"
                  graph-type="circle"
                />
              </Sticky>
            </el-col>
            <el-col :xl="17" :lg="16" :md="15" :sm="14" :xs="24">
              <AppliesList
                :id.sync="iId"
                ref="AppliesList"
                :hide-add-btn="hideAddBtn"
                :entity-type="entityType"
                :show-apply-new.sync="show_apply_new"
              />
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <ApplyOverview :userid="iId || currentUser.id" class="row" />
          <el-row class="row">
            <el-col>
              <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
                <UserFormItem
                  :data="iId ? null : currentUser"
                  :userid="iId"
                  :direct-show-card="true"
                  :can-load-avatar="true"
                />
              </el-col>
              <slot name="inner" />
            </el-col>
          </el-row>
          <AppliesList
            :id.sync="iId"
            ref="AppliesList"
            :hide-add-btn="hideAddBtn"
            :entity-type="entityType"
            :show-apply-new.sync="show_apply_new"
          />
        </div>
      </div>
    </div>
    <Login v-else />
    <el-dialog :visible.sync="show_apply_new" append-to-body>
      <component
        :is="`ApplyNew${entityType}`"
        v-if="show_apply_new"
        :default-id="inner_id"
        :single-column="true"
        @userSubmit="reload"
      />
    </el-dialog>
    <el-dialog :visible.sync="show_selector" append-to-body>
      <template #title>
        <h2>查询其他人</h2>
      </template>
      <el-row class="row">
        <UserSelector
          :code.sync="iId"
          :default-info="'查询其他人申请情况（需要权限）'"
          style="display:inline"
        />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyApply',
  components: {
    ApplyNewvacation: () => import('@/views/Apply/NewApply/VacationNewApply'),
    ApplyNewinday: () => import('@/views/Apply/NewApply/IndayNewApply'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    UserSelector: () => import('@/components/User/UserSelector'),
    ApplyOverview: () => import('./components/ApplyOverview'),
    Login: () => import('@/views/login'),
    Sticky: () => import('@/components/Sticky'),
    AppliesList: () => import('./components/AppliesList')
  },
  props: {
    id: { type: String, default: null },
    entityType: { type: String, default: 'vacation' },
    hideUserCard: { type: Boolean, default: false },
    hideAddBtn: { type: Boolean, default: false }
  },
  data: () => ({
    inner_id: null,
    loading: false,
    show_apply_new: false,
    show_selector: false
  }),
  computed: {
    showVacationOverview() {
      return this.entityType === 'vacation'
    },
    currentUser() {
      return this.$store.state.user.data
    },
    iId: {
      set(val) {
        val = (val && val.id) || val
        this.inner_id = val
        this.$emit('update:id', this.inner_id)
      },
      get() {
        return this.inner_id
      }
    }
  },
  watch: {
    id: {
      handler(val) {
        this.iId = val
      },
      immediate: true
    }
  },
  mounted() {
    const { query } = this.$route
    const usr = query && query.userid
    if (!usr) return
    this.iId = usr
  },
  destroyed() {},
  methods: {
    reload() {
      const c = this.$refs.AppliesList
      if (!c || !c.reload) return
      c.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin: 10px;
}
</style>
