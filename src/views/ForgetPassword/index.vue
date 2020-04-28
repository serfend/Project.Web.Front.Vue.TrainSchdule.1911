<template>
  <div>
    <el-card header="找回账号">
      <div class="page-container">
        <div class="warning">
          <p>此页面用于找回用户名或密码</p>
          <p>
            <code>密码</code>丢失可以通过本人或上级的授权码找回
          </p>
          <p>遗忘了用户名可以通过两种方式找回:1.依据姓名找回 2.依据单位找回</p>
        </div>
        <el-col :lg="8" :md="12" :sm="24">
          <el-card header="找回密码">
            <ResetPassword :old-psw-input="false" />
          </el-card>
        </el-col>
        <el-col :lg="8" :md="12" :sm="24">
          <el-card header="找回账号 - 通过姓名">
            <el-input
              v-model="nowSelectRealName"
              style="width: 100%"
              placeholder="输入姓名查找"
              @input="loadCollapseUserAvatarBoth"
            />
            <el-collapse
              v-model="nowCollapseSelectUserId"
              accordion
              @change="loadCollapseUserAvatarBoth"
            >
              <el-collapse-item v-for="u in usersByRealName" :key="u.id" :name="u.id">
                <template slot="title">
                  <el-tag>{{ u.dutiesName }}</el-tag>
                  {{ u.companyName }} {{ u.realName }}
                </template>
                <User :data="u" :can-load-avatar="u.canLoadAvatar" />
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
        <el-col :lg="8" :md="12" :sm="24">
          <el-card header="找回账号 - 通过单位">
            <cascader-selector
              :code.sync="nowSelectCompanyCode"
              placeholder="选择需要检查的单位"
              :child-getter-method="companyChild"
            />
            <el-collapse
              v-model="nowCollapseSelectUserId"
              accordion
              @change="loadCollapseUserAvatarCompany"
            >
              <el-collapse-item v-for="u in usersByCompany" :key="u.id" :name="u.id">
                <template slot="title">
                  <el-tag>{{ u.dutiesName }}</el-tag>
                  {{ u.companyName }} {{ u.realName }}
                </template>
                <User :data="u" :can-load-avatar="u.canLoadAvatar" />
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
import ResetPassword from '@/components/ResetPassword'
import CascaderSelector from '@/components/CascaderSelector'
import User from '@/components/User'
import { getMembers, companyChild } from '@/api/company'
import { getUserIdByRealName } from '@/api/userinfo'
export default {
  name: 'ForgetPassword',
  components: { ResetPassword, CascaderSelector, User },
  data() {
    return {
      nowSelectCompanyCode: '',
      usersByCompany: [],
      nowCollapseSelectUserId: '',

      nowSelectRealName: '',
      usersByRealName: []
    }
  },
  watch: {
    nowSelectCompanyCode: {
      handler(val) {
        if (val) {
          getMembers({ code: val, page: 0, pageSize: 999 }).then(data => {
            this.usersByCompany = data.list.map(li => {
              li.canLoadAvatar = false
              return li
            })
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    companyChild,
    mapUser(li) {
      return {
        description: li.companyName + li.dutiesName,
        id: li.id,
        value: li.id,
        realName: li.realName,
        avatar: li.avatar
      }
    },
    loadCollapseUserAvatarBoth(id) {
      return (
        this.loadCollapseUserAvatarCompany(id) +
        this.loadCollapseUserAvatarRealName(id)
      )
    },
    loadCollapseUserAvatarCompany(id) {
      return this.loadCollapseUserAvatar(this.usersByCompany, id)
    },
    loadCollapseUserAvatarRealName(id) {
      return this.loadCollapseUserAvatar(this.usersByRealName, id)
    },
    loadCollapseUserAvatar(users, id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          users[i].canLoadAvatar = true
          break
        }
      }
    },
    handleUserSByCompanyelectChange(val) {
      if (!val) return (this.usersByRealName = [])
      getUserIdByRealName(val).then(data => {
        this.usersByRealName = data.list.map(li => {
          li.canLoadAvatar = false
          return li
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container,
.page-container {
  padding: 0;
}

.page-container h2 {
  font-size: 28px;
  color: #1f2d3d;
  margin: 0;
}

.page-container h3 {
  font-size: 22px;
}

.page-container h2,
.page-container h3,
.page-container h4,
.page-container h5 {
  font-weight: 400;
  color: #1f2f3d;
}

.page-container h2:hover a,
.page-container h3:hover a,
.page-container h4:hover a,
.page-container h5:hover a {
  opacity: 0.4;
}

.page-container h2 a,
.page-container h3 a,
.page-container h4 a,
.page-container h5 a {
  float: left;
  margin-left: -20px;
  opacity: 0;
  cursor: pointer;
}

.page-container h2 a:hover,
.page-container h3 a:hover,
.page-container h4 a:hover,
.page-container h5 a:hover {
  opacity: 0.4;
}

.page-container p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}

.page-container .tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}

.page-container .tip code {
  background-color: hsla(0, 0%, 100%, 0.7);
  color: #445368;
}

.page-container .warning {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 20px 0;
}

.page-container .warning code {
  background-color: hsla(0, 0%, 100%, 0.7);
  color: #445368;
}
</style>
