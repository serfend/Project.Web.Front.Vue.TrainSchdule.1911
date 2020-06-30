<template>
  <el-card style="margin:0 2% 0 2%">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('form.grade.phy.about.title')">
        <About />
      </el-tab-pane>
      <el-tab-pane :label="$t('form.grade.phy.subject.title')">
        <span>施工中</span>
      </el-tab-pane>
      <el-tab-pane :label="$t('form.grade.phy.standard.title')">
        <span>施工中</span>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import About from './About'
export default {
  name: 'Rules',
  components: { About },
  data: () => ({
    activeName: null
  })
}
</script>

<style>
</style>
