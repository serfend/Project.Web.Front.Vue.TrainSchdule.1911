<template>
  <el-row class="goods-current-value">
    <div v-if="innerData.length" class="detail-value-container">
      <div
        v-for="(x, index) in innerData"
        :key="index"
        class="detail-value-single-card"
      >
        <div class="detail-value-title">
          <div
            v-for="(h, hindex) in x.headers"
            :key="hindex"
            class="detail-single-content"
          >
            {{ h }}
          </div>
        </div>
        <div class="detail-value-value">
          <div
            v-for="(c, cindex) in x.contents"
            :key="cindex"
            class="detail-single-content"
          >
            {{ c }}
          </div>
        </div>
        <div class="detail-value-description" style="display:flex">
          <div
            v-for="(d, dindex) in x.footers"
            :key="dindex"
            class="detail-single-content"
          >
            {{ d }}
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else style="margin:auto" description="没有内容" />
  </el-row>
</template>
<script>
export default {
  name: 'CounterCard',
  components: {},
  model: { event: 'change', prop: 'data' },
  props: {
    data: { type: Array, default: null },
    config: {
      type: Object,
      default: () => ({
        header: 'header',
        content: 'content',
        footer: 'footer'
      })
    }
  },
  data: () => ({}),
  computed: {
    innerData() {
      const { data, config } = this
      if (!data) return []
      const configs = Object.keys(config)
      // 筛选有效值并按\n换行
      return data.map(x => {
        const result = {}
        configs.map(c => {
          const value = x[config[c]]
          if (!value) return
          result[`${c}s`] = value.split('\n')
        })
        return result
      })
    }
  }
}
</script>

<style lang="scss">
@mixin height_assign($height) {
  height: $height;
  line-height: $height;
}
@mixin base-element {
  padding: 1rem 0.5rem;
}
.detail-value-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.detail-value-single-card {
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  margin: 0.2rem;
  background: #4ce6ff;
  font-size: 1.2rem;
  max-width: 15rem;
  min-width: 10rem;
  border-radius: 0.5rem;
  color: #ffffff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 1);
}

.detail-value-title {
  background: #0490e1;
  font-size: 1rem;
  @include height_assign(2rem);
}

.detail-value-value {
  @include base-element;
  color: #1f0000;
  text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
  height: 5rem;
}

.detail-value-description {
  font-size: 0.8rem;
  @include height_assign(1rem);
}
.detail-single-content {
  margin: auto;
}
</style>
