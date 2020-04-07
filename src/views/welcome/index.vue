<template>
  <el-container>
    <div class="element">
      <el-card class="menu">
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
        <div class="test">
          <svg-icon icon-class="注册" />
          <p>注册</p>
        </div>
      </el-card>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
export default {
  name: 'welcome',
  components: { AppIcon },
  data() {
    return {}
  },
  computed: {
    dutyType() {
      return this.$store.state.user.dutiesType
    }
  },
  methods: {
    authRegisterUser(isToRegister) {
      this.$store.state.user.isToRegister = isToRegister
      return this.$router.push(`/register/main`)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  height: 500px;
}
/*背景局部清晰*/
.el-container {
  background: url("../../assets/jpg/bg.jpg") no-repeat center center;
  background-size: 100%;
  height: 100%;
  background-size: cover;
  background-attachment: fixed;
  background-color: #cccccc;
}
.element {
  width: 600px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto; /* 有了这个就自动居中了 */
  background: inherit;
}
body {
  height: 100vh;
  background: -webkit-radial-gradient(center, #c2e59c, #64b3f4);
  background: radial-gradient(center, #c2e59c, #64b3f4);
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.test {
  float: left;
  width: 175px;
  height: 175px;
  line-height: 70px;
  background: #4483cf;
  text-align: center;
  font-size: 45px;
  color: #1607c0;
  border: solid 1px #3383af;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  border-radius: 20%;
  padding: 5px;
  margin: 5px;
}
.test:hover {
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.4);
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
  color: #ffffff;
}
.test:nth-child(4),
.test:nth-child(7) {
  clear: left;
}
</style>