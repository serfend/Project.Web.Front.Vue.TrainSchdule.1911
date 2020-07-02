<template>
  <el-card v-if="iSubject">
    <template slot="header">
      <h3>{{ iSubject.alias }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <el-table :data="iSubject.standards">
      <el-table-column label="性别" width="150rem">
        <template slot-scope="scope">
          <GenderBtn v-model="scope.row.gender" :disabled="false" />
        </template>
      </el-table-column>
      <el-table-column label="年龄范围">
        <template slot-scope="scope">
          <el-slider
            v-model="scope.row.ageRange"
            range
            show-stops
            :min="getAgeRange(scope.row.minAge,0)"
            :max="getAgeRange(scope.row.minAge,1)"
          />
        </template>
      </el-table-column>
      <el-table-column label="合格分数" width="100rem">
        <template slot-scope="scope">
          <el-input v-model="scope.row.baseStandard" />
        </template>
      </el-table-column>
      <el-table-column label="满分后计算公式" width="200rem">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expressionWhenFullGrade" />
        </template>
      </el-table-column>
      <el-table-column label="评判分数" width="50rem">
        <template slot-scope="scope">
          <el-link @click="checkStandard(scope.row)">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200rem">
        <template slot-scope="scope">
          <el-button el-button type="warning" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import GenderBtn from '@/components/User/GenderBtn'
export default {
  name: 'Standard',
  components: { GenderBtn },
  props: {
    subject: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    form: {}
  }),
  computed: {
    iSubject: {
      get() {
        const s = this.subject
        if (!s) return null
        s.standards = s.standards.map(i => {
          i.ageRange = [i.minAge, i.maxAge]
          return i
        })
        console.log('get', s.standards[0].ageRange)

        return s
      },
      set(val) {
        const s = val
        // debugger
        s.standards = s.standards.map(i => {
          i.minAge = i.ageRange[0]
          i.maxAge = i.ageRange[1]
          return i
        })
        console.log(s)
        this.$emit('subject', s)
      }
    }
  },
  methods: {
    refresh() {},
    getAgeRange(val, minOrMax) {
      val = Math.round(val / 10) * 10
      switch (minOrMax) {
        case 0:
          return 0
        case 1:
          return 60
      }
    },
    handleAgeChange(v, row) {
      console.log(arguments)
      console.log(v)
      const index = row.$index
      const standard = Object.assign(this.subject.standards[index], {
        maxAge: v[1],
        minAge: v[0]
      })
      this.$emit('standardUpdate', standard)
    }
  }
}
</script>

<style>
</style>
