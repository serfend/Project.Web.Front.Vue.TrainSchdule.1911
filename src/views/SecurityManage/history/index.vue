<template>
  <div class="big-screen-limitation" :style="{ height }">
    <el-row :gutter="20" class="row">
      <el-col :span="24" :style="{ height: `${size * 55}rem` }">
        <EventList
          ref="eventList"
          :size="size"
          title="安全保密警钟长鸣"
          database="security_event"
          @change="v => $emit('change', v)"
          @requireDetail="handlerDetail"
        />
      </el-col>
    </el-row>
    <el-dialog :visible.sync="showDialog" append-to-body>
      <template #title>
        <h2>详细信息</h2>
      </template>
      <el-form v-if="detail" label-width="5rem">
        <el-form-item>
          <h3>{{ detail.type }}</h3>
        </el-form-item>
        <el-form-item v-if="detail.tags && detail.tags.length">
          <el-tag v-for="(t, index) in detail.tags" :key="index">{{
            t
          }}</el-tag>
        </el-form-item>
        <el-form-item label="标题">
          <span>{{ detail.title }}</span>
        </el-form-item>
        <el-form-item label="时间">
          <span>{{ formatTime(detail.date) }}</span>
        </el-form-item>
        <el-form-item label="内容">
          <span>{{ detail.detail }}</span>
        </el-form-item>
        <el-divider />
        <div style="width:100%;text-align: center;">
          <div v-if="!detail.analysis">暂无分析</div>
          <el-button
            v-else-if="!showAnalysis"
            type="text"
            @click="showAnalysis = true"
          >查看分析</el-button>
          <el-dialog :visible.sync="showAnalysis" append-to-body>
            <h2 slot="title">{{ detail.title }} 案例分析</h2>
            <el-card>
              <p
                v-for="(x, index) in analysis"
                :key="index"
                style="font-size:1.2rem"
              >
                {{ x }}
              </p>
            </el-card>
            <el-button
              v-if="!showComment"
              type="text"
              style="color:#fefefe"
              @click="showComment = true"
            >查看评论</el-button>
            <BiliComment
              v-if="showAnalysis && showComment"
              :id="detail.id"
              :config="{ title: '提醒', allowAdd: true }"
            />
          </el-dialog>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime } from '@/utils'

export default {
  name: 'SecurityManage',
  components: {
    EventList: () => import('../event/EventList'),
    BiliComment: () => import('@/components/BiliComment')
  },
  props: {
    height: { type: String, default: '1080px' },
    size: { type: Number, default: 1 }
  },
  data: () => ({
    showDialog: false,
    detail: null,
    showAnalysis: false,
    showComment: false,
  }),
  computed: {
    analysis() {
      const analysis = this.detail && this.detail.analysis
      if (!analysis) return []
      return analysis.split('\n')
    }
  },
  watch: {
    showAnalysis: {
      handler (v) {
        this.showComment = false
      }
    }
  },
  methods: {
    formatTime,
    onEventListSelect(x) {
      const e = this.$refs.eventList
      e && e.onEventListSelect(x)
    },
    handlerDetail(v) {
      this.detail = v
      this.showDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";

.big-screen-limitation {
  overflow: hidden;
  @include common();
}
</style>
