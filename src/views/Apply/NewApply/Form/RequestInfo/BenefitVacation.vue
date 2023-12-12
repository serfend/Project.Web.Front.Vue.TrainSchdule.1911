<template>
  <div v-loading="loading">
    <div v-if="anyItems">
      <el-collapse v-model="nowIndex" accordion>
        <el-collapse-item
          v-for="(item, index) in innerList"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <span v-if="item.name && item.length">
              <span>{{ item.name }} {{ item.length }}天</span>
              <el-tag v-if="item.options & 2">允许跨年</el-tag>
              <el-tag v-else type="warning">不允许跨年</el-tag>
              <el-tag v-if="item.officialWelfareId">官方假</el-tag>
              <el-tag v-else type="warning">用户自报假</el-tag>
            </span>
            <span v-else>请点击并填写其他假信息</span>
          </template>
          <el-form label-width="6rem">
            <el-form-item label="其他假">
              <el-autocomplete
                v-model="innerList[index].name"
                :fetch-suggestions="querySearch"
                placeholder="选择/输入其他假"
                @select="selectChange"
              />
            </el-form-item>
            <el-form-item label="休假天数">
              <el-input-number
                v-model.number="innerList[index].length"
                :min="1"
              />
            </el-form-item>
            <el-form-item label="其他假理由">
              <el-input
                v-model="innerList[index].description"
                type="textarea"
                maxlength="50"
                show-word-limit
                :style="{ width: '30%' }"
                @input="onReasonChange(innerList[index])"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-delete"
                type="text"
                style="color:#ff0000"
                @click="removeSingle(index)"
              >删除</el-button>
              <el-tag
                v-if="!innerList[index].reasonModified"
                type="danger"
              >请正确填写理由</el-tag>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-button
      icon="el-icon-plus"
      type="text"
      @click="addSingle"
    >添加</el-button>
    <div v-if="anyItems && validated">
      <span>预览其他假：</span>
      <VacAdditionalTags v-model="innerList" />
    </div>
  </div>
</template>

<script>
import { benefitList } from '@/api/apply'
export default {
  name: 'BenefitVacation',
  components: {
    VacAdditionalTags: () => import('@/components/Vacation/VacAdditionalTags')
  },
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    vacationType: { type: String, default: null },
    list: { type: Array, default: () => [] }
  },
  data: () => ({
    loading: false,
    benefitList: [],
    nowIndex: -1,
    innerList: [],
    validated: false // 是否有效
  }),
  computed: {
    anyItems() {
      const { innerList } = this
      return innerList && innerList.length > 0
    },
    benefitDict() {
      const { benefitOptionList } = this
      const result = {}
      if (!benefitOptionList) return result
      benefitOptionList.map(x => {
        result[x.name] = x
      })
      return result
    },
    benefitOptionList() {
      // 创建新的实例以防原始配置被修改
      const { benefitList } = this
      if (!benefitList) return []
      return benefitList.map(x => Object.assign({}, x))
    }
  },
  watch: {
    vacationType: {
      handler(val) {
        this.updateBenefit()
      },
      immediate: true
    },
    list: {
      handler(val) {
        this.innerList = val
      },
      deep: true
    },
    innerList: {
      handler(val) {
        this.$nextTick(() => {
          const list = this.innerList
          if (list) {
            list.map(x => this.checkValid(x))
            this.validated = this.validate(list)
          }
          // if (!this.validated) return
          this.$emit('change', list)
        })
      },
      deep: true
    }
  },
  mounted() {
    this.updateBenefit()
  },
  methods: {
    validate(list) {
      const anyNotModified = !!list.find(x => !x.reasonModified) // 有没有填原因的
      return anyNotModified
    },
    onReasonChange(item) {
      const { description } = item
      item.reasonModified = false
      if (!description) return
      if (description.indexOf('xxx') > -1) return
      item.reasonModified = true
    },
    updateBenefit() {
      this.loading = true
      benefitList(this.vacationType)
        .then(data => {
          this.benefitList = data.list.map(x => {
            const item = Object.assign(
              {
                value: x.name,
                officialWelfareId: x.id, // 标记为官方假
                reasonModified: false // 用户需填写原因
              },
              x
            )
            delete item.id
            return item
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    querySearch(key, cb) {
      let list = this.benefitOptionList
      if (key) list = list.filter(i => i.name.indexOf(key) > -1)
      const results = list.map(i => Object.assign({}, i)) // 去关联
      cb(results)
    },
    checkValid(item) {
      if (this.isChecking) return
      this.isChecking = true
      try {
        const { benefitDict } = this
        const checkOfficial = benefitDict[item.name]
        if (!checkOfficial) {
          // 同步为空值
          item.officialWelfareId = null
          item.options = 0
        }

        if (checkOfficial) {
          const copy = Object.assign({}, checkOfficial)
          // 同步为官方假
          item.name = copy.name
          item.officialWelfareId = copy.officialWelfareId
          item.options = copy.options
        }
      } finally {
        this.isChecking = false
      }
    },
    selectChange(item) {
      item.reasonModified = false // 发生变化时重置
      this.checkValid(item)
      // 全部值赋值
      const index = this.nowIndex
      this.innerList.splice(index, 1, item)
    },
    addSingle() {
      this.innerList.push({
        name: '',
        description: '填写其他假原因',
        length: 0
      })
      this.nowIndex = this.innerList.length - 1
    },
    removeSingle(index) {
      this.innerList.splice(index, 1)
    }
  }
}
</script>

<style></style>
