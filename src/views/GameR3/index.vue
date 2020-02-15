<template>
  <div>
    <el-card>
      <slot name="header">忍者必须死3 礼品码领取工具</slot>
      <el-form label-width="80px">
        <el-collapse v-model="colMainSelect" style="padding:10px">
          <el-collapse-item name="profile">
            <template slot="title">
              <el-tag :type="userinfo.enable?'success':'info'">{{ userinfo.nickName }}</el-tag>个人信息
            </template>
            <el-form-item label="忍忍id">
              <el-input v-model="userinfo.gameid" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="userinfo.nickName" disabled />
            </el-form-item>
            <el-form-item label="头衔">
              <el-input v-model="userinfo.level" disabled />
            </el-form-item>
            <el-form-item label="上次领取">
              <el-tag>{{ toDate(userinfo.lastHandleStamp) }}</el-tag>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item name="share">
            <template slot="title">
              <el-button
                v-show="!contains(colMainSelect,'share')"
                style="width:100%"
                type="success"
              >分享</el-button>
            </template>
            <el-form-item label="礼品码">
              <el-input v-model="giftcode.userinput" />
            </el-form-item>
            <el-button :disabled="!giftcode.userinput" style="width:100%" type="success">分享礼品码</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>

    <el-card>
      <slot name="header">
        <el-badge
          :hidden="validGiftcodeCount==0"
          :value="validGiftcodeCount"
          type="primary"
          style="width:100%"
        >
          <el-button style="width:100%">忍忍们上传的礼品码</el-button>
        </el-badge>
      </slot>
      <el-collapse>
        <el-collapse-item v-for="item in giftcode.list" :key="item.code">
          <template slot="title">
            <el-tag :type="item.gainDate==''?(item.valid?'success':'danger'):'info'">{{ item.code }}</el-tag>
          </template>
          <GiftCode
            :code="item.code"
            :from="item.from"
            :share-time="item.time"
            :valid="item.valid"
            :invalid-des="item.invalidDes"
            :gain-date="item.gainDate"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { userinfo, gitftcodes, sharecode, handlecode } from '@/api/game'
import GiftCode from './GiftCode'
export default {
  name: 'GameR3',
  components: {
    GiftCode
  },
  data() {
    return {
      colMainSelect: 1,
      userinfo: {
        gameid: '',
        nickName: '',
        level: '',
        enable: true,
        lastHandleStamp: 0
      },
      giftcode: {
        userinput: '',
        gainSuccessTime: 2,
        list: [
          {
            from: '洛天嘤',
            code: '田园小狗狗礼品码',
            time: '2020-2-14 14:58',
            valid: true,
            invalidDes: '',
            gainDate: '1231'
          },
          {
            from: '洛天嘤',
            code: '田园小狗狗礼品码2333',
            time: '2020-2-14 14:58',
            valid: false,
            invalidDes: '过期了',
            gainDate: ''
          }
        ]
      },
      userinfoLoading: false
    }
  },
  computed: {
    validGiftcodeCount() {
      return this.giftcode.list.filter(f => f.valid && f.gainDate === '').length
    }
  },
  watch: {
    'userinfo.gameid'() {
      this.updateGameR3User()
    }
  },
  mounted() {
    this.userinfo.gameid = localStorage.getItem('lastUser')
    this.updateGameR3User()
  },
  methods: {
    contains(arr, val) {
      for (var i in arr) {
        if (arr[i] === val) return true
      }
      return false
    },
    updateGameR3User() {
      if (this.userinfoLoading) return

      localStorage.setItem('lastUser', this.userinfo.gameid)
      if (this.userinfo.gameid.length === 9) {
        this.userinfoLoading = true
        userinfo(this.userinfo.gameid).then(data => {
          var d = data.user
          this.userinfo.nickName = d.nickName
          this.userinfo.level = d.level
          this.userinfo.lastHandleStamp = d.user.lastHandleStamp
          this.userinfo.enable = d.user.enable
          this.userinfoLoading = false
        })
      }
    },
    toDate(val) {
      if (val === 0) return '未领取过'
      return new Date(val)
    }
  }
}
</script>
