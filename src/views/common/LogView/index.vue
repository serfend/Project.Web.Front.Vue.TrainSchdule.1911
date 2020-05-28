<template>
  <el-form inline>
    <el-card style="margin:20px" shadow="hover">
      <el-row>
        <el-col :span="6">
          <el-form-item label="uid">
            <el-input v-model="uid" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="刷新间隔">
            <el-input v-model="refreshInterval" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始日期">
            <el-date-picker v-model="lastLogUpdate" type="datetime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
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
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备">
            <el-select
              v-model="device"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或添加设备名称"
            >
              <el-option
                v-for="item in messageMap('device')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="ip">
            <el-select
              v-model="ip"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或添加来源ip"
            >
              <el-option
                v-for="item in messageMap('ip')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="包含信息">
            <el-input v-model="message" />
          </el-form-item>
        </el-col>
      </el-row>
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
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-tag
                :color="operationDic[scope.row.operation].foreColor"
              >{{ operationDic[scope.row.operation].name }}</el-tag>
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
          <el-table-column label="设备" width="120">
            <template slot-scope="scope">{{ scope.row.device }}</template>
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
import {
  getReport,
  report,
  getReportDic,
  getUserActionOperationDic
} from '@/api/account'
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
      rank: [], // 选中指定rank
      ip: [], // 选中指定ip
      device: [], // 选中指定device
      message: null,
      rankDicArray: [], // 日志等级设置
      rankDic: {},
      operationDicArray: [], // 日志操作设置
      operationDic: {},
      tableData: []
    }
  },
  computed: {},
  watch: {
    uid: {
      handler(val) {
        var t = new Date(localStorage.getItem(`log.lastupdate@${this.uid}`))
        if (t) {
          this.lastLogUpdate = t
        } else {
          this.lastLogUpdate = new Date()
        }
        this.tableData = []
      },
      immediate: true
    }
  },
  mounted() {
    const method = this.updatenew
    var opeationDic = new Promise((resolve, reject) => {
      getUserActionOperationDic()
        .then(data => {
          this.operationDic = data.list
          for (var i in this.operationDic) {
            this.operationDicArray.push(this.operationDic[i])
          }
          return resolve()
        })
        .catch(e => {
          return reject(e)
        })
    })
    var reportDic = new Promise((resolve, reject) => {
      getReportDic()
        .then(data => {
          this.rankDic = data.list
          for (var i in this.rankDic) {
            this.rankDicArray.push(this.rankDic[i])
          }
          return resolve()
        })
        .catch(e => {
          return reject(e)
        })
    })
    Promise.all([opeationDic, reportDic])
      .then(() => {
        this.logUpdateId = setInterval(() => {
          method()
        }, 300)
      })
      .catch(e => {
        console.log(e)
        this.$message.error('初始化失败:' + e.message)
      })
  },
  destroyed() {
    clearInterval(this.logUpdateId)
  },
  methods: {
    report,
    getReport,
    format,
    messageMap(keyName) {
      var l = this.tableData.map(i => {
        return {
          value: i[keyName],
          label: i[keyName]
        }
      })
      var keys = {}
      var result = []
      for (var index in l) {
        var i = l[index]
        if (!keys[i.value]) {
          keys[i.value] = true
          result.push(i)
        }
      }
      return result
    },
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
          this.rank.length === 0 ? null : this.rank,
          this.ip.length === 0 ? null : this.ip,
          this.device.length === 0 ? null : this.device,
          this.message ? this.message : null
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
