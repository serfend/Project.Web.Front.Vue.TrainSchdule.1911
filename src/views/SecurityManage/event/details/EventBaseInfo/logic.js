import { formatTime, parseTime, getTimeDesc, datedifference } from '@/utils'
import waves from '@/directive/waves'
export default {
  name: 'EventBaseInfo',
  components: {
    Editor: () => import('./Edit'),
    ConferenceType: () => import('@/components/Party/ConferType'),
    PartyGroup: () => import('@/components/Party/PartyGroup'),
    Company: () => import('@/components/Company/CompanyFormItem'),
    UserItem: () => import('@/components/User/UserFormItem')
  },
  directives: { waves },
  model: {
    prop: 'conference',
    event: 'change'
  },
  props: {
    conference: { type: Object, default: null }
  },
  data: () => ({
    refresher: null,
    percent: 0,
    spent: 0,
    total: 0,
    showEditConference: false
  }),
  computed: {
    conferTime() {
      const d = this.conference
      if (!d) return null
      const endTime = new Date(d.startTime).getTime() + d.length * 1e3
      return `${parseTime(d.startTime)} - ${parseTime(endTime)}`
    }
  },
  mounted() {
    this.refresher = setInterval(() => {
      this.update()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    parseTime,
    formatTime,
    requireRefresh() {
      this.$emit('requireRefresh')
    },
    update() {
      this.percent = this.get_percent()
    },
    get_total() {
      const d = this.conference
      if (!d || !d.startTime) return 1
      return d.length * 1e3
    },
    get_spent() {
      const d = this.conference
      if (!d) return 0
      const r = 1 + datedifference(new Date(), new Date(d.startTime), 'second') * 1e3
      return r
    },
    get_percent() {
      const d = this.conference
      if (!d) return 0
      this.total = this.get_total()
      this.spent = this.get_spent()
      const total = this.total
      if (total === 0) return 10
      if (this.spent < 0) return 0
      if (this.spent > total) return 100
      return Math.round((this.spent / total) * 1e4) / 1e2
    },
    formatPercent(val) {
      const d = this.conference
      if (!d) return 0
      if (this.spent <= 0) {
        const start = -this.spent / 1e3
        const left_desc = getTimeDesc(start)
        return `${left_desc} 未开始`
      }
      if (val >= 100) {
        const expect_return = new Date(d.startTime).getTime() + d.length * 1e3
        return `${formatTime(expect_return)}已结束（${parseTime(
          expect_return
        )}）`
      }
      const left = (this.total - this.spent) / 1e3
      const left_desc = getTimeDesc(left)
      const percent = `${Math.round((this.spent / this.total) * 10000) / 100}%`
      return `${left_desc} ${percent}`
    }
  },
}
