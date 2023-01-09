<template>
  <div>
    <h3>目标{{ id }}详细记录</h3>
    <el-table :data="innerList">
      <el-table-column label="目标">
        <template slot-scope="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column label="驾驶员">
        <template slot-scope="{ row }">{{ row.driver }}</template>
      </el-table-column>
      <el-table-column label="车辆">
        <template slot-scope="{ row }">{{ row.vehicle }}</template>
      </el-table-column>
      <el-table-column label="出车时间">
        <template slot-scope="{ row }">
          <el-tool-tip :content="formatTime(row.timeStart)">{{ parseTime(row.timeStart) }}</el-tool-tip>
          <span>-</span>
          <el-tool-tip :content="formatTime(row.timeEnd)">{{ parseTime(row.timeEnd) }}</el-tool-tip>
        </template>
      </el-table-column>
      <el-table-column label="乘车人数">
        <template slot-scope="{ row }">{{ row.passengerCount }}</template>
      </el-table-column>
      <el-table-column label="距离">
        <template slot-scope="{ row }">{{ row.distance }}km</template>
      </el-table-column>
      <el-table-column label="路径">
        <template slot-scope="{ row }">
          <div v-if="row.wayPathObj">
            <el-popover v-if="row.wayPathObj.length>2">
              <el-steps :active="0" align-center>
                <el-step v-for="i,index in row.wayPathObj" :key="index" :title="i.alias" description="" />
              </el-steps>
              <el-button slot="reference" type="text">共{{ row.wayPathObj.length }}个地点</el-button>
            </el-popover>
            <div v-else>{{ row.wayPathObj.map(i=>i.alias).join('-') }}</div>
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
import { parseTime, formatTime } from '@/utils'
import { locations as getLocations } from '@/api/common/static'
export default {
  name: 'TravelList',
  components: {
    Pagination: () => import('@/components/Pagination')
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
    parseTime, formatTime,
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
