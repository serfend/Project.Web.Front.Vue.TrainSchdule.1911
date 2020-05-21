<template>
  <div>
    <div v-if="solutionName">
      <el-steps
        :space="200"
        :active="nowStep>=0?nowStep:streams.length"
        :finish-status="nowStep>=0?'success':'finish'"
        align-center
      >
        <el-step v-for="s in streams" :key="s.index">
          <template slot="title">
            <div>{{ s.name }}</div>
            <el-tooltip
              :content="`需要${s.firstMemberCompanyName}${s.requireMembersAcceptCount}人进行审批`"
            >
              <div>{{ s.firstMemberCompanyName }}({{ s.requireMembersAcceptCount }})</div>
            </el-tooltip>
          </template>
          <template slot="description">
            <UserFormItem v-for="u in s.membersFitToAudit" :key="u" :userid="u" />
          </template>
        </el-step>
      </el-steps>
    </div>
    <div v-else>加载中</div>
  </div>
</template>

<script>
import { auditStream } from '@/api/userinfo'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ApplyAuditStreamPreview',
  components: { UserFormItem },
  props: {
    userid: {
      type: String,
      default: null
    },
    nowStep: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    solutionName: null,
    streams: []
  }),
  watch: {
    userid: {
      handler(val) {
        if (val) {
          this.solutionName = null
          auditStream(val).then(data => {
            this.solutionName = data.solutionName
            this.streams = data.steps
          })
        }
      },
      immediate: true
    },
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true
    }
  },
  methods: {
    auditStream
  }
}
</script>

<style>
</style>
