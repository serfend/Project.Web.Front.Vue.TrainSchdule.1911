<template>
  <el-form :style="{width:width}">
    <el-form-item label="代码">{{ innerInfo.code }}</el-form-item>
    <el-form-item label="名称">{{ innerInfo.name }}</el-form-item>
    <el-form-item label="类别">{{ innerInfo.type }}</el-form-item>
    <el-form-item label="管理成员">
      <div v-if="innerInfo.managers.length==0">无管理</div>
      <div v-else-if="innerInfo.managers.length==1">
        <el-link
          icon="el-icon-s-custom"
          :target="`/#/profile/${innerInfo.managers[0].id}`"
        >{{ innerInfo.managers[0].realName }}</el-link>
      </div>
      <el-dropdown v-else>
        <span class="el-dropdown-link">
          <el-link
            icon="el-icon-s-custom"
            :target="`/#/profile/${innerInfo.managers[0].id}`"
          >{{ innerInfo.managers[0].realName }}</el-link>
          等{{ innerInfo.managers.length }}人
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="u in innerInfo.managers" :key="u.id" icon="el-icon-s-custom">
            <el-link icon="el-icon-s-custom" :target="`/#/profile/${u.id}`">{{ u.realName }}</el-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Company',
  props: {
    data: {
      type: Object,
      default() {
        return this.defaultData()
      }
    },
    width: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      innerInfo: this.defaultData()
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        var defaultInfo = this.defaultData()
        for (var i in this.innerInfo) {
          if (val[i]) this.innerInfo[i] = val[i]
          else this.innerInfo[i] = defaultInfo[i]
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    defaultData() {
      return {
        name: '无名称',
        type: '无类别',
        code: '未知代码',
        managers: [] // Array of UserDto
      }
    }
  }
}
</script>

<style>
</style>
