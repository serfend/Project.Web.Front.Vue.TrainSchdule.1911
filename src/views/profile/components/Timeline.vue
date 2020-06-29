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
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>
