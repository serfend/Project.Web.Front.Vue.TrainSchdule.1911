const Mock = require('mockjs')
const Random = Mock.Random

/**
 *
 *
 * @export
 * @params:
      eventPeriodType string 事件周期类型(today,next_day,week,next_week,month,next_month,season,next_season)

      eventPeriod string 事件周期范围(year,season,month,week,special_xxx)

      eventType string 事件类型
      eventTag string 事件标签
      eventCompany string 事件归属单位
      page 分页
 * @return {*}
 */
export function eventList ({ database_name, eventPeriodType, eventPeriod, eventType, eventTag, eventCompany, page }) {
  const { pageIndex, pageSize } = page
  return new Promise((res) => {
    let list = database_data[database_name]
    if (eventCompany) list = list.filter(i => i.company && i.company.indexOf(eventCompany) === 0)
    const start = pageIndex * pageSize
    res({
      list: list.slice(start, start + pageSize),
      totalCount: list.length
    })
  })
}
const company = [
  'A单位',
  'B单位',
  'C单位',
]
const tags = [
  'A标签',
  'B标签',
  'C标签',
  'D标签',
  'E标签',
  'F标签',
  'G标签',
  'H标签',
  'I标签'
]
const types = ['A类型事件', 'B类型事件', 'C类型事件']
import { pick, groupByFiled } from '@/utils/data-handle'
function date_pick (date1, date2) {
  const date_ratio = Math.random()
  return new Date((date1 * date_ratio) + (date2 * (1 - date_ratio)))
}
const date_range = [new Date('2019-8-1').getTime(), new Date().getTime()]
const summary_length = 50
const events = [
  {
    'name': '山东五彩龙投资有限公司栖霞市笏山金矿“1·10”重大爆炸事故',
    'detail': `山东五彩龙投资有限公司栖霞市笏山金矿发生爆炸事故，造成11人死亡，直接经济损失6847.33万元。发生原因是，笏山金矿井下违规混存炸药、雷管，井口实施罐笼气割作业产生的高温熔渣块掉入回风井，碰撞井筒设施，弹落到一中段马头门内乱堆乱放的炸药包装纸箱上，引起纸箱等可燃物燃烧，导致雷管、导爆索和炸药爆炸。

    主要教训：一是井下违规混存炸药、雷管。山东五彩龙公司长期违规购买民用爆炸物品，违规在井下设置爆炸物品储存场所，且炸药、雷管和易燃物品混合存放。二是违规进行气焊切割作业。进行气焊切割作业时未确认作业环境及周边安全条件，井筒提升与井口气焊违规同时作业。三是安全管理混乱。笏山金矿对施工单位的施工情况尤其是民用爆炸物品储存、领用、搬运及爆破作业情况管理缺失，对外包施工队以包代管，只包不管，未按照规定报告生产安全事故；施工单位未按规定配备专职安全管理人员和技术人员，作业人员使用伪造的特种作业操作证；事故发生当日井下作业现场没有工程监理。四是地方党委政府履行安全生产领导责任不力。未认真督促相关部门依法履行民用爆炸物品、非煤矿山安全生产监督管理相关职责，栖霞市党委政府对事故迟报瞒报。地方有关部门监管责任未有效落实。`
  },
  {
    'name': '黑龙江凯伦达科技有限公司“4·21”较大中毒窒息事故',
    'detail': '黑龙江省绥化市安达市黑龙江凯伦达科技有限公司在三车间制气釜停工检修过程中发生中毒窒息事故，造成4人死亡、9人中毒受伤，直接经济损失873万元。发生原因是，在4个月的停产期间，制气釜内气态物料未进行退料、隔离和置换，釜底部聚集了高浓度的氧硫化碳与硫化氢混合气体，维修作业人员在没有采取任何防护措施的情况下，进入制气釜底部作业，吸入有毒气体造成中毒窒息。救援过程中，救援人员在没有采取防护措施的情况下多次向釜内探身、呼喊、拖拽施救，致使现场9人不同程度中毒受伤。\n主要教训：一是涉事企业法律意识缺失、安全意识淡薄。未落实安全生产主体责任，违规组织受限空间作业，作业前作业人员未申请受限空间作业票。二是安全风险辨识和隐患排查治理不到位。凯伦达公司未按规定要求开展自检自查，未辨识出三车间制气釜检修存在氧硫化碳和硫化氢混合气体中毒窒息风险，未制定可靠防范措施。三是安全管理混乱。凯伦达公司未按规定设置分管安全生产负责人，安全管理制度不完善，未建立安全风险管控制度。四是涉事企业对作业人员岗位培训不到位，应急处置能力严重不足。未组织开展应急预案培训及演练，作业现场未配备足够的应急救援物资和个人防护用品。五是地方党委政府未统筹好发展和安全的关系。安全发展理念不牢，红线意识不强，化工项目准入门槛低且把关不严，在安全基础薄弱、安全风险管控能力不足的情况下，盲目承接异地转移的高风险化工项目。'
  },
  {
    'name': '湖北十堰艳湖社区集贸市场“6·13”重大燃气爆炸事故',
    'detail': '湖北省十堰市张湾区艳湖社区集贸市场发生燃气爆炸事故，造成26人死亡，138人受伤，其中重伤37人，直接经济损失约5395.41万元。发生原因是，天然气中压钢管严重腐蚀导致破裂，泄漏的天然气在集贸市场涉事故建筑物下方河道内密闭空间聚集，遇餐饮商户排油烟管道排出的火星发生爆炸。\n    主要教训：一是安全隐患排查整治不深入不彻底。涉事燃气管道改造时违规将管道穿越集贸市场涉事故建筑物下方，形成重大事故隐患。十堰东风中燃公司持续5年未对集贸市场下方河道下面相对危险的区域开展巡线。十堰市燃气主管部门先后开展多次专项整治，均未发现并排除重大隐患。二是应对突发事件能力不足。从群众报警到爆炸发生长达1小时，十堰东风中燃公司及其现场巡查处突人员未能及时疏散群众，未按预案设立警戒、禁绝火源、疏散人群，未立即控制管道上下游两端的燃气阀门、保持管道内正压，在未消除燃爆危险的情况下向相关救援人员提出结束处置、撤离现场的错误建议。三是涉事企业主体责任严重缺失。十堰东风中燃公司对130次燃气泄漏报警、管道压力传感器长时间处于故障状态等系统性隐患熟视无睹；任命未取得执业资格考核合格证的人员分管安全生产工作；任命从未参加过业务培训，不了解巡线职责，不会使用燃气检漏仪的人员担任巡线班组负责人。四是安全执法检查流于形式。燃气管理部门对燃气企业执法检查121次，但未对违法行为实施过一次行政处罚。'
  }
]
const best_event = [
  {
    'name': '勤学习，不断提高业务管理能力',
    'detail': '该自任职以来能积极学习公司规章制度、相关法律法规和业务知识，注重知识的积累，能在工作、生活之余加强学习，掌握安全生产知识，提高业务管理能力。面对安全生产工作的新形势、新要求，以强烈的事业心和工作责任感，将学习安全生产法律法规作为自觉行为，不断丰富积累新时期安全生产法律法规及知识，做到了学有所获、学有所思、学有所用，能理论联系实际，多次在突发事件的处理和隐患的排查实际工作中发挥重要作用。'
  }, {
    'name': '落实处，强化宣传培训教育堡垒',
    'detail': '一是在做好平常的全员三级安全教育之外，还认真开展了复工培训、新“标准化”培训学习。据统计，今年以来，其共主持参与各种形式的授课120余学时，编写课件__个，下载警示教育视频20余部，接受培训人员累计达__余人次。二是有针对性地开展“夏防”、“冬防”、“安全生产月”、“百日安全”等宣传教育活动，大力宣扬安全生产的重要意义，营造浓厚的安全活动氛围。三是除了一般的宣传标语外，还充分利用微信群、qq群开展有奖问答、信息化管理班前会等。'
  }, {
    'name': '搞创新，助推安全生产标准化建设',
    'detail': '为深入贯彻落实《安全生产“低、老、坏”问题专项整治活动》，创新了《“表单式”“低老坏”专项整治清单》，此清单使“低、老、坏”等问题得到有效改善，有效促进了安全生产标准化的工作推进。同时，该清单也得到了公司的认可和推广，在公司9月份安全办公会上成为一大工作亮点。在蒙大新能源项目部“百日安全”活动期间，为使安全宣传教育更加方便化、灵活化，创新了微信群“一天一提醒”，引来了项目部职工的阅读和点赞，做到了手指动一动，安全警钟敲在心中、记在脑海中、警示在行动中。'
  }
]

// id:"guid 序号",
// name:"string 事件标题",
// type:"string 事件类型",
// tag:["string 事件标签"],
// company:"string 归属单位",
// create:"datetime 创建时间",
// update:"datetime 变更时间",
// record:"datetime 事件发生时间",
// detail:"string 事件详细描述",
// summary:"string 事件概述"
function generate_event (database_name) {
  const e = pick(database_names[database_name], 1)[0]
  const data = {
    id: Random.guid(),
    create: date_pick(date_range[0], date_range[1]),
    update: date_pick(date_range[0], date_range[1]),
    record: date_pick(date_range[0], date_range[1]),
    name: e.name,
    type: pick(types, 1)[0],
    tag: pick(tags, Math.ceil(Math.random() * 5) + 1),
    company: pick(company, 1)[0],
    detail: e.detail
  }
  data.summary = data.detail.substring(0, summary_length)
  if (data.detail.length > summary_length)data.summary = `${data.summary}...`
  return data
}
function init_database (database_name) {
  let _database = new Array(20).fill(null).map((i, index) => generate_event(database_name))
  _database.sort((a, b) => b.record - a.record)
  _database = groupByFiled(_database, 'type')
  return Object.values(_database).flat()
}
const database_data = {}
const database_names = {
  'best_event': best_event, 'security_event': events
}
Object.keys(database_names).map(i => {
  database_data[i] = init_database(i)
})
