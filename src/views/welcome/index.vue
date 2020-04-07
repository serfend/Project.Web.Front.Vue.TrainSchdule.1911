<template>
  <el-container>
    <div style="margin:40px;width:100%">
      <el-row style="width:100%">
        <el-col v-for="i in list" :key="i.id" :xs="12" :sm="8" :md="6" :lg="4">
          <AppIcon
            style="margin:20px 20px"
            :href="i.href"
            :icon="i.icon"
            :size="130"
            :label="i.label"
          />
        </el-col>
      </el-row>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
export default {
  name: 'Welcome',
  components: { AppIcon },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    for (var i = 0; i < 10; i++) {
      this.list.push({
        id: i,
        label: `第${i}个App`,
        icon: '/favicon.png',
        href: '/#/log'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  background-size: 100%;
  background-size: cover;
  background-attachment: fixed;
  background-color: #cccccc;

  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to bottom,
    rgb(30, 30, 144),
    rgb(185, 157, 201),
    rgb(162, 104, 180)
  );
}
</style>
