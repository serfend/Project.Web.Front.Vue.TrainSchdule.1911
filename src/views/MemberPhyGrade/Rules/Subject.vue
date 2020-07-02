<template>
  <el-card>
    <template slot="header">
      <h3>{{ $t('default.app.phyGrade.rules.subject.title') }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <el-table :data="form.subjects">
      <el-table-column label="id">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column label="分组">
        <template slot-scope="scope">
          <el-input v-model="scope.row.group" />
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.alias" />
        </template>
      </el-table-column>
      <el-table-column label="是否倒序" width="80rem">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.countDown" />
        </template>
      </el-table-column>
      <el-table-column label="数值计算方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.valueFormat">
            <el-option
              v-for="item in valueFormatOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="标准" width="80rem">
        <template slot-scope="scope">
          <el-link @click="checkStandard(scope.row)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300rem">
        <template slot-scope="scope">
          <el-button el-button type="success" @click="edit(scope.row)">保存</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getSubjects } from '@/api/grade/phyGrade'
export default {
  name: 'Subject',
  data: () => ({
    loading: false,
    valueFormatOption: [
      { label: '按个数', value: 0 },
      { label: '按时分秒', value: 1 },
      { label: '按秒表', value: 2 }
    ],
    form: { auth: { authByUserId: null, code: null }, subjects: [] }
  }),
  mounted() {
    this.refresh()
  },
  methods: {
    checkStandard(row) {
      this.$emit('update:subject', Object.assign({ ageRange: [0, 0] }, row))
    },
    refresh() {
      this.loading = true
      getSubjects()
        .then(list => {
          this.form.subjects = list
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style>
</style>
