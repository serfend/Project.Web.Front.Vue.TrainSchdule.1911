<template>
  <div
    v-loading="loading"
    class="display-item"
  >{{ companyCode }} load {{ loading?'pending':`${dataLength} items` }}</div>
</template>
<script>
import { details, summary } from '@/api/statistics'
import { companyChild } from '@/api/company'
export default {
  name: 'StatisticsDataDriver',
  props: {
    companyCode: {
      type: String,
      default: null
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
      this.$emit('update:loading', this.loadingArray.join(' '))
    },
    refresh() {
      this.showLoading(1, '加载统计')
      return this.initParentCompany(this.companyCode).then(data => {
        this.$emit('update:data', data)
        this.showLoading(1, '加载完成')
        setTimeout(() => {
          this.showLoading(1, false)
        }, 1000)
      })
    },
    initParentCompany(companyCode) {
      return companyChild(companyCode).then(data => {
        var targets = [companyCode].concat(data.list.map(i => i.code))
        return this.initCompanies(targets)
      })
    },
    initCompanies(companies) {
      return new Promise((res, rej) => {
        var statisticsDic = {}
        var cmpStr = companies.join('##')
        this.loading = true
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
              res(r)
            })
          })
          .catch(e => {
            rej(e)
          })
          .finally(() => {
            this.loading = false
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
