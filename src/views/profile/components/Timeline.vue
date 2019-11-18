<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2019/5/14',
          title: '初版完成',
          content: 'serfend committed 2019/4/20 20:46'
        },
        {
          timestamp: '2019/5/7',
          title: '基本完成初版',
          content: '无内容'
        },
        {
          timestamp: '2019/4/28',
          title: '整合需求开始开发',
          content: '无内容'
        },
        {
          timestamp: '2019/4/23',
          title: '提出干部休假系统需求，开始制作',
          content: '无内容'
        }
      ]
    }
  }
}
</script>
