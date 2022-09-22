<template>
  <div v-loading="!conference">
    <el-card v-if="conference" class="confer-card">
      <template #header>
        <div style="height:0.8rem">
          <h3 style="float:left">
            <ConferenceType v-model="conference.type" />
            <span>{{ conference.title }}</span>
          </h3>
          <span class="confer-date">
            <el-tooltip>
              <template #content>
                <div>创建时间:{{ parseTime(conference.create) }}</div>
                <div>召开时间:{{ parseTime(conference.startTime) }}</div>
              </template>
              <span>{{ formatTime(conference.startTime) }}</span>
            </el-tooltip>
            <el-button type="text" class="confer-edit" @click="showEditConference = true">编辑</el-button>
            <el-button type="text" class="confer-edit" @click="$refs.editor.requireDelete()">删除</el-button>
            <el-button
              type="text"
              icon="el-icon-refresh"
              class="confer-edit"
              @click="requireRefresh"
            />
          </span>
        </div>
      </template>
      <div v-waves class="confer-summary">
        <p
          v-for="(p,index) in conference.content.split('\n')"
          :key="index"
          class="summary-content"
        >{{ p||' ' }}</p>
      </div>
      <el-row class="conference-detail">
        <el-col :lg="16" :md="24">
          <el-form label-width="5rem">
            <el-form-item label="地点">
              <div>{{ conference.place||'未填写' }}</div>
            </el-form-item>
            <el-form-item label="单位">
              <Company v-model="conference.createByCode" />
            </el-form-item>
            <el-form-item label="党组织">
              <PartyGroup :id="conference.createByGroup" />
            </el-form-item>
            <el-form-item label="会议时间">
              <span>{{ conferTime }}</span>
              <el-progress
                text-inside
                :stroke-width="24"
                show-text
                :percentage="percent<=0?50:percent"
                :format="formatPercent"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :md="24" :lg="8">
          <div class="summary-host">
            <div class="summary-host-content">
              <span class="host-title">会议主持</span>
              <UserItem v-if="conference.host" class="host-user" :userid="conference.host.userId" />
              <el-tag v-else type="info">无主持</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <Editor
      ref="editor"
      :show.sync="showEditConference"
      :data="conference"
      @requireRefresh="requireRefresh"
    />
  </div>
</template>

<script>
import logic from './logic'
export default logic
</script>
<style lang="scss" scoped>
@import './style';
</style>
<style lang="scss">
.confer-card {
  .el-card__body {
    padding: 0.5rem 1rem 0.5rem 1rem !important;
  }
  :hover {
    .confer-edit {
      width: 3rem;
    }
  }
}
</style>
