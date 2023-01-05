<template>
  <div style="display:flex">
    <SingleCard v-for="(i,index) in data" :key="index" class="single-card" v-bind="i" />
  </div>
</template>
<script>
export default {
  name: 'MemberStatistic',
  components: {
    SingleCard: () => import('./SingleCard')
  },
  props: {},
  data: () => ({
    data: [
      { digital: 2439, title: '人员情况', progressTitle: '在位率', progress: 92 },
      { digital: 295, title: '车辆情况', progressTitle: '出车率', progress: 24 },
      { digital: 15251, title: '设备情况', progressTitle: '在线率', progress: 98 },
    ]
  }),
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.single-card {
  margin: 0 1rem;
  font-size: 2rem;

  display: flex;
  justify-content: center;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  background-color: #ffffff3f;
  height: 12rem;
  width: 15rem;
}
</style>
