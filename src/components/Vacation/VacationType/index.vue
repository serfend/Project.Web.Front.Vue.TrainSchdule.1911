<template>
  <span>
    <el-popover
      v-if="v"
      v-model="show"
      trigger="hover"
      placement="top"
      @hide="onHide"
      @show="hasShow = true"
    >
      <VacationTypeDetail v-if="hasShow" v-model="v" />
      <span slot="reference">
        <el-tag v-if="showTag" :type="v.primary?'success':'danger'">{{ v.alias }}</el-tag>
        <span v-else>
          <span style="float: left">{{ v.alias }}</span>
          <span v-if="!v.allowBeforePrimary&&!v.primary&&leftLength>0" class="warning">正休假未完成</span>
          <span v-else-if="v.primary&&leftLength==0" class="warning">已无假可休</span>
        </span>
      </span>
    </el-popover>
    <span v-else>{{ !type?'无类别':type }}</span>
  </span>
</template>

<script>
import VacationTypeDetail from './VacationTypeDetail'
export default {
  name: 'VacationType',
  components: { VacationTypeDetail },
  model: {
    prop: 'type',
    event: 'change',
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    showTag: {
      type: Boolean,
      default: true,
    },
    leftLength: {
      type: Number,
      default: 0,
    },
    directShow: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    show: false,
    hasShow: false,
  }),
  computed: {
    v() {
      const dict = this.vacationTypesDic
      if (!dict) return null
      const s = dict[this.type]
      return s
    },
    vacationTypes() {
      const types = this.vacationTypesDic
      if (!types) return null
      const keys = Object.keys(types)
      return keys.map((i) => types[i])
    },
    vacationTypesDic() {
      return this.$store.state.vacation.vacationTypes
    },
  },
  watch: {
    directShow: {
      handler(val) {
        this.show = val
      },
    },
  },
  methods: {
    onHide() {
      this.$emit('update:directShow', false)
    },
  },
}
</script>
<style lang="scss" scoped>
.warning {
  float: right;
  color: #ff92a6;
  font-size: 0.7rem;
}
</style>
