<template>
  <el-card v-loading="!base">
    <el-row v-if="base">
      <el-col
        :span="8"
      ><el-form label-width="5rem">
        <el-form-item label="姓名">
          <span>{{ base.realName }}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{ base.phone }}</span>
        </el-form-item>
        <el-form-item label="籍贯">
          <span>{{ base.hometown }}</span>
        </el-form-item>
        <el-form-item label="单位">
          <span>{{ base.companyName }}</span>
        </el-form-item>
      </el-form>
      </el-col>
      <el-col :span="16">
        <UserFormItem direct-show-card direct-expand-description :userid="base.userId" />
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'UserBaseInfoCard',
  components: {
    UserFormItem: () => import('@/components/User/UserFormItem')
  },
  model: {
    prop: 'base',
    event: 'change'
  },
  props: {
    base: { type: Object, default: () => ({}) }
  },
  data: () => ({
    loading: false
  }),
  computed: {},
  methods: {}
}
</script>
