<template>
  <div>
    <div>
      <el-form inline ref="addForm" :model="addForm" :rules="addFormRules">
        <el-form-item label="当天输赢" prop="win">
          <el-input v-model="addForm.win"></el-input>
        </el-form-item>
        <el-form-item label="其他支出" prop="other">
          <el-input v-model="addForm.other"></el-input>
        </el-form-item>
        <el-form-item label="最小下注" prop="min_bet">
          <el-input v-model="addForm.min_bet"></el-input>
        </el-form-item>
        <el-form-item label="最大下注" prop="max_bet">
          <el-input v-model="addForm.max_bet"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="当天描述" prop="description">
            <el-input type="textarea" v-model="addForm.description"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="addloading">添加记录</el-button>
        </div>
      </el-form>
    </div>
    <div>
      <el-button plain type="primary" v-for="(item, i) in btnList" :key="i">{{ item.label }}</el-button> &nbsp;
      <el-date-picker
        v-model="params.datetime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
      </el-date-picker> &nbsp;
      <el-button type="primary" :loading="loading" @click="getData">查询</el-button>
    </div> <br />
    <el-table :data="recordList" v-loading="loading" border stripe show-summary :summary-method="getSummaries">
      <el-table-column  v-for="(item, i) in tableColumn" :key="i" v-bind="item">
        <template slot-scope="scope">
          <tableCom v-if="item.render" :render="item.render" :row="scope.row" :scope="scope"></tableCom>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src
import moment from 'moment'
const tableCom = {
  props: ['render', 'row', 'scope'],
  render(h) {
    return this.render(h, this.row, this.scope)
  }
}

export default {
  name: 'Home',
  components: { tableCom },
  data() {
    return {
      btnList: [
        { label: '上个月', value: 'lastMonth' },
        { label: '当月', value: 'currentMonth' },
      ],
      params: {
        datetime: ''
      },
      addForm: {
        win: '',
        max_bet: '',
        min_bet: '',
        other: '',
        description: ''
      },
      addFormRules: {
        win: [ { required: true, message: '请输入当天输赢', trigger: 'blur' } ],
        max_bet: [ { required: true, message: '请输入最大下注', trigger: 'blur' } ],
        min_bet: [ { required: true, message: '请输入最小下注', trigger: 'blur' } ],
        other: [ { required: true, message: '请输入其他支出', trigger: 'blur' } ],
        description: [ { required: true, message: '请输入当天描述', trigger: 'blur' } ],
      },
      recordList: [],
      tableColumn: [
        { label: '序号', render: (h, row, scope) => h('span', scope.$index + 1), width: 60 },
        { label: '输赢', prop: 'win', width: 90 },
        { label: '其他支出', prop: 'other', width: 90 },
        { label: '最小下注', prop: 'min_bet', width: 80 },
        { label: '最大下注', prop: 'max_bet', width: 80 },
        { label: '当天描述', prop: 'description' },
        { label: '时间', prop: 'create_time', width: 150 },
        { label: '操作', render: (h, row) => {
          return h('el-button', { attrs: { type: 'danger' }, on: { click: () => this.handleDel(row) } }, '删除')
        }, width: 100, fixed: 'right' }
      ],
      addloading: false,
      loading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const totalFn = key => {
        let total = 0
        this.recordList.forEach(i => {
          total += i[key]
        })
        return total
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const totalI = {
          1: 'win',
          2: 'other'
        }
        const key = totalI[index]
        sums[index] = key ? totalFn(key) : '--'
      })
      return sums
    },
    handleSubmit() {
      this.$refs['addForm'].validate(isOk => {
        if (isOk) this.handlAddRecord()
      })
    },
    handleDel(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row)
      })
    },
    async handleDelete({ id }) {
      const data = { id }
      const { res } = await this.$post(this.$urls.delRecord, data)
      if (res) {
        this.$message.success('删除成功')
        this.getData()
      }
    },
    async handlAddRecord() {
      const data = {
        ...this.addForm
      }
      this.addloading = true
      const { res } = await this.$post(this.$urls.addRecord, data)
      this.addloading = false
      if (res) {
        this.$message.success('添加成功')
        this.getData()
      }
    },
    async getData() {
      const params = {}
      this.loading = true
      const { res } = await this.$get(this.$urls.recordlist, params)
      this.loading = false
      if (res) {
        const { list } = res.data
        this.recordList = list.map(i => ({ ...i, create_time: moment(i.create_time).format('YYYY-MM-DD HH:mm:ss') }))
      }

    }
  }
}
</script>
