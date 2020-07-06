<template>
  <el-card style="margin:0 2% 0 2%">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('default.app.phyGrade.rules.about.title')" name="about">
        <About />
      </el-tab-pane>
      <el-tab-pane :label="$t('default.app.phyGrade.rules.subject.title')" name="subject">
        <Subject :subject.sync="subject" @standardUpdate="standardUpdate" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('default.app.phyGrade.rules.standard.title')"
        name="standard"
        :disabled="!subject"
      >
        <Standard :subject.sync="subject" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import About from './About'
import Subject from './Subject'
import Standard from './Standard'
export default {
  name: 'Rules',
  components: { About, Subject, Standard },
  data: () => ({
    activeName: 'about',
    subject: null
  }),
  watch: {
    subject: {
      handler(val) {
        this.activeName = 'standard'
      }
    }
  },
  methods: {
    standardUpdate(val) {
      console.log(val)
    }
  }
}
</script>

<style>
</style>
