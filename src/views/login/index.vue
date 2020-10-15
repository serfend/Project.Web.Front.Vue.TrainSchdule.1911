<template>
  <el-card style="text-align:center">
    <el-row>
      <el-col :span="12">
        <el-image :src="bg" />
      </el-col>
      <el-col :span="12">
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

<style>
</style>
