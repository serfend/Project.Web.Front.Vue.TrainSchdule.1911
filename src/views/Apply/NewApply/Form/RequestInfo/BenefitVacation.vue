<template>
  <div v-loading="loading">
    <div v-if="innerList && innerList.length > 0">
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
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-delete"
                type="info"
                style="width: 100%"
                @click="removeSingle(index)"
              >删除</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-button
      icon="el-icon-plus"
      style="width: 100%"
      @click="addSingle"
    >添加</el-button>
  </div>
</template>

<script>
import { benefitList } from '@/api/apply'
export default {
  name: 'BenefitVacation',
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
    innerList: []
  }),
  computed: {
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
          if (list)list.map(x => this.checkValid(x))
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
    updateBenefit() {
      this.loading = true
      benefitList(this.vacationType)
        .then(data => {
          this.benefitList = data.list.map(x => {
            const item = Object.assign(
              {
                value: x.name,
                officialWelfareId: x.id // 标记为官方假
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
      if (!key) return cb(this.benefitOptionList)
      var results = this.benefitOptionList
        .filter(i => i.name.indexOf(key) > -1)
        .map(i => Object.assign({}, i))
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
          // 同步为官方假
          item.name = checkOfficial.name
          item.officialWelfareId = checkOfficial.officialWelfareId
          item.options = checkOfficial.options
        }
      } finally {
        this.isChecking = false
      }
    },
    selectChange(item) {
      this.checkValid(item)
      // 全部值赋值
      this.innerList[this.nowIndex] = item
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
