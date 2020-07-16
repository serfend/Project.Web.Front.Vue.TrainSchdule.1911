<template>
  <span>
    <el-popover v-if="v" v-model="show" trigger="hover" placement="top" @hide="onHide">
      <div>
        <ul class="tooltip-vacation">
          <li>
            <h1>{{ v.alias }}</h1>
            <el-divider />
          </li>
          <li>
            <b>类型</b>
            <el-tag :type="v.primary?'primary':'danger'">{{ v.primary?'主假期':'非主假期' }}</el-tag>
          </li>
          <li>
            <b>长度范围</b>
            <span>{{ v.minLength }}天 到 {{ v.primary?'剩余假期天数':`${v.maxLength}天` }}</span>
          </li>
          <li>
            <b>政策</b>
            <div>
              <el-tag v-if="!v.allowBeforePrimary">仅正休结束后可提交</el-tag>
              <el-tag v-if="!v.caculateBenefit">无福利假</el-tag>
              <el-tag v-if="!v.canUseOnTrip">无路途</el-tag>
              <el-tag v-if="v.minusNextYear">次年扣正休</el-tag>
              <el-tag v-if="v.notPermitCrossYear">不允许跨年</el-tag>
            </div>
          </li>
          <li>
            <b>备注</b>
            <div v-for="(l,i) in v.description.split('\n')" :key="i">{{ l }}</div>
          </li>
        </ul>
      </div>
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
export default {
  name: 'VacationType',
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: {
      type: String,
      default: null
    },
    showTag: {
      type: Boolean,
      default: true
    },
    leftLength: {
      type: Number,
      default: 0
    },
    directShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false
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
      return keys.map(i => types[i])
    },
    vacationTypesDic() {
      return this.$store.state.vacation.vacationTypes
    }
  },
  watch: {
    directShow: {
      handler(val) {
        this.show = val
      }
    }
  },
  methods: {
    onHide() {
      this.$emit('update:directShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.warning {
  float: right;
  color: #ff92a6;
  font-size: 0.7rem;
}
.tooltip-vacation {
  width: 260px;
  ul,
  li {
    list-style: none;
    padding: 8px;
    letter-spacing: 1px;
    span {
      color: #00f;
    }
  }
}
</style>
