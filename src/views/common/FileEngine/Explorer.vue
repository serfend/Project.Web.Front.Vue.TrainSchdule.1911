<template>
  <div v-loading="loading">
    <div v-for="folder in folders.array" :key="folder">
      <SvgIcon icon-class="file" />
      <span style="cursor:pointer" @click="enterPath(folder)">{{ folder }}</span>
    </div>
    <div>
      <el-row v-for="file in folderFiles.array" :key="file.id" class="e-file-container">
        <el-col :span="1">
          <SvgIcon icon-class="doc" />
        </el-col>
        <el-col :span="9">
          <el-tooltip :content="file.path">
            <span>{{ file.name }}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-tooltip>
            <template slot="content">
              <div>创建时间:{{ file.create }}</div>
              <div>最后修改:{{ file.lastModify }}</div>
            </template>
            <span>{{ new Date(file.lastModify)|formatTime }}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="2">
          <span>{{ `${numberFormatter(file.length)}B` }}</span>
        </el-col>
        <el-col :span="4">
          <span>{{ file.fromClient }}</span>
        </el-col>
        <el-col :span="2">
          <el-link @click="$emit('select',file.name)">详情</el-link>
        </el-col>
      </el-row>
    </div>
    <el-button v-if="foldersHasNextPage||filesHasNextPage" @click="loadNextPage">加载更多</el-button>
    <span v-else>没有更多了</span>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import { numberFormatter } from '@/filters'
import SvgIcon from '@/components/SvgIcon'
import { folderFiles, requestFolder } from '@/api/common/file'
export default {
  name: 'Explorer',
  components: { SvgIcon },
  props: {
    path: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    folders: {
      array: [],
      pages: {
        pageIndex: -1,
        pageSize: 20,
        totalCount: 0
      }
    },
    folderFiles: {
      array: [],
      pages: {
        pageIndex: -1,
        pageSize: 20,
        totalCount: 0
      }
    },
    nowPath: null,
    lastUpdate: new Date()
  }),
  computed: {
    foldersHasNextPage() {
      var pages = this.folders.pages
      return pages.totalCount >= (pages.pageIndex + 1) * pages.pageSize
    },
    filesHasNextPage() {
      var pages = this.folderFiles.pages
      return pages.totalCount >= (pages.pageIndex + 1) * pages.pageSize
    }
  },
  watch: {
    path: {
      handler(val) {
        if (!val) {
          val = ''
        }
        this.nowPath = val
        this.refresh()
      },
      immediate: true
    }
  },
  mounted() {
    this.enterPath('')
  },
  methods: {
    formatTime,
    numberFormatter,
    refresh() {
      var lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        this.folders.array = []
        this.folders.pages.pageIndex = -1
        this.folderFiles.array = []
        this.folderFiles.pages.pageIndex = -1
        this.loadNextPage()
      }, 500)
    },
    enterPath(path) {
      this.nowPath = `${this.nowPath ? `${this.nowPath}/` : ''}${path}`
      this.$emit('update:path', this.nowPath)
      this.refresh()
    },
    loadNextPage() {
      this.loading = true
      var pages = {}
      if (this.foldersHasNextPage) {
        pages = this.folders.pages
        pages.pageIndex++
        requestFolder(this.nowPath, pages)
          .then(data => {
            this.folders.array = this.folders.array.concat(data.folders)
            pages.totalCount = data.totalCount
            if (!this.foldersHasNextPage) this.loadNextPage()
          })
          .finally(() => {
            this.loading = false
          })
      } else if (this.filesHasNextPage) {
        pages = this.folderFiles.pages
        pages.pageIndex++
        folderFiles(this.nowPath, pages)
          .then(data => {
            this.folderFiles.array = this.folderFiles.array.concat(data.files)
            pages.totalCount = data.totalCount
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$message.error('无更多的项目')
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.e-file-container {
  cursor: pointer;
  span {
    display: flex;
  }
  &:nth-child(2n + 1) {
    background-color: #0000ff10;
    :hover {
      transition: all 0.5s;
      background-color: #0000ff47;
    }
  }
  &:nth-child(2n) {
    background-color: #0000ff07;
    :hover {
      transition: all 0.5s;
      background-color: #0000ff37;
    }
  }
}
</style>
