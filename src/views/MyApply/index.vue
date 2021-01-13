<template>
  <div>
    <div v-if="id||(currentUser&&currentUser.id)">
      <div v-if="!$slots.inner">
        <el-row class="row">
          <UserSelector :code.sync="iId" :default-info="'查询其他人休假情况'" style="display:inline" />
        </el-row>
        <el-row :gutter="20" class="row">
          <el-col>
            <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
              <UserFormItem
                :data="iId?null:currentUser"
                :userid="iId"
                :direct-show-card="true"
                :can-load-avatar="true"
              />
            </el-col>
            <el-col :xl="17" :lg="16" :md="15" :sm="14" :xs="24">
              <ApplyOverview :userid="iId||currentUser.id" />
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <ApplyOverview :userid="iId||currentUser.id" class="row" />
        <el-row class="row">
          <el-col>
            <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
              <UserFormItem
                :data="iId?null:currentUser"
                :userid="iId"
                :direct-show-card="true"
                :can-load-avatar="true"
              />
            </el-col>
            <slot name="inner" />
          </el-col>
        </el-row>
      </div>
      <el-row class="row">
        <el-card v-infinite-scroll="onScrollToBottom" style="position: relative;">
          <el-row class="card-row">
            <div class="card-title" style="color:#333;font-size:1.5rem">新增</div>
            <div class="card-description to-add" @click="user_add_new_item">
              <div style="background:#ccc;width:4rem;text-align:center">
                <SvgIcon icon-class="add" style="padding:0.5rem;font-size:4rem;color:#fff" />
              </div>
            </div>
          </el-row>
          <div v-for="(i,index) in iList" :key="i.id">
            <Sticky
              v-if="index===0||(index>0&&iList[index-1].tag.year!=i.tag.year)"
              :sticky-top="48"
              :class-name="'card-divider-year'"
              :style="{opacity:(now_active_year.length&&now_active_year[now_active_year.length-1]>index)?0:1,transition:'all ease 0.5s'}"
              @reset="year_banner_reset(index)"
              @sticky="year_banner_sticky(index)"
            >{{ i.tag.year }}年</Sticky>
            <div class="card-row">
              <el-tooltip
                :content="i.show?'点击隐藏详情':'点击查看详情'"
                :hide-after="5000"
                :open-delay="1000"
                placement="top-start"
                transition="el-zoom-in-center"
              >
                <div class="single-item">
                  <div class="header" style="cursor:pointer" @click="i.show = !i.show">
                    <div class="card-title">
                      <div style="color:#333;font-size:1rem">{{ i.tag.title }}</div>
                      <div style="color:#333;font-size:2.2rem">{{ i.tag.desc }}</div>
                    </div>
                    <div class="card-description">
                      <span>{{ format(i.create) }}</span>
                      <el-tag
                        v-if="statusDic[i.status]"
                        size="mini"
                        :color="statusDic[i.status].color"
                        class="white--text"
                      >{{ statusDic[i.status].desc }}</el-tag>
                      <div
                        v-for="(desc,desc_index) in get_item_summary(i).replace(' 00:00:00','').split('\n')"
                        :key="desc_index"
                        class="card-summary-description"
                        :style="{display:desc_index===0?'inline-block':''}"
                      >{{ desc }}</div>
                    </div>
                  </div>

                  <ApplyCard
                    v-if="i.create"
                    :data="i"
                    :show="i.show"
                    style="width:100%"
                    @updated="applyUpdate(i.itemIndex)"
                  />
                </div>
              </el-tooltip>
            </div>
          </div>
          <el-button
            v-if="haveNext"
            :loading="loading"
            type="text"
            style="width:100%"
            @click="load"
          >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
          <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
        </el-card>
      </el-row>
    </div>
    <Login v-else />
    <el-dialog :visible.sync="show_apply_new">
      <ApplyNew
        v-if="show_apply_new"
        :default-id="inner_id"
        :single-column="true"
        @userSubmit="reload"
      />
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import { get_item_summary, tag_single_item } from '@/utils/vacation'
import UserFormItem from '@/components/User/UserFormItem'
import UserSelector from '@/components/User/UserSelector'
import Sticky from '@/components/Sticky'
import ApplyNew from '@/views/NewApply'
import ApplyCard from './components/ApplyCard'
import ApplyOverview from './components/ApplyOverview'
import { querySelf } from '@/api/apply/query'
import Login from '@/views/login'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'MyApply',
  components: { Sticky, ApplyNew, UserFormItem, UserSelector, ApplyCard, ApplyOverview, Login, SvgIcon },
  props: {
    vacaStart: {
      type: String,
      default: '2000-01-01'// `${new Date().getFullYear() - 1}-01-01`,
    },
    vacaEnd: {
      type: String,
      default: `${new Date().getFullYear() + 1}-12-31`,
    },
    id: {
      type: String,
      default: null,
    },
    autoExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      innerList: [],
      inner_id: '',
      now_active_year: [],
      lastPage: 0,
      haveNext: true,
      loading: false,
      show_apply_new: null
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.data
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    iId: {
      set(val) {
        val = (val && val.id) || val
        this.inner_id = val
        this.$emit('update:id', this.inner_id)
      },
      get() {
        return this.inner_id
      }
    },
    iList: {
      set(val) {
        this.innerList = val
        this.$emit('update:list', this.innerList)
      },
      get() {
        return this.innerList
      },
    },
  },
  watch: {
    list: {
      handler(val) {
        this.innerList = val
      },
      deep: true,
    },
    id: {
      handler(val) {
        this.iId = val
      }, immediate: true
    },
    inner_id: {
      handler(val) {
        this.reload()
      }
    }
  },
  mounted() {
    this.load()
  },
  destroyed() { },
  methods: {
    get_item_summary,
    user_add_new_item() {
      this.show_apply_new = true
    },
    year_banner_sticky(index) {
      this.now_active_year.push(index)
      console.log(this.now_active_year)
    },
    year_banner_reset(index) {
      this.now_active_year.pop()
      console.log(this.now_active_year)
    },
    onScrollToBottom() {
      this.load()
    },
    reload() {
      this.clear_data()
      this.load()
    },
    clear_data() {
      this.innerList = []
      this.lastPage = 0
      this.haveNext = true
    },
    format(val) {
      return formatTime(val)
    },
    applyUpdate(index) {
      this.loading = true
      querySelf({ pageIndex: index, pageSize: 1 }, this.inner_id, this.vacaStart, this.vacaEnd).then((data) => {
        if (!data.list[0]) return this.$message.error('操作意外发生了异常')
        const list = this.iList
        list[index] = Object.assign(list[index], data.list[0])
        list[index].show = false
        setTimeout(() => {
          list[index].show = true
        }, 1000)
      }).finally(() => {
        this.loading = false
      })
    },
    load() {
      if (this.loading) return
      if (this.haveNext) {
        this.loading = true
        const pages = { pageIndex: this.lastPage, pageSize: 10 }
        querySelf(pages, this.inner_id, this.vacaStart, this.vacaEnd)
          .then((data) => {
            this.lastPage++
            const newList = data.list.map((v, i) => {
              v.itemIndex = i + pages.pageIndex * pages.pageSize
              v.show = false
              return v
            })
            newList.map((v, i) => tag_single_item(newList, i))
            this.iList = this.iList.concat(newList)
            if (data.list.length < pages.pageSize) {
              this.haveNext = false
            }
            if (pages.pageIndex === 0 && this.autoExpand) {
              setTimeout(() => {
                if (this.iList[0]) this.iList[0].show = true
              }, 1000)
            }
          })
          .finally(() => {
            // avoid load next page trice
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card-row {
  transition: all 0.3s ease;
  margin-bottom: 0.2rem;
  .to-add {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.card-title {
  vertical-align: top;
  width: 5rem;
  height: 100%;
  padding-right: 0.7rem;
  text-align: right;
  display: inline-block;
  font-weight: 600;
}
.card-description {
  display: inline-block;
  .card-summary-description {
    margin-bottom: 0.3rem;
    color: #aaa;
  }
}
.single-item {
  max-width: 45rem;
  .header {
    padding-top: 0.5rem;
    transition: all 0.3s ease;
    border-left: 0rem solid rgb(15, 167, 255);
    &:hover {
      box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.5);
      border-left: 1rem solid rgb(15, 167, 255);
    }
  }
}
.row {
  margin: 10px;
}
</style>
