<template>
  <div v-loading="loading">
    <el-form style="margin-bottom:1rem">
      <AuthCode v-model="auth" />
    </el-form>
    <el-tree :data="list" :expand-on-click-node="false">
      <span slot-scope="{ node,data }" class="custom-tree-node">
        <span>{{ data.title }}</span>
        <span v-if="node.isLeaf">
          <span v-if="data.permissions&&data.permissions.length>0">
            <i class="el-icon-check" style="color:#3c3" />
            <el-button
              type="text"
              @click="showPermissionDetail(node,data)"
            >{{ data.permissions.length>1?`${data.permissions[0]}等${data.permissions.length}个权限`:`${data.permissions[0]}` }}</el-button>
          </span>
          <el-button v-else type="text" @click="showPermissionDetail(node,data)">无权限</el-button>
        </span>
      </span>
    </el-tree>
    <el-button type="success" style="margin-top:1rem;width:100%" @click="requireUpdate">提交保存</el-button>
    <el-dialog :visible.sync="show_permission_dialog" append-to-body>
      <PermissionModify
        v-model="currentPermission.data"
        :name="currentPermission.name"
        :title="currentPermission.title"
        @require-close="show_permission_dialog=false"
        @require-update="requireUpdate"
      />
    </el-dialog>
  </div>
</template>

<script>
const createPermission = () => [
  {
    title: '执行新增操作',
    name: 'create',
    permissions: [],
  },
  {
    title: '执行编辑操作',
    name: 'update',
    permissions: [],
  },
  {
    title: '执行移除操作',
    name: 'remove',
    permissions: [],
  },
  {
    title: '执行查询操作',
    name: 'query',
    permissions: [],
  },
]
import { allPermissions, getPermission, postPermission } from '@/api/permission'
import AuthCode from '@/components/AuthCode'
import PermissionModify from './PermissionModify'
export default {
  name: 'PermissionManager',
  components: { AuthCode, PermissionModify },
  props: {
    userId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loading: false,
    list: [],
    itemDict: null, // key=>permission item
    permissionDict: null, // key=>permission entity
    currentPermission: {
      data: null,
      name: null,
      title: null,
    },
    auth: {
      authByUserId: '',
      code: '',
    },
    show_permission_dialog: false,
  }),
  watch: {
    userId: {
      handler(val) {
        this.load()
      },
      immediate: true,
    },
  },
  mounted() {
    this.init_load()
  },
  methods: {
    requireUpdate() {
      this.show_permission_dialog = false
      this.loading = true
      const sumchild = (prev, cur) => {
        return prev + (cur.permissions && cur.permissions.length) || 0
      }
      const new_permissions = Object.keys(this.permissionDict).filter(
        (k) => this.permissionDict[k].children.reduce(sumchild, 0) > 0
      )
      const result = {}
      for (let i = 0; i < new_permissions.length; i++) {
        const item = this.permissionDict[new_permissions[i]]
        const cur_item = {}
        result[new_permissions[i]] = cur_item
        for (let c = 0; c < item.children.length; c++) {
          const child = item.children[c]
          cur_item[child.name] = child.permissions
        }
      }
      const newPermissionSubmit = JSON.stringify(result)
      postPermission({
        id: this.userId,
        auth: this.auth,
        NewPermission: newPermissionSubmit,
      })
        .then(() => {
          this.$message.success('已提交')
        })
        .finally(() => {
          this.loading = false
        })
    },
    showPermissionDetail(node, data) {
      console.log(node)
      this.currentPermission = {
        data,
        title: node.parent.data.title,
        name: node.parent.data.name,
      }
      this.show_permission_dialog = true
    },
    load() {
      if (!this.itemDict) {
        setTimeout(() => this.load(), 200)
        return
      }
      const id = this.userId
      if (!id) return
      getPermission({ id }).then((data) => {
        const list = Object.keys(data)
        for (let i = 0; i < list.length; i++) {
          const item = data[list[i]]
          const raw_permit = this.permissionDict[list[i]]
          if (raw_permit) {
            const c = raw_permit.children
            c[0].permissions = item.create
            c[1].permissions = item.update
            c[2].permissions = item.remove
            c[3].permissions = item.query
          }
        }
      })
    },
    init_load() {
      this.loading = true
      allPermissions()
        .then((data) => {
          const list = data.model
          const newList = []
          const newListDict = {}
          const itemDict = {}
          const permissionDict = {}
          for (let i = 0; i < list.length; i++) {
            const infos = list[i].item1.split(':')
            const key = infos[1]
            if (!newListDict[key]) {
              newListDict[key] = {
                name: key,
                title: infos[1],
                children: [],
              }
              itemDict[infos[1]] = newListDict[key]
              newList.push(newListDict[key])
            }
            const permit_name = list[i].item2.name
            const tmp = {
              name: permit_name,
              title: list[i].item2.description,
              children: createPermission(),
            }
            permissionDict[permit_name] = tmp
            newListDict[key].children.push(tmp)
          }
          this.list = newList
          this.itemDict = itemDict
          this.permissionDict = permissionDict
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
