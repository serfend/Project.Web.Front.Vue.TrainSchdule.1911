<template>
  <el-card style="text-align:center">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-image :src="bg" fit="contain" class="full-img" />
      </el-col>
      <el-col :span="10">
        <LoginForm style="boa" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import bg from '@/assets/jpg/app/jianghe_logo.jpg'
import LoginForm from './LoginForm'
export default {
  name: 'Login',
  components: { LoginForm },
  data: () => ({
    bg: bg,
  }),
}
</script>

<style lang="scss" scoped>
.full-img {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
}
</style>
