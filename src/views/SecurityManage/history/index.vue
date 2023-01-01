<template>
  <div class="big-screen-limitation" :style="{ height }">
    <el-row :gutter="20" class="row">
      <el-col :span="12" :style="{ height: `${size * 55}rem` }">
        <EventList
          :size="size"
          title="安全保密警钟长鸣"
          database="security_event"
          @change="v => $emit('change', v)"
          @requireDetail="handlerDetail"
        />
      </el-col>
      <el-col :span="12" :style="{ height: `${size * 55}rem` }">
        <EventList
          :size="size"
          title="学习先进积极前行"
          database="best_event"
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
        <el-form-item v-if="detail.tags&&detail.tags.length">
          <el-tag v-for="t,index in detail.tags" :key="index">{{ t }}</el-tag>
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
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime } from '@/utils'

export default {
  name: 'SecurityManage',
  components: {
    EventList: () => import('../event/EventList')
  },
  props: {
    height: { type: String, default: '1080px' },
    size: { type: Number, default: 1 }
  },
  data: () => ({
    showDialog: false,
    detail: null
  }),
  methods: {
    formatTime,
    handlerDetail (v) {
      this.detail = v
      this.showDialog = true
    }
  },
}
</script>
<style lang="scss" scoped>
@import "../style";

.big-screen-limitation {
  overflow: hidden;
  @include common();
}
</style>
