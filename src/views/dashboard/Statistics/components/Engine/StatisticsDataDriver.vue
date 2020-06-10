<template>
  <div
    v-loading="loading"
    class="display-item"
  >{{ company }} load {{ loading?'pending':`${dataLength} items` }}</div>
</template>
<script>
import { details, summary, appliesNew, appliesComplete } from '@/api/statistics'
import { groupByFiled } from '@/utils/data-handle'
import { debounce } from '@/utils'
export default {
  name: 'StatisticsDataDriver',
  props: {
    company: {
      type: String,
      default: null
    },
    companies: {
      type: Array,
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
    dataLength: 0,
    prevOinfo: null,
    dataIsLoading: false
  }),
  computed: {
    updatedCompanies() {
      return debounce(() => {
        return this.initCompanies()
      }, 500)
    },
    updatedCompany() {
      return debounce(() => {
        return this.initAppliesCount()
      }, 500)
    }
  },
  methods: {
    refresh() {
      console.log('request refresh')
      if (this.dataIsLoading) return
      this.dataIsLoading = true
      Promise.all([this.updatedCompany(), this.updatedCompanies()]).then(() => {
        this.showLoading(0, false)
        setTimeout(() => {
          this.dataIsLoading = false
        }, 3000)
      })
    },
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
      if (oinfo === this.prevOinfo) return
      this.prevOinfo = oinfo
      // console.log('loading modify', oinfo)
      this.$emit('update:loading', oinfo)
    },
    initAppliesCount() {
      var company = this.company
      this.showLoading(2, '加载休假去向')
      return new Promise((res, rej) => {
        var action = [
          appliesNew(company, this.dateRange.start, this.dateRange.end),
          appliesComplete(company, this.dateRange.start, this.dateRange.end)
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
    initCompanies() {
      return new Promise((res, rej) => {
        var statisticsDic = {}
        console.log('init companies data', this.companies)
        if (!this.companies) return res()
        var cmpStr = this.companies.join('##')
        this.showLoading(2, '各单位信息')
        summary(cmpStr)
          .then(data => {
            this.dataLength = data.list.length
            for (var s in data.list) {
              if (!statisticsDic[data.list[s].id]) {
                statisticsDic[data.list[s].id] = data.list[s]
              }
            }
            this.showLoading(2, '详细信息')
            details(
              this.companies,
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
