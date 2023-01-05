<template>
  <div class="card-container">
    <el-row class="data">{{ digital }}</el-row>
    <el-row class="title">{{ title }}</el-row>
    <div class="progress">
      <LinearProgress :data="progress" :height="2.2" :color="['#40a5e8','#94f4fb']" :title="progressTitle" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'SingleCard',
  components: {
    LinearProgress: () => import('./LinearProgress')
  },
  props: {
    progressTitle: { type: String, default: null },
    digital: { type: [String, Number], default: '无数据' },
    title: { type: String, default: '无标题' },
    progress: { type: Number, default: 70 },
  },
  data: () => ({
  }),
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.data {
  margin-top: 1rem;
  font-size: 4rem;
  color: #25f0f0;
  text-shadow: #21f0ff 0 0 0.5rem;
}
.title {
  font-size: 1.5rem;
  color: #ffffff;
}
.progress {
  margin-top: 1rem;
}
.card-container {
  display: inline-block;
  text-align: center;
  border-radius: 0.4rem;
}
</style>
