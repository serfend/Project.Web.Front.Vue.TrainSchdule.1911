<template>
  <div
    v-loading="loading"
    class="display-item"
  >{{ companyCode }} load {{ loading?'pending':`${dataLength} items` }}</div>
</template>
<script>
import { details, summary, appliesNew, appliesComplete } from '@/api/statistics'
import { companyChild } from '@/api/company'
import { groupByFiled } from '@/utils/data-handle'
export default {
  name: 'StatisticsDataDriver',
  props: {
    companyCode: {
      type: String,
      default: null
    },
    dateRange: {
      type: Object,
      default: () => ({
        start: new Date(new Date() - 7 * 86400000),
        end: new Date()
      })
    }
  },
  data: () => ({
    loading: false,
    loadingArray: [],
    dataLength: 0
  }),
  methods: {
    showLoading(rank, info) {
      this.loadingArray[rank - 1] = info
      if (!info) {
        var i = 1
        while (this.loadingArray[i]) i++
        rank = i - 1
      }
      this.loadingArray = this.loadingArray.splice(0, rank)
      var oinfo = this.loadingArray.join(' ')
      if (!oinfo && this.loading) oinfo = '...'
      this.$emit('update:loading', oinfo)
    },
    refresh() {
      this.loading = true
      this.showLoading(1, '加载统计')
      var actions = []
      actions.push(this.initParentCompany())
      actions.push(this.initAppliesCount())
      return Promise.all(actions).then(() => {
        this.showLoading(1, '加载完成')
        this.loading = false
        setTimeout(() => {
          this.showLoading(1, false)
        }, 1000)
      })
    },
    initAppliesCount() {
      var companyCode = this.companyCode
      this.showLoading(2, '加载休假去向')
      return new Promise((res, rej) => {
        var action = [
          appliesNew(companyCode, this.dateRange.start, this.dateRange.end),
          appliesComplete(companyCode, this.dateRange.start, this.dateRange.end)
        ]
        Promise.all(action)
          .then(data => {
            var d = {
              new: groupByFiled(data[0].list, 'type'),
              complete: groupByFiled(data[1].list, 'type')
            }
            var types = {}
            Object.keys(d.new).forEach((v, i, arr) => {
              types[v] = true
            })
            Object.keys(d.complete).forEach((v, i, arr) => {
              types[v] = true
            })
            d.types = Object.keys(types)
            if (!d.types || d.types.length === 0) d.types = ['无数据']
            this.$emit('update:appliesData', d)
            res(data)
          })
          .catch(e => rej(e))
          .finally(() => {
            this.showLoading(2, false)
          })
      })
    },
    initParentCompany() {
      var companyCode = this.companyCode
      return companyChild(companyCode).then(data => {
        var targets = [companyCode].concat(data.list.map(i => i.code))
        return this.initCompanies(targets)
      })
    },
    initCompanies(companies) {
      return new Promise((res, rej) => {
        var statisticsDic = {}
        var cmpStr = companies.join('##')
        this.showLoading(2, '各单位信息')
        return summary(cmpStr)
          .then(data => {
            this.dataLength = data.list.length
            for (var s in data.list) {
              if (!statisticsDic[data.list[s].id]) {
                statisticsDic[data.list[s].id] = data.list[s]
              }
            }
            this.showLoading(2, '详细信息')
            return details(
              companies,
              data.list.map(i => i.id),
              { pageIndex: 0, pageSize: -1 }
            ).then(de => {
              var r = this.initData(de)
              this.$emit('update:data', r)
              res()
            })
          })
          .catch(e => {
            rej(e)
          })
      })
    },
    initData(data) {
      const labelItem = ['year', 'season', 'month', 'week']
      var result = {
        labelData: {},
        companyDic: {}
      }
      for (var d in data.list) {
        var item = data.list[d]
        for (var label in labelItem) {
          if (item.statisticsId.toLowerCase().indexOf(labelItem[label]) > -1) {
            var key = `data_${labelItem[label]}`
            if (!result.labelData[key]) result.labelData[key] = {}
            if (!result.labelData[key][item.company.code]) {
              result.labelData[key][item.company.code] = {}
            }
            result.labelData[key][item.company.code][item.statisticsId] = item
            result.companyDic[item.company.code] = item.company
            break
          }
        }
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
}
</style>
