<template>
  <div>
    <UserBatchSelector
      :users="currentFocusUsers"
      :selected-users.sync="focus_users"
      :btn-edit-label="null"
      @requireEdit="handleEdit"
    />
  </div>
</template>
<script>

export default {
  name: 'ExceedingUsers',
  components: {
    UserBatchSelector: () => import('@/components/User/UserBatchSelector'),
  },
  props: {
    data: { type: Object, required: true },
    name: { type: String, default: null }
  },
  data: () => ({
    focus_users: []
  }),
  computed: {
    currentFocusUsers () {
      return this.data.item1
    }
  },
  watch: {
    data: {
      handler (v) {
        this.focus_users = v.item1
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleEdit (v) {
      debugger
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
