<template>
  <div
    class="primary-progress"
    :style="{
      '--progress': `${data}%`,
      height: `${height}rem`,
      background: `linear-gradient(135deg, ${color_desc} var(--progress), transparent 0)`
    }"
  >
    <span v-if="title" class="title">{{ title }}</span>
    <span class="percentage">{{ data }}%</span>
  </div>
</template>
<script>
export default {
  name: 'LinearProgress',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    title: { type: String, default: null },
    data: { type: Number, default: 20 },
    height: { type: Number, default: 2 },
    color: { type: [String, Array], default: () => ['#0f0', '#0ff'] }
  },
  computed: {
    color_desc() {
      const { color } = this
      const isStr = Object.prototype.toString.call(color) === '[object String]'
      if (isStr) return color
      return color.join(',')
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

.primary-progress {
  margin: auto;
  width: 80%;
  border-radius: 0.3rem;
  border: 1px solid rgb(0, 233, 241);
  transition: 0.3s --progress;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  color: rgb(0, 28, 184);
  width: 100%;
  text-align: left;
  padding-left: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.6rem;
}
.percentage {
  color: #ffffff;
  font-size: 1.4rem;
}
</style>
