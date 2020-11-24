<template>
  <el-card style="margin-top:1rem">
    <span slot="header">操作权限</span>
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
        <span v-else>{{ data.total>0?`${data.total}个权限`:'' }}</span>
      </span>
    </el-tree>
    <el-button type="success" style="margin-top:1rem;width:100%" @click="requireUpdate(true)">提交保存</el-button>
    <el-dialog :visible.sync="show_permission_dialog" append-to-body>
      <PermissionModify
        v-model="currentPermission.data"
        :name="currentPermission.name"
        :title="currentPermission.title"
        @require-close="show_permission_dialog=false"
        @require-update="requireUpdate(true)"
      />
    </el-dialog>
  </el-card>
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
import PermissionModify from './PermissionModify'

import { allPermissions, getPermission, postPermission } from '@/api/permission'
export default {
  name: 'PermissionManager',
  components: {
    PermissionModify,
  },
  props: {
    userId: {
      type: String,
      default: null,
    },
    auth: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    lastUpdate: '',
    lastUser: null,
    list: [],
    raw_data: null,
    itemDict: null, // key=>permission item
    permissionDict: null, // key=>permission entity
    currentPermission: {
      data: null,
      name: null,
      title: null,
    },
    show_permission_dialog: false,
  }),
  mounted() {
    this.init_load()
  },
  destroyed() {
    this.requireUpdate()
  },
  methods: {
    check_update() {
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
      return newPermissionSubmit
    },
    requireUpdate(directUpdate = false) {
      console.log('require update')
      if (!this.lastUpdate || !this.lastUser) return
      const id = this.lastUser
      const f = this.check_update()
      if (!directUpdate && f !== this.lastUpdate) {
        this.$confirm('权限有修改，是否更新', '更新提醒', {
          type: 'info',
        }).then(() => {
          this.do_submit(f, id)
        })
      } else if (f !== this.lastUpdate) {
        this.do_submit(f, id)
      }
    },
    do_submit(NewPermission, id) {
      this.loading = true
      postPermission({
        id,
        auth: this.auth,
        NewPermission,
      })
        .then(() => {
          this.$message.success('已提交')
        })
        .finally(() => {
          this.loading = false
          this.show_permission_dialog = false
        })
    },
    showPermissionDetail(node, data) {
      this.currentPermission = {
        data,
        title: node.parent.data.title,
        name: node.parent.data.name,
        total: 0,
      }
      this.show_permission_dialog = true
    },
    load() {
      if (!this.itemDict) {
        setTimeout(() => this.load(), 200)
        return
      }
      this.requireUpdate()
      this.load_config()
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
            const total_permitcount = c.reduce(
              (prev, cur) =>
                prev + (cur.permissions && cur.permissions.length) || 0,
              0
            )
            let node = raw_permit
            do {
              node.total += total_permitcount
              node = node.parent
            } while (node.parent)
          }
        }
        this.lastUpdate = this.check_update()
      })
    },
    init_load() {
      this.loading = true
      allPermissions()
        .then((data) => {
          this.raw_data = data
          this.load_config()
        })
        .finally(() => {
          this.loading = false
        })
    },
    load_config() {
      const list = this.raw_data.model
      const newList = []
      const newListDict = {}
      const itemDict = {}
      const permissionDict = {}
      for (let i = 0; i < list.length; i++) {
        const infos = list[i].item1.split(':')
        const key = infos[1]
        // 判断层级是否存在，不存在则新建
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
        // 添加新的节点
        const tmp = {
          name: permit_name,
          title: list[i].item2.description,
          children: createPermission(),
          parent: newListDict[key],
          total: 0,
        }
        permissionDict[permit_name] = tmp
        newListDict[key].children.push(tmp)
      }
      this.list = newList
      this.itemDict = itemDict
      this.permissionDict = permissionDict
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
