<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) of data"
        :key="index"
        :timestamp="item.timestamp"
        placement="top"
      >
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
  props: {
    data: {
      type: Array,
      default: () => {
        return [
          {
            timestamp: '2019/12/7',
            title: '初步内测完成并根据需求更新',
            content: '待进一步更新'
          },
          {
            timestamp: '2019/10/30',
            title: '展开初步内测',
            content: '多项内源性bug及功能待修复'
          },
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
  },
  data() {
    return {}
  }
}
</script>
