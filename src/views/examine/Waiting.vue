<template>
  <div>
    <el-table v-loading="listLoading" :data="list" size="mini" fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="50" />
      <el-table-column label="开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节目名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration | formateSeconds }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :layout="'total, prev, pager, next, sizes'" @pagination="getList" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { fetchList } from '@/api/program'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    formatDate(val) {
      if (val === '') return ''
      return parseTime(val)
    },
    formateSeconds(second) {
      let secondTime = parseInt(second) // 将传入的秒的值转化为Number
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ''
      if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
        if (min > 60) { // 如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) // 获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
      },
      start_time: (new Date().getTime()) - 24 * 60 * 60 * 1000
    }
  },
  created() {
    this.getList()
  },
  methods: {
    calcMap() {
      this.list[0].start_time = this.start_time
      this.list.map((item, idx, arr) => {
        if (idx === 0) {
          item.start_time = this.start_time
        } else {
          item.start_time = arr[idx - 1].end_time
        }
        item.end_time = item.start_time + item.duration * 1000
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
        this.total = data.total

        this.listLoading = false
        this.calcMap()
      }).catch(error => {
        this.listLoading = false
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.getList()
    }
  }
}
</script>
