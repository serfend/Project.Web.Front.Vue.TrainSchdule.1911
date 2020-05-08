<template>
  <el-collapse-transition>
    <div v-if="!firstShow">
      <el-collapse-transition>
        <el-card v-show="show">
          <div v-if="innerData">
            <el-row class="row">
              <el-col :xl="5" :lg="7" :md="8" :sm="9" :xs="24">
                <ActionUser style="width:100%" :row="innerData" @updated="userUpdate" />
              </el-col>
              <el-col :xl="19" :lg="17" :md="16" :sm="15" :xs="24">
                <el-progress
                  :percentage="spent<0?0:(spent>total?100:((spent/total)*100))"
                  :format="formatPercent"
                  :stroke-width="24"
                  text-inside
                />
              </el-col>
            </el-row>
            <el-row>
              <el-form>
                <el-form-item label="审批流">
                  <div>
                    <el-tooltip v-if="innerData.steps&&innerData.steps.length>0" effect="light">
                      <el-steps
                        slot="content"
                        :style="{ width:`${100*innerData.steps.length}px` }"
                        :active="innerData.nowStep?(innerData.nowStep.index):(innerData.steps.length)"
                        finish-status="success"
                      >
                        <el-step
                          v-for="s in innerData.steps"
                          :key="s.index"
                          :title="`${s.firstMemberCompanyName}`"
                        >
                          <div slot="description">
                            <h3>{{ s.name }}</h3>
                            <el-popover trigger="hover" @show="anyStepShow(s)">
                              <span
                                slot="reference"
                              >{{ s.membersAcceptToAudit.length }}人 / {{ s.requireMembersAcceptCount==0?'所有':s.requireMembersAcceptCount }}人</span>
                              <div v-if="s.memberShow">
                                <el-card>
                                  可审批人
                                  <UserFormItem
                                    v-for="u in s.membersFitToAudit"
                                    :key="u"
                                    :userid="u"
                                    placement="top"
                                  />
                                </el-card>
                                <el-card>
                                  已审批人
                                  <UserFormItem
                                    v-for="u in s.membersAcceptToAudit"
                                    :key="u"
                                    :userid="u"
                                    placement="top"
                                  />
                                </el-card>
                              </div>
                            </el-popover>
                          </div>
                        </el-step>
                      </el-steps>
                      <el-tag>{{ innerData.auditStreamSolution }}</el-tag>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="类别">
                  <el-tag
                    :type="innerData.request.vocationType=='正休'?'success':(innerData.request.vocationType=='病休'?'danger':'warning')"
                  >{{ innerData.request.vocationType }}</el-tag>
                  <svg-icon v-if="data.request.byTransportation==0" icon-class="huoche" />
                  <svg-icon v-else-if="innerData.request.byTransportation==1" icon-class="feiji" />
                  <svg-icon v-else-if="innerData.request.byTransportation==2" icon-class="qiche" />
                  <svg-icon v-else-if="innerData.request.byTransportation==-1" icon-class="feiji" />
                </el-form-item>
                <el-form-item
                  label="休假原因"
                >{{ innerData.request.reason?innerData.request.reason:'未填写' }}</el-form-item>
                <el-form-item label="假期天数">
                  <span>{{ `净假期${innerData.request.vocationLength}天 在途${innerData.request.onTripLength}天` }}</span>
                  <el-tooltip
                    v-for="a in innerData.request.additialVocations"
                    :key="a.id"
                    :content="`开始于${a.start}的${a.length}天${a.name},${a.description}`"
                  >
                    <el-tag style="margin:10px">{{ `${a.length}天${a.name}` }}</el-tag>
                  </el-tooltip>
                </el-form-item>
                <el-form-item
                  label="休假地点"
                >{{ `${innerData.request.vocationPlace.name} ${innerData.request.vocationPlaceName==null?'无详细地址':innerData.request.vocationPlaceName}` }}</el-form-item>
                <el-form-item label="离队时间">{{ timeFormat(innerData.request.stampLeave) }}</el-form-item>
                <el-form-item label="归队时间">{{ timeFormat(innerData.request.stampReturn) }}</el-form-item>
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
import { parseTime, datedifference } from '@/utils'
import { format } from 'timeago.js'
import ActionUser from '@/views/QueryAndAuditApplies/ActionUser'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ApplyCard',
  components: { ActionUser, UserFormItem },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerData: null,
      firstShow: true
    }
  },
  computed: {
    total() {
      return (
        1 +
        datedifference(
          this.innerData.request.stampReturn,
          this.innerData.request.stampLeave
        )
      )
    },
    spent() {
      return 1 + datedifference(new Date(), this.innerData.request.stampLeave)
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.innerData = val
          if (this.innerData.steps && this.innerData.steps.length > 0) {
            for (var i = 0; i < this.innerData.steps.length; i++) {
              this.innerData.steps[i].memberShow = false
            }
          }
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
    datedifference,
    userUpdate() {
      this.$emit('updated')
    },
    anyStepShow(step) {
      step.memberShow = true
      this.$forceUpdate()
    },
    timeFormat(val) {
      return `${parseTime(val, '{y}年{m}月{d}日')}(${format(val, 'zh_CN')})`
    },
    formatPercent(val) {
      if (this.spent <= 0) return '未开始'
      if (val >= 100) return '已结束'
      return `${this.spent}/${this.total}天`
    }
  }
}
</script>

<style scoped>
.row {
  margin: 10px;
}
</style>
