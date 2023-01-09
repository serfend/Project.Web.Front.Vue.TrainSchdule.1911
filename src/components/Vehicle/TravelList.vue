<template>
  <div>
    <el-table :data="innerList">
      <el-table-column label="驾驶员">
        <template slot-scope="{ row }">
          <div v-if="row.driver">
            <UserFormItem :data="row.driver.user" />
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column label="驾龄" min-width="60">
        <template slot-scope="{ row }">
          <div v-if="row.driver">
            <div v-if="row.driver.timeDrive">
              <el-tooltip :content="`驾驶时间:${parseTime(row.driver.timeDrive)}`">
                <span>{{ formatTime(row.driver.timeDrive,'{y}-{m}-{d}') }}</span>
              </el-tooltip>
            </div>
            <div v-if="row.driver.timeWorkCurrentCompany">
              <el-tooltip :content="`本单位驾驶时间:${parseTime(row.driver.timeWorkCurrentCompany)}`">
                <span>{{ formatTime(row.driver.timeWorkCurrentCompany,'{y}-{m}-{d}') }}</span>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="出车车辆">
        <template slot-scope="{ row }">
          <VehicleFormItem :data="row.vehicle" />
        </template>
      </el-table-column>
      <el-table-column label="出车时间" min-width="120">
        <template slot-scope="{ row }">
          <el-tooltip :content="parseTime(row.timeStart)">
            <span>{{ formatTime(row.timeStart,'{y}-{m}-{d}') }}</span>
          </el-tooltip>
          <span>-</span>
          <el-tooltip :content="parseTime(row.timeEnd)">
            <span>{{ formatTime(row.timeEnd,'{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="人数">
        <template slot-scope="{ row }">{{ row.passengerCount }}</template>
      </el-table-column>
      <el-table-column label="距离">
        <template slot-scope="{ row }">{{ row.distance }}km</template>
      </el-table-column>
      <el-table-column label="路径">
        <template slot-scope="{ row }">
          <div v-if="row.wayPath">
            <el-popover v-if="row.wayPath.length>2">
              <el-steps :active="row.wayPath.length" align-center>
                <el-step v-for="i,index in row.wayPath" :key="index" :title="i.shortName" :description="i.name" />
              </el-steps>
              <el-button slot="reference" type="text">共{{ row.wayPath.length }}个地点</el-button>
            </el-popover>
            <el-tooltip v-else :content="row.wayPath.map(i=>i.name).join('-')">
              <span>{{ row.wayPath.map(i=>i.shortName).join('-') }}</span>
            </el-tooltip>
            <div />
          </div>

        </template>
      </el-table-column>
      <el-row style="text-align:center">
        <Pagination
          class="styled-primary-pagination"
          :pagesetting.sync="pages"
          :total-count="pageTotalCount"
          layout="total,prev,pager,next,jumper"
          small
          background
          hide-on-single-page
        />
      </el-row>
    </el-table>
  </div>
</template>

<script>
import { getTravelList } from '@/api/vehicle'
import { parseTime, formatTime, datedifference } from '@/utils'
import { locations as getLocations } from '@/api/common/static'
export default {
  name: 'TravelList',
  components: {
    Pagination: () => import('@/components/Pagination'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    VehicleFormItem: () => import('./VehicleFormItem'),
  },
  props: {
    id: { type: String, required: true }
  },
  data: () => ({
    loading: false,
    pages: { pageIndex: 0, pageSize: 10 },
    pageTotalCount: 0,
    innerList: []
  }),
  computed: {},
  watch: {
    id: {
      handler(v) {
        this.refresh()
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    parseTime, formatTime, datedifference,
    getSplitContent (r) {
      return r && r.split('##').filter(x => x)
    },
    refresh() {
      this.loading = true
      getTravelList({})
        .then(data => {
          this.innerList = data.list
          this.pageTotalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadWayPath () {
      const { innerList } = this
      getLocations(innerList.map(x => this.getSplitContent(x.wayPath))).then(data => {
        debugger
      })
    }
  }
}
</script>
