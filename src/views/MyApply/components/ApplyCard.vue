<template>
  <el-card :class="show?'cardactive':'card'">
    <div v-if="innerData">
      <el-row class="row">
        <el-col :xl="5" :lg="7" :md="8" :sm="9" :xs="24">
          <ActionUser style="width:100%" :row="data" />
        </el-col>
        <el-col :xl="19" :lg="17" :md="16" :sm="15" :xs="24">
          <el-progress
            :percentage="spent<0?0:spent/total"
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
              <el-tag>{{ data.solutionName }}</el-tag>
              <el-tooltip v-if="data.steps">
                <el-steps
                  slot="content"
                  :space="200"
                  :active="data.nowStep.index"
                  finish-status="success"
                >
                  <el-step
                    v-for="s in data.steps"
                    :key="s.index"
                    :title="`${s.firstMemberCompanyName}`"
                    :description="`${s.name}   ${s.membersAcceptToAudit.length}/${s.membersFitToAudit.length}`"
                  />
                </el-steps>
                <div>审批进度</div>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="类别">
            <el-tag
              :type="data.request.vocationType=='正休'?'success':(data.request.vocationType=='病休'?'danger':'warning')"
            >{{ data.request.vocationType }}</el-tag>
            <svg-icon v-if="data.request.byTransportation==0" icon-class="huoche" />
            <svg-icon v-else-if="data.request.byTransportation==1" icon-class="feiji" />
            <svg-icon v-else-if="data.request.byTransportation==2" icon-class="qiche" />
            <svg-icon v-else-if="data.request.byTransportation==-1" icon-class="feiji" />
          </el-form-item>
          <el-form-item label="休假原因">{{ data.request.reason }}</el-form-item>
          <el-form-item label="假期天数">
            <span>{{ `净假期${data.request.vocationLength}天 在途${data.request.onTripLength}天` }}</span>
            <el-tooltip
              v-for="a in data.request.additialVocations"
              :key="a.id"
              :content="`开始于${a.start}的${a.length}天${a.name},${a.description}`"
            >
              <el-tag style="margin:10px">{{ `${a.length}天${a.name}` }}</el-tag>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            label="休假地点"
          >{{ `${data.request.vocationPlace.name} ${data.request.vocationPlaceName}` }}</el-form-item>
          <el-form-item label="离队时间">{{ timeFormat(data.request.stampLeave) }}</el-form-item>
          <el-form-item label="归队时间">{{ timeFormat(data.request.stampReturn) }}</el-form-item>
        </el-form>
      </el-row>
    </div>
    <div v-else>无效的申请</div>
  </el-card>
</template>

<script>
import { parseTime, datedifference } from '@/utils'
import { format } from 'timeago.js'
import ActionUser from '@/views/QueryAndAuditApplies/ActionUser'
export default {
  name: 'ApplyCard',
  components: { ActionUser },
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
      innerData: null
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
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    datedifference,
    timeFormat(val) {
      return `${parseTime(val, '{y}年{m}月{d}日')}(${format(val, 'zh_CN')})`
    },
    formatPercent(val) {
      if (this.spent <= 0) return '未开始'
      return `${this.spent}/${this.total}天`
    }
  }
}
</script>

<style scoped>
.row {
  margin: 10px;
}

.card {
  height: 0px;
  transition: all 1.5s;
}

.cardactive {
  margin: 10px;
  transition: all 1.5s;
}
</style>
