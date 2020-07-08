<template>
  <el-card>
    <template slot="header">
      <h3>{{ $t('default.app.phyGrade.exam.title') }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <el-card>
      <el-form inline label-width="5rem">
        <el-form-item label="名称">
          <CompanySelector v-model="form.name" />
        </el-form-item>
        <el-form-item label="负责单位">
          <CompanySelector v-model="form.holdBy" />
        </el-form-item>
        <el-form-item label="创建人">
          <UserSelector v-model="form.createBy" />
        </el-form-item>
        <el-form-item label="负责人">
          <UserSelector v-model="form.handleBy" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-table :data="list">
      <el-table-column label="id">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.description">
            <span>{{ scope.row.name }}</span>
            <span>{{ parseTime(scope.row.create) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="负责单位">
        <template slot-scope="scope">
          <el-input v-model="scope.row.holdBy" />
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <el-input v-model="scope.row.createBy" />
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template slot-scope="scope">
          <el-input v-model="scope.row.handleBy" />
        </template>
      </el-table-column>
      <el-table-column label="考核日期">
        <template slot-scope="scope">
          <el-input v-model="scope.row.executeTime" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="success">查看成绩</el-link>
          <el-button type="success" @click="save(scope.row)">保存</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" style="width:100%" @click="newExam">新 增 考 核</el-button>
    <ExamEdit ref="examEdit" v-model="list[focus]" />
    <Pagination :pagesetting="pages" :total-count="totalCount" />
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import CompanySelector from '@/components/Company/CompanySelector'
import UserSelector from '@/components/User/UserSelector'
import ExamEdit from './ExamEdit'
import { createNewExam, postExam, getExam } from '@/api/grade/grade'
import { parseTime } from '@/utils'
export default {
  name: 'Exam',
  components: { Pagination, CompanySelector, UserSelector, ExamEdit },
  data: () => ({
    focus: 0,
    list: [],
    form: createNewExam(),
    pages: {
      pageIndex: 0,
      pageSize: 20
    },
    totalCount: 0
  }),
  mounted() {
    this.refresh()
  },
  methods: {
    parseTime,
    postExam,
    refresh() {
      const pages = this.pages
      getExam({ ...this.form, pages }).then(data => {
        console.log(data)
      })
    },
    save(row) {},
    remove(row) {},
    newExam(row) {
      this.nowIndex = row.$index
      this.$refs.examEdit.show = true
    }
  }
}
</script>

<style>
</style>
