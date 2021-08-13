<template>
  <el-row v-loading="loading">
    <el-card v-infinite-scroll="loadNextPage">
      <div v-for="(folder,index) in folders.array" :key="index">
        <SvgIcon icon-class="file" />
        <span style="cursor:pointer" @click="enterPath(folder)">{{ folder }}</span>
      </div>
      <el-row v-for="file in folderFiles.array" :key="file.id" class="e-file-container">
        <el-col :span="1">
          <SvgIcon icon-class="doc" />
        </el-col>
        <el-col :span="9">
          <el-tooltip :content="file.name">
            <span
              style="overflow:hidden;white-space:nowrap"
              @click="$emit('select',file.name)"
            >{{ file.name }}</span>
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
      </el-row>
      <el-button
        v-if="foldersHasNextPage||filesHasNextPage"
        :loading="loading"
        style="width:100%"
        type="text"
        @click="loadNextPage"
      >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
      <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
    </el-card>
  </el-row>
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
    path: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    newFolder: null,
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
    nowPath: null
  }),
  computed: {
    foldersHasNextPage() {
      const pages = this.folders.pages
      return pages.totalCount >= (pages.pageIndex + 1) * pages.pageSize
    },
    filesHasNextPage() {
      const pages = this.folderFiles.pages
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
  methods: {
    formatTime,
    numberFormatter,
    refresh() {
      console.log('refresh')
      this.folders.array = []
      this.folders.pages.pageIndex = -1
      this.folderFiles.array = []
      this.folderFiles.pages.pageIndex = -1
      this.loadNextPage()
    },
    enterPath(path) {
      this.nowPath = `${this.nowPath ? `${this.nowPath}/` : ''}${path}`
      this.$emit('update:path', this.nowPath)
      this.refresh()
    },
    loadNextPage() {
      if (this.loading) return
      this.loading = true
      var pages = {}
      if (this.foldersHasNextPage) {
        pages = this.folders.pages
        console.log(JSON.stringify(pages))
        pages.pageIndex++
        requestFolder(this.nowPath, pages)
          .then(data => {
            this.folders.array = this.folders.array.concat(data.folders)
            pages.totalCount = data.totalCount
            if (!this.foldersHasNextPage) {
              this.$nextTick(() => {
                this.loadNextPage()
              })
            }
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
    transition: all 0.5s;
    background-color: #0000ff10;
    :hover {
      background-color: #0000ff47;
    }
  }
  &:nth-child(2n) {
    transition: all 0.5s;
    background-color: #0000ff07;
    :hover {
      background-color: #0000ff37;
    }
  }
}
</style>
