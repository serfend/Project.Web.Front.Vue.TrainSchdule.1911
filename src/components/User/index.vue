<template>
  <div class="card-item" :style="{ width }">
    <div v-if="currentUser" class="shell" :style="{ width }">
      <div v-loading="loading" class="photo">
        <!-- 当在加载则说明需要更换头像 -->
        <el-image v-if="!loading" :src="avatar" :preview-src-list="[avatar]" />
      </div>
      <div class="content">
        <div class="text">
          <div class="header">{{ innerData.realName }}</div>
          <div class="subheader">
            {{ innerData.companyName }}{{ innerData.dutiesName }}
          </div>
          <div class="description">{{ innerData.about }}</div>
        </div>
        <div
          :class="['btn', isOpened ? 'active' : '']"
          @click="() => (isOpened = !isOpened)"
        >
          <span />
        </div>
      </div>
      <div class="footer">{{ currentUser }}</div>
      <div :class="['box', isOpened ? 'open' : '']">
        <el-tooltip
          v-for="x in btn_actions"
          :key="x[0]"
          :content="x[0]"
          :disabled="btn_disabled"
          placement="right"
        >
          <span><i :class="x[1]" @click="onHandleAction(x)" /></span>
        </el-tooltip>
      </div>
      <el-dialog
        v-loading="loading"
        :visible.sync="contactMeHasShow"
        append-to-body
      >
        <ContactMe
          v-if="contactMeHasShow"
          :content="contactUrl"
          :description="`微信或手机通讯录扫码，获取${realName}的联系方式`"
        />
      </el-dialog>
    </div>
    <el-collapse-transition>
      <div v-if="isHover" style="margin:0.5rem">
        <VacationDescriptionContent :userid="userid" />
        <div style="text-align:center">
          <el-button type="text" @click="switchExpand(false)">关闭</el-button>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { getUserAvatar, getUserSocial } from '@/api/user/userinfo'
export default {
  name: 'UserItem',
  components: {
    ContactMe: () => import('@/components/ContactMe'),
    VacationDescriptionContent: () =>
      import('@/components/Vacation/VacationDescriptionContent')
  },
  props: {
    data: { type: Object, default: () => ({}) },
    canLoadAvatar: { type: Boolean, default: false },
    direction: { type: String, default: 'top' },
    width: { type: String, default: '350px' },
    directExpandDescription: { type: Boolean, default: false } // 直接展开休假描述
  },
  data: () => ({
    loading: false,
    avatar: '',
    userid: '',
    phone: '',
    innerData: {},
    contactMeHasShow: false,
    isHover: false, // 是否悬浮展开了休假描述
    isOpened: false, // 是否展开了功能按钮
    btn_disabled: true, // 在展开前不显示tooltip
    actions: [
      ['与此人联系', 'el-icon-phone-outline', 'handleContact'],
      [
        '管理个人信息',
        'el-icon-setting',
        'handleMgrProfile',
        '/settings/application-manage/user-manager'
      ],
      [
        '历史休假记录',
        'el-icon-s-check',
        'handleHistoryVacation',
        '/apply/vacation/myApply'
      ],
      [
        '历史请假记录',
        'el-icon-coordinate',
        'handleHistoryInday',
        '/apply/inday/myApply'
      ],
      ['查看休假描述', 'el-icon-s-management', 'handleShowVacDesc']
    ]
  }),
  computed: {
    contactUrl() {
      const r = [
        `MECARD:TEL:${this.phone};N:${this.realName};EMAIL:${this.currentUser}`,
        `@xjxt.mtn;NOTE:${this.innerData.about};`
      ]
      return r.join()
    },
    realName() {
      const { innerData } = this
      return innerData && innerData.realName
    },
    currentUser() {
      const { innerData } = this
      return innerData && innerData.id
    },
    btn_actions() {
      const r = []
      const { actions } = this
      const { path, query } = this.$route
      const not_same_usr = query.userid !== this.currentUser
      if (!this.contactMeHasShow) r.push(actions[0])
      if (not_same_usr || path !== actions[1][3]) r.push(actions[1])
      if (not_same_usr || path !== actions[2][3]) r.push(actions[2])
      if (not_same_usr || path !== actions[3][3]) r.push(actions[3])
      if (!this.isHover) r.push(actions[4])
      return r
    }
  },
  watch: {
    canLoadAvatar: {
      handler(val) {
        if (val) this.refreshAvatar()
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.innerData = val
      },
      immediate: true
    },
    'data.id': {
      handler(val) {
        if (!val) return
        this.userid = val
        this.refreshAvatar()
      },
      immediate: true
    },
    isOpened: {
      handler(val) {
        this.btn_disabled = true
        if (!val) return
        // 动画完成后允许弹出tooltip
        setTimeout(() => {
          this.btn_disabled = false
        }, 5e2)
      }
    }
  },
  mounted() {
    this.refreshAvatar()
    if (this.directExpandDescription) {
      setTimeout(() => {
        this.switchExpand(true)
      }, 1e3)
    }
  },
  methods: {
    onHandleAction(action) {
      this.isOpened = false
      const { userid } = this
      const goto_url = url => {
        const target = `${url}?userid=${userid}`
        this.$router.push(target)
      }
      const short_action = {
        handleShowVacDesc: x => this.switchExpand(!this.isHover),
        handleContact: x => this.loadContactMe(),
        handleHistoryInday: x => goto_url(x[3]),
        handleHistoryVacation: x => goto_url(x[3]),
        handleMgrProfile: x => goto_url(x[3])
      }
      const f = short_action[action[2]]
      if (f) return f(action)
      return this.$message.error(`非法的动作:${action}`)
    },
    switchExpand(expand = true) {
      this.isHover = expand
      this.$emit('expandChange', expand)
    },
    loadContactMe() {
      if (this.contactMeHasShow) return
      this.contactMeHasShow = true
    },
    refreshAvatar() {
      if (!this.canLoadAvatar) return
      if (!this.userid) return
      this.loading = true

      const a1 = getUserAvatar(this.userid).then(data => {
        this.avatar = data.url
        this.$emit('update:avatar', this.avatar)
        this.$nextTick(() => {
          this.$emit('avatar-load')
        })
      })
      const a2 = getUserSocial(this.userid).then(data => {
        this.phone = data.phone
      })
      Promise.all([a1, a2]).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-item {
  margin-left: 3rem;
  transition: all ease 0.5s;
  position: relative; // 独立布局本组件
}
</style>
<style scoped lang="scss">
@mixin common-shadow {
  box-shadow: 2px 0px 5px rgba(180, 177, 184, 0.5);
}
.shell {
  border-radius: 5px;
  box-shadow: 0 0 0.5rem #babbbc;
  animation: show-shell 0.5s forwards ease-out;
}
@keyframes show-shell {
  0% {
    width: 0;
  }
}
.photo,
.content {
  box-sizing: border-box;
}

.photo {
  z-index: 1;
  position: absolute;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #fafafa;
  background-color: #fafafa;
  margin-left: -2.5rem;
  top: 1rem;
  box-shadow: 0 0 0.5rem #babbbc;
  animation: rotate-photo 0.5s forwards ease-in-out;
}

@keyframes rotate-photo {
  100% {
    transform: rotate(-360deg);
  }
}

.photo img {
  width: 100%;
}

.content {
  padding: 0.2rem;
  overflow: hidden;

  width: 100%;
  height: 7.5rem;
  top: 0;
  left: 0;
}

.content::after {
  content: "";
  display: block;
  width: 17rem;
  height: 11rem;
  z-index: -1;
  transform: translate(-1rem, -2rem) rotate(-8deg);
  background-image: linear-gradient(to top, #38a9ff 0%, #ffb0f6 100%);
  @include common-shadow;
}
@mixin text-decorate {
  font-weight: normal;
  margin-left: 3rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
  line-height: 1rem;
}
.content .text {
  width: 15rem;
  overflow: hidden;
  z-index: 2;
  position: absolute;
  margin-top: 0.5rem;
  .header {
    @include text-decorate;
    line-height: 1.8rem;
    font-size: 1.8rem;
    color: #ffffff;
  }
  .subheader {
    font-weight: 600;
    color: #ffcda3;
    @include text-decorate;
  }
  .description {
    @include text-decorate;
    white-space: inactive; // 允许换行
    height: 3rem; // 最多3行
    color: #e7eaef;
  }
}
.footer {
  @include text-decorate;
  margin-left: 0.5rem;
  position: absolute;
  transform: translateY(-1.2rem);
  font-size: 0.8rem;
  color: #a3a3a3;
}
.content .btn {
  background-color: rgb(106, 106, 245);
  width: 3rem;
  height: 3rem;
  position: absolute;
  right: 1.1rem;
  top: 2.1rem;
  border-radius: 50%;
  z-index: 3;
  cursor: pointer;
  transition-duration: 0.3s;
  animation: pop-btn 0.3s both ease-in-out 0.5s;
}

@keyframes pop-btn {
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.content .btn:hover {
  @include common-shadow;
}

.content .btn span {
  width: 60%;
  height: 2px;
  position: absolute;
  background-color: white;
  top: 50%;
  left: 20%;
  animation: to-hamburger 0.3s forwards ease-in-out;
}

.content .btn span::before,
.content .btn span::after {
  content: "";
  width: 100%;
  height: 2px;
  position: absolute;
  background-color: white;
  transition-duration: 0.3s;
  transform: rotate(0deg);
  right: 0;
}

.content .btn span::before {
  margin-top: -7px;
}

.content .btn span::after {
  margin-top: 7px;
}

.content .btn.active span {
  animation: to-arrow 0.3s forwards ease-in-out;
}

.content .btn.active span::before,
.content .btn.active span::after {
  width: 60%;
  right: -1px;
}

.content .btn.active span::before {
  transform: rotate(45deg);
}

.content .btn.active span::after {
  transform: rotate(-45deg);
}

@keyframes to-hamburger {
  from {
    transform: translateY(-50%) rotate(-180deg);
  }
}

@keyframes to-arrow {
  from {
    transform: translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateY(-50%) rotate(180deg);
  }
}
.box {
  opacity: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1; // 需要在btn下面
  height: 0;
  position: absolute;
  width: 0;
  top: 0;
  transform: translate(18.15rem, 2rem);
  transition-duration: 0.3s;
  box-shadow: 0 0 10px #fff;
  border: 5px #fff solid;
  transition-duration: 0.3s;
}

.box::after {
  content: "";
  display: block;
  width: 120px;
  height: 120px;
  background-size: cover;
  opacity: 0.7;
  border-radius: 50%;
}
.box span {
  z-index: 1;
  left: 0; // 回到原点
  top: 0;
  opacity: 1;
  position: absolute;
  display: flex;
  transition-duration: 0.3s;
}
.box i {
  border-radius: 50%;
  background-color: #ececec;
  font-size: 2rem;
  text-align: center;

  @include common-shadow;
  color: rgb(106, 106, 245);
  background-color: #fff;
  transition-duration: 0.3s;
}

.box i:hover {
  transition-delay: initial !important;
  @include common-shadow;
  background-color: rgb(106, 106, 245);
  color: #fff;
  cursor: pointer;
}

.box.open {
  opacity: 1;
}

.box.open i {
  opacity: 1;
}
@mixin delay-trans($rotate, $delay) {
  transform: rotate($rotate) translateX(5rem);
  transition: transform 0.3s ease-out $delay;
  i {
    transform: rotate(-$rotate);
  }
}
.box.open span {
  position: absolute;
  &:nth-of-type(1) {
    @include delay-trans(-90deg, 0.01s);
  }
  &:nth-of-type(2) {
    @include delay-trans(-45deg, 0.1s);
  }
  &:nth-of-type(3) {
    @include delay-trans(0deg, 0.2s);
  }
  &:nth-of-type(4) {
    @include delay-trans(45deg, 0.3s);
  }
  &:nth-of-type(5) {
    @include delay-trans(90deg, 0.4s);
  }
}
</style>
