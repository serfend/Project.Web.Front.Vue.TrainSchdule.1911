<template>
  <span>
    <span
      v-for="(v, i) in data_converted"
      :key="i"
      :style="{ display: inline ? '' : 'table' }"
      class="align-right"
    >
      <el-tooltip placement="right">
        <template #content>
          <span>{{ v.desc }}</span>
        </template>
        <el-tag :type="v.tag_type">
          <span>{{ v.name }}</span>
          <span>{{ v.length }}天</span>
        </el-tag>
      </el-tooltip>
    </span>
  </span>
</template>
<script>
import { parseTime } from '@/utils'
export default {
  name: 'VacAdditionalTags',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Array, default: () => [] },
    inline: { type: Boolean, default: true }
  },
  computed: {
    data_converted() {
      const { data } = this
      if (!data) return []
      return data.map(x => this.getAdditional(x))
    }
  },
  methods: {
    getAdditional(a) {
      const isOfficial = a.officialAdditionId
      const isOfficialWelfare = a.officialWelfareId
      const isOfficialAny = isOfficial || isOfficialWelfare
      const desc_date = new Date(a.start).getFullYear() <= 2001 ? '' : `开始于${parseTime(a.start)}的`
      const desc = `${desc_date}${a.length}天${a.name},${a.description}`
      let prefix = ''
      let tag_type = ''
      if (isOfficial) {
        prefix = '【法定节假日】'
        tag_type = 'primary'
      } else if (isOfficialWelfare) {
        prefix = '【官方福利假】'
        tag_type = 'warning'
      } else {
        prefix = '【用户自填写】'
        tag_type = 'danger'
      }
      const result = {
        desc: `${prefix}${desc}`,
        tag_type,
        isOfficial,
        isOfficialWelfare,
        isOfficialAny,
      }
      return Object.assign(result, a)
    }
  }
}
</script>
<style scoped lang="scss">
.align-right {
  margin-right: 0.5rem;
}
</style>
