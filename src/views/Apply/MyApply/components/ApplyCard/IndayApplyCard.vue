<template>
  <el-collapse-transition>
    <div v-if="!firstShow">
      <el-collapse-transition>
        <el-card v-show="show">
          <div v-if="innerData">
            <el-link :href="applyDetailUrl(innerData.id)" target="_blank">查看详情</el-link>
            <el-row class="row">
              <el-col :xl="5" :lg="7" :md="8" :sm="9" :xs="24">
                <ActionUser
                  style="width:100%"
                  :entity-type="entityType"
                  :row="innerData"
                  @updated="userUpdate"
                />
              </el-col>
              <el-col :xl="19" :lg="17" :md="16" :sm="15" :xs="24">
                <IndayApplyProgress
                  :execute-id="innerData.executeStatusId"
                  :show="show"
                  :stamp-leave="innerData.request && innerData.request.stampLeave"
                  :stamp-return="innerData.request && innerData.request.stampReturn"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-form>
                <el-form-item v-if="innerData.status!==20" label="请假类别">
                  <VacationType v-model="innerData.request.requestType" :entity-type="entityType" />
                  <TransportationType v-model="innerData.request.byTransportation" />
                </el-form-item>
                <el-form-item label="审批流程">
                  <ApplyAuditStreamPreviewLoader
                    :id="innerData.id"
                    :entity-type="entityType"
                  >
                    <el-button slot="content" type="text">点击查看</el-button>
                  </ApplyAuditStreamPreviewLoader>
                </el-form-item>
                <el-form-item
                  v-if="innerData.status!==20"
                  label="请假原因"
                >{{ innerData.request.reason?innerData.request.reason:'未填写' }}</el-form-item>
                <el-form-item
                  v-if="innerData.status!==20"
                  label="请假去向"
                >{{ `${innerData.request.vacationPlace.name} ${innerData.request.vacationPlaceName==null?'无详细地址':innerData.request.vacationPlaceName}` }}</el-form-item>
                <el-form-item
                  v-if="innerData.status!==20"
                  label="离队时间"
                >{{ timeFormat(innerData.request.stampLeave) }}</el-form-item>
                <el-form-item
                  v-if="innerData.status!==20"
                  label="归队时间"
                >{{ timeFormat(innerData.request.stampReturn) }}</el-form-item>
                <el-form-item v-if="innerData.status>50" label="实际归队">
                  <ExecuteStatus v-model="innerData.executeStatusId" />
                </el-form-item>
              </el-form>
            </el-row>
          </div>
          <div v-else>无效的申请</div>
        </el-card>
      </el-collapse-transition>
    </div>
  </el-collapse-transition>
</template>

<script>
import { parseTime, formatTime } from '@/utils'
export default {
  name: 'ApplyCard',
  components: {
    ActionUser: () => import('@/views/Apply/QueryAndAuditApplies/ActionUser'),
    ApplyAuditStreamPreviewLoader: () =>
      import('@/components/ApplicationApply/ApplyAuditStreamPreviewLoader'),

    VacationType: () => import('@/components/Vacation/VacationType'),
    TransportationType: () =>
      import('@/components/Vacation/TransportationType'),
    ExecuteStatus: () => import('./ExecuteStatus'),
    IndayApplyProgress: () => import('./IndayApplyProgress')
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    show: { type: Boolean, default: false }
  },
  data: () => ({
    entityType: 'inday',
    innerData: null,
    firstShow: true
  }),
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.innerData = val
        }
      },
      immediate: true,
      deep: true
    },
    show: {
      handler(val) {
        if (val) {
          this.firstShow = false
        }
      },
      immediate: true
    }
  },
  methods: {
    applyDetailUrl(id) {
      return `/#/apply/inday/applydetail?id=${id}`
    },
    userUpdate() {
      this.$emit('updated')
    },
    timeFormat(val) {
      const f = parseTime(val)
      const dis = formatTime(val)
      return f === dis ? f : `${f}(${dis})`
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin: 10px;
}
</style>
