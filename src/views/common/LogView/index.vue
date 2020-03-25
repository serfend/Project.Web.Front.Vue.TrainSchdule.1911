<template>
  <el-form>
    <el-card style="margin:20px" shadow="hover">
      <el-form-item label="uid">
        <el-input v-model="uid" />
      </el-form-item>
      <el-form-item label="刷新间隔">
        <el-input v-model="refreshInterval" />
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker v-model="lastLogUpdate" type="datetime" />
      </el-form-item>
      <el-form-item label="信息等级">
        <el-select
          v-model="rank"
          class="full-width"
          placeholder="选择"
          multiple
          clearable
          @change="updatenew(true)"
        >
          <el-option
            v-for="item in rankDicArray"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
            <span :style="{'float': 'left','color':item.foreColor}">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-button v-loading="isLoading" type="success" style="width:100%;" @click="updatenew">立即刷新</el-button>
      </el-row>
      <el-row>
        <el-table
          v-loading="isLoading"
          :data="rank.length>0?tableData.filter(i=>rank.indexOf(i.rank)>-1):tableData"
          border
          style="width: 100%"
        >
          <el-table-column label="等级" width="120">
            <template slot-scope="scope">
              <el-tag :color="rankDic[scope.row.rank].foreColor">{{ rankDic[scope.row.rank].name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">{{ format(scope.row.date, 'zh_CN') }}</template>
          </el-table-column>
          <el-table-column label="内容">
            <template slot-scope="scope">{{ scope.row.description }}</template>
          </el-table-column>
          <el-table-column label="ip" width="120">
            <template slot-scope="scope">{{ scope.row.ip }}</template>
          </el-table-column>
          <el-table-column label="UserAgent">
            <template slot-scope="scope">{{ scope.row.ua }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleClick(scope.row)">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </el-form>
</template>

<script>
import { parseTime } from '@/utils'
import { getReport, report, getReportDic } from '@/api/account'
import { format } from 'timeago.js'
export default {
  name: 'LogView',
  data() {
    return {
      page: {
        pageIndex: 0,
        pageSize: 20
      },
      logUpdateId: '',
      lastLogUpdate: '',
      refreshInterval: 5000,
      isLoading: false,
      uid: '',
      rank: [],
      rankDicArray: [],
      rankDic: {},
      tableData: []
    }
  },
  watch: {
    uid: {
      handler(val) {
        this.lastLogUpdate = new Date(
          localStorage.getItem(`log.lastupdate@${this.uid}`)
        )
        this.tableData = []
      },
      immediate: true
    }
  },
  mounted() {
    const method = this.updatenew
    this.getReportDic().then(data => {
      this.rankDic = data.list
      for (var i in this.rankDic) {
        this.rankDicArray.push(this.rankDic[i])
      }
      this.logUpdateId = setInterval(() => {
        method()
      }, 300)
    })
  },
  destroyed() {
    clearInterval(this.logUpdateId)
  },
  methods: {
    report,
    getReport,
    getReportDic,
    format,
    handleClick(row) {
      console.log(row)
    },
    updatenew(isUserAction) {
      var checkIntervalFit = isUserAction
        ? 1
        : new Date() - this.lastLogUpdate - this.refreshInterval
      if (this.uid !== '' && checkIntervalFit > 0 && !this.isLoading) {
        var thisUpdate = new Date()
        var lastUpdate = this.lastLogUpdate
        // console.log(this.lastLogUpdate)
        localStorage.setItem(`log.lastupdate@${this.uid}`, thisUpdate)
        this.isLoading = true
        getReport(
          this.uid,
          parseTime(lastUpdate),
          parseTime(thisUpdate),
          this.page,
          this.rank.length === 0 ? null : this.rank
        ).then(data => {
          this.tableData = data.list.concat(this.tableData)
          if (this.tableData.length > this.page.pageSize) {
            this.tableData = this.tableData.splice(0, this.page.pageSize)
          }
          this.lastLogUpdate = thisUpdate
          this.isLoading = false
        })
      }
    }
  }
}
</script>

<style>
</style>
