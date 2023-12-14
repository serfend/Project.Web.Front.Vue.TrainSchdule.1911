<template>
  <el-row>
    <el-card v-infinite-scroll="onScrollToBottom" style="position: relative;">
      <el-button icon="el-icon-download" type="text" @click="downloadUserApplies">导出登记卡</el-button>
      <el-row v-if="!hideAddBtn">
        <div class="card-title" style="color:#333;font-size:1.5rem">新增</div>
        <div class="card-description to-add" @click="user_add_new_item">
          <div style="background:#ccc;width:4rem;text-align:center">
            <SvgIcon icon-class="add" style="padding:0.5rem;font-size:4rem;color:#fff" />
          </div>
        </div>
      </el-row>
      <div v-if="!errorMsg">
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
                <div class="header" @click="i.show = !i.show">
                  <div class="card-title">
                    <div style="color:#333;font-size:1rem">{{ i.tag.title }}</div>
                    <div style="color:#333;font-size:2.2rem">{{ i.tag.desc }}</div>
                  </div>
                  <ActionExamine
                    :row="i"
                    :entity-type="entityType"
                    class="card-status"
                    @updated="applyUpdate(index,i.id)"
                  />
                  <div class="card-description">
                    <span>{{ format(i.create) }}</span>
                    <AuditStatusTag v-model="i.status" type="mini" />
                    <div
                      v-for="(desc,desc_index) in get_item_summary(i,entityType).split('\n')"
                      :key="desc_index"
                      class="card-summary-description"
                      :style="{display:desc_index===0?'inline-block':''}"
                    >{{ desc }}</div>
                  </div>
                </div>
                <component
                  :is="`${entityType}ApplyCard`"
                  v-if="i.create"
                  :data="i"
                  :show="i.show"
                  style="width:100%"
                  @updated="applyUpdate(index,i.id)"
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
      </div>
      <div v-else style="text-align:center">
        <LottieIcon
          path="/assets/lottie/lottie.submit.fail.json"
          :animate-speed="0.5"
          style="width:15rem;margin: auto;"
        />
        <span>加载失败:{{ errorMsg }}</span>
      </div>
    </el-card>
  </el-row>
</template>

<script>
import { formatTime, datedifference } from '@/utils'
import { querySelf, detail } from '@/api/apply/query'
import { get_item_summary } from '@/utils/vacation'
import { tag_all_item } from '@/utils/timeline-handler'
import { getUserAllInfo } from '@/api/user/usercompany'
import { indayApplyExecuteStatusDesc } from '@/utils/vacation'
export default {
  name: 'AppliesList',
  components: {
    LottieIcon: () => import('@/components/LottieIcon'),
    Sticky: () => import('@/components/Sticky'),
    SvgIcon: () => import('@/components/SvgIcon'),
    indayApplyCard: () => import('./ApplyCard/IndayApplyCard'),
    vacationApplyCard: () => import('./ApplyCard/VacationApplyCard'),
    ActionExamine: () => import('@/views/Apply/QueryAndAuditApplies/ActionExamine'),
    AuditStatusTag: () => import('@/views/Apply/ApplyDetail/components/AuditStatusTag')
  },
  props: {
    id: { type: String, default: null },
    autoExpand: { type: Boolean, default: true },
    vacaStart: {
      type: String,
      default: '2000-01-01' // `${new Date().getFullYear() - 1}-01-01`,
    },
    vacaEnd: { type: String, default: `${new Date().getFullYear() + 1}-12-31` },
    list: { type: Array, default: () => [] },
    showApplyNew: { type: Boolean, default: false },
    entityType: { type: String, required: true },
    hideAddBtn: { type: Boolean, default: false }
  },
  data: () => ({
    inner_id: '',
    loading: false,
    now_active_year: [],
    lastPage: 0,
    haveNext: true,
    innerList: [],
    errorMsg: null
  }),
  computed: {
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
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    iList: {
      set(val) {
        this.innerList = val
        this.$emit('update:list', this.innerList)
      },
      get() {
        return this.innerList
      }
    }
  },
  watch: {
    id: {
      handler(val) {
        this.iId = val
      },
      immediate: true
    },
    inner_id: {
      handler(val) {
        this.reload()
      }
    },
    list: {
      handler(val) {
        this.innerList = val
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.reload()
    }, 5e2) // 若未实施则尝试加载
  },
  methods: {
    get_item_summary,
    downloadUserApplies() {
      const his = this.iList
      if (!his || his.length === 0) {
        return this.$message.warning('当前无申请可导出')
      }
      this.$message.info('开始导出')
      const user_id = his[0].base.userId
      getUserAllInfo(user_id).then((user) => {
        const data = {
          user,
          list: his.map(x => {
            const r = x.request
            if (r) {
              r.totalLength = datedifference(r.stampReturn, r.stampLeave) + 1
              r.totalLengthHour = datedifference(r.stampReturn, r.stampLeave, 'hour') + 1
            }

            x.executeStatusDesc = indayApplyExecuteStatusDesc(x.executeStatus)
            return x
          })
        }
        const filename = {
          vacation: '休假登记卡',
          inday: '请假登记卡',
        }[this.entityType] || '休假登记卡'
        this.$store
          .dispatch('template/download_xlsx', {
            templateName: `${filename}模板.xlsx`, data: { data },
            filename: `${user.base.base.realName}_${filename}(${his.length}条).xlsx`
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    format(val) {
      return formatTime(val)
    },
    reload() {
      if (this.loading) return
      this.clear_data()
      this.$nextTick(() => {
        this.load()
      })
    },
    clear_data() {
      this.innerList = []
      this.lastPage = 0
      this.haveNext = true
    },
    applyUpdate(index, id) {
      detail({ id, ignoreError: true, entityType: this.entityType })
        .then(data => {
          if (!data) return
          data.show = false
          this.innerList[index] = Object.assign(
            this.innerList[index],
            data
          )
          setTimeout(() => {
            this.innerList[index].show = true
          }, 1000)
        })
        .catch(e => {
          this.innerList.splice(index, 1)
          return
        })
    },
    load(cb, pages) {
      if (this.loading || this.errorMsg) return
      pages = pages || { pageIndex: this.lastPage, pageSize: 10 }
      if (!cb) {
        cb = data => {
          this.lastPage++
          const newList = data.list.map((v, i) => {
            v.itemIndex = i + pages.pageIndex * pages.pageSize
            v.show = false
            return v
          })
          tag_all_item(newList)
          this.iList = this.iList.concat(newList)
          if (data.list.length < pages.pageSize) {
            this.haveNext = false
          }
          if (pages.pageIndex === 0 && this.autoExpand) {
            setTimeout(() => {
              if (this.iList[0]) this.iList[0].show = true
            }, 1000)
          }
        }
      }
      if (!this.haveNext) return
      this.loading = true
      querySelf({
        pages,
        id: this.inner_id,
        start: this.vacaStart,
        end: this.vacaEnd,
        entityType: this.entityType
      })
        .then(cb)
        .catch(e => {
          this.errorMsg = e.message
        })
        .finally(() => {
          // avoid load next page trice
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
    },
    user_add_new_item() {
      this.$emit('update:showApplyNew', true)
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
    }
  }
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
.card-status{
	padding:0 1rem;
	width:6rem;
}
.card-description {
  display: inline-block;
  .card-summary-description {
    margin-bottom: 0.3rem;
    color: #333;
  }
}
.single-item {
  max-width: 100%;
  .header {
		cursor:pointer;
		display: flex;
    padding-top: 0.5rem;
    transition: all 0.3s ease;
    border-left: 0rem solid rgb(15, 167, 255);
    &:hover {
      box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.5);
      border-left: 1rem solid rgb(15, 167, 255);
    }
  }
}
</style>
