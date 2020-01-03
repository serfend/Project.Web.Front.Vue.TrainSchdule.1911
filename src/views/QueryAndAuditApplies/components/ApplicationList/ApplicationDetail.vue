<template>
  <el-dialog
    :show-close="false"
    :visible.sync="detailDrawer.show"
    custom-class="p-fixed f-right apply-detail"
    top="0"
    width="408px"
  >
    <div slot="title" class="apply-detail-header">
      <div class="layout row justify-space-between align-center">
        详情
        <div class="d-flex align-center">
          <el-button-group>
            <el-button
              icon="el-icon-caret-left"
              size="small"
              type="primary"
              @click="changeApply('prev')"
            />
            <el-button
              icon="el-icon-caret-right"
              size="small"
              type="primary"
              @click="changeApply('next')"
            />
          </el-button-group>
          <el-tooltip content="关闭" effect="dark">
            <i class="el-icon-remove red--text title ml-2" @click="detailDrawer.show = false" />
            <!-- content to trigger tooltip here -->
          </el-tooltip>
        </div>
      </div>
    </div>
    <ApplicationDetail
      :apply-id="detailDrawer.id"
      :basic="detailDrawer.basic"
      :detail="detailDrawer.data"
    >
      <slot
        v-if="myUserid"
        slot="action"
        slot-scope="{applyid, row}"
        :applyid="applyid"
        :row="row"
        name="action"
      />
      <span v-else>
        请先
        <a href="login">登录</a>
      </span>
    </ApplicationDetail>
  </el-dialog>
</template>

<script>
export default {}
</script>

<style>
</style>