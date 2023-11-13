<template>
  <div>
    <div v-if="innerList && innerList.length > 0">
      <el-collapse v-model="nowIndex" accordion>
        <el-collapse-item v-for="(item, index) in innerList" :key="index" :name="index">
          <template slot="title">
            <span v-if="item.name && item.length">{{ item.name }} {{ item.length }}天</span>
            <span v-else>无效的信息</span>
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
              <el-input-number v-model.number="innerList[index].length" :min="1" />
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
    <el-button icon="el-icon-plus" style="width: 100%" @click="addSingle">添加</el-button>
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
    benefitList: [],
    nowIndex: -1,
    innerList: []
  }),
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
          this.$emit('change', this.innerList)
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
      benefitList(this.vacationType).then((data) => {
        this.benefitList = data.list.map(x => ({
          value: x.name,
          length: x.length,
          description: x.description
        }))
      })
    },
    querySearch(key, cb) {
      if (!key) return cb(this.benefitList)
      var results = this.benefitList
        .filter(i => i.value.indexOf(key) > -1)
        .map(i => Object.assign({}, i))
      cb(results)
    },
    selectChange(item) {
      const list_item = this.list[this.nowIndex]
      list_item.description = item.description
      list_item.length = item.length
    },
    addSingle() {
      this.innerList.push({
        name: '',
        description: '填写其他假原因',
        length: 0
      })
    },
    removeSingle(index) {
      this.innerList.splice(index, 1)
    }
  }
}
</script>

<style></style>
