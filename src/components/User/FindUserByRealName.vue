<template>
  <div>
    <el-input
      v-model="nowSelectRealName"
      style="width: 100%"
      placeholder="按姓名查找"
      @input="handleUserSelectByRealnameChange"
    />
    <div v-loading="loading">
      <el-collapse v-model="nowCollapseSelectUserId" accordion @change="selectUserChange">
        <el-collapse-item v-for="(u,index) in usersByRealName" :key="u.id" :name="u.id">
          <template slot="title">
            <el-tag>{{ u.dutiesName }}</el-tag>
            {{ u.companyName }} {{ u.realName }}
          </template>
          <User
            :data="u"
            :can-load-avatar="u.canLoadAvatar"
            :avatar.sync="usersByRealName[index].avatar"
            @avatar-load="avatarLoad(index)"
          />
        </el-collapse-item>
      </el-collapse>
      <el-button v-show="hasNextPage" style="width:100%" @click="onNextPage">加载更多...</el-button>
    </div>
  </div>
</template>

<script>
import User from '@/components/User'
import { getUserIdByRealName } from '@/api/user/userinfo'
import { debounce } from '@/utils'
export default {
  name: 'FindUserByRealName',
  components: { User },
  model: {
    prop: 'code',
    event: 'change'
  }, // TODO support auto load user from father-component
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    nowSelectRealName: '',
    nowIndex: 0,
    usersByRealName: [],
    userDict: {},
    nowCollapseSelectUserId: '',
    hasNextPage: false
  }),
  computed: {
    onNextPage() {
      return debounce(() => {
        this.loadNextPage()
      }, 500)
    }
  },
  watch: {
    usersByRealName: {
      handler(val) {
        if (val) {
          this.userDict = {}
          const vLen = val.length
          for (let i = 0; i < vLen; i++) {
            this.userDict[val[i].id] = val[i]
          }
        }
      }
    }
  },
  methods: {
    avatarLoad(index) {
      this.$nextTick(() => {
        this.$emit('update:avatar', this.usersByRealName[index].avatar)
      })
    },
    selectUserChange(id) {
      if (id) {
        this.loadCollapseUserAvatarRealName(id)
      }
    },
    loadCollapseUserAvatarRealName(id) {
      var u = this.userDict[id]
      this.$emit('change', u)
      if (u.avatar) this.$emit('update:avatar', u.avatar)
      else u.canLoadAvatar = true
      this.$message.success(`已选择:${u.realName}(${u.id})`)
    },
    handleUserSelectByRealnameChange() {
      this.usersByRealName = []
      if (!this.nowSelectRealName) return
      this.nowIndex = 0
      this.onNextPage()
    },
    loadNextPage() {
      this.loading = true
      getUserIdByRealName(this.nowSelectRealName, this.nowIndex++, 10)
        .then(data => {
          this.usersByRealName = this.usersByRealName.concat(
            data.list.map(li => {
              li.canLoadAvatar = false
              li.avatar = null
              return li
            })
          )
          this.hasNextPage = data.totalCount > this.usersByRealName.length
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
