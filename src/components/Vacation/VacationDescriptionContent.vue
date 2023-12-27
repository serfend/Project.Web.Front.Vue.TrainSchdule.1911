<template>
  <div v-loading="loading" :class="smaller ? 'smaller-card' : ''">
    <ul v-if="!loading_result" class="tooltip-vacation">
      <li>
        <b>全年假期天数：</b>
        <span>{{ innerData.yearlyLength }}</span>天
      </li>
      <li>
        <b>当前已休次数：</b>
        <span>{{ innerData.nowTimes }}</span>次
      </li>
      <li>
        <b>剩余假期天数：</b>
        <span>{{ innerData.leftLength }}</span>天
      </li>
      <li>
        <b>全年可休路途：</b>
        <span>{{ innerData.maxTripTimes }}</span>次
      </li>
      <li>
        <b>当前已休路途：</b>
        <span>{{ innerData.onTripTimes }}</span>次
      </li>
      <li>
        <b>备注：</b>
        <span>{{ rawDescription || innerData.description || "暂无" }}</span>
      </li>
      <li v-if="innerData.additionals">
        <b>其他假期：</b>
        <el-tooltip
          v-if="innerData.additionals.length > 0"
          effect="light"
          placement="right"
        >
          <div slot="content">
            <VacAdditionalTags v-model="innerData.additionals" :inline="false" />
          </div>
          <span>{{
            innerData.additionals.reduce((prev, cur) => prev + cur.length, 0)
          }}天</span>
        </el-tooltip>
        <span v-else>无</span>
      </li>
    </ul>
    <div v-else>
      <div v-if="rawDescription" style="width:70%">
        <div>- {{ rawDescription }}</div>
        <el-divider />
      </div>
      <h2>{{ loading_result }}</h2>
      <div>以下原因可能导致出现该情况：</div>
      <div>· 用户提交时个人信息不完善。</div>
      <div>· 过于久远，数据缺失。</div>
      <div>· 数据存在异常，尝试联系管理员。</div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getUsersVacationLimit } from '@/api/user/userinfo'
export default {
  name: 'VacationDescriptionContent',
  components: {
    VacAdditionalTags: () => import('./VacAdditionalTags')
  },
  props: {
    usersVacation: { type: Object, default: () => ({}) },
    userid: { type: String, default: null },
    vacationYear: { type: Number, default: null }, // 年度，默认空值
    rawDescription: { type: String, default: null },
    loadingResult: { type: String, default: null },
    smaller: { type: Boolean, default: true },
  },
  data: () => ({
    loading: false,
    innerData: {},
    loading_result: null
  }),
  watch: {
    usersVacation: {
      handler(val) {
        this.updateVacation(val)
      },
      immediate: true,
      deep: true
    },
    userid: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    },
    vacationYear: {
      handler(val) {
        this.refresh()
      }
    }
  },
  methods: {
    getAdditional(a) {
      const isOfficial = a.officialAdditionId
      const isOfficialWelfare = a.officialWelfareId
      const isOfficialAny = isOfficial || isOfficialWelfare
      const desc = `开始于${parseTime(a.start)}的${a.length}天${a.name},${
        a.description
      }`
      const prefix = isOfficialAny ? '' : '【用户自报假】'
      return {
        desc: `${prefix}${desc}`,
        isOfficial,
        isOfficialWelfare
      }
    },
    updateVacation(data) {
      this.innerData = data
      this.loading_result = data ? null : '无休假信息相关记录'
    },
    refresh() {
      const { userid, vacationYear } = this
      if (!userid) {
        return
      }
      this.loading = true
      getUsersVacationLimit({ userid, vacationYear })
        .then(data => {
          this.updateVacation(data)
          this.$emit('update:usersVacation', this.innerData)
        })
        .catch(e => {
          this.loading_result = JSON.stringify(e)
        })
        .finally(() => {
          this.loading = false
          this.$emit('update:loadingResult', this.loadingResult)
        })
    },
    parseTime(val) {
      return parseTime(val, '{y}年{m}月{d}日')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/element-variables";
.tooltip-vacation {
  width: 260px;
  ul,
  li {
    list-style: none;
    letter-spacing: 1px;
    span {
      color: $--color-primary;
    }
  }
}
.smaller-card {
  font-size: 12px;
  line-height: 18px;
}
</style>
