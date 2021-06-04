<template>
  <div class="programListWrap">
    <el-form ref="filterForm" :model="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item prop="showname">
        <el-input v-model="filterForm.showname" clearable placeholder="节目名称" style="width:120px" />
      </el-form-item>
      <el-form-item prop="finishtime_range">
        <el-date-picker
          v-model="filterForm.finishtime_range"
          style="width:330px"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="上载开始日期"
          end-placeholder="上载结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" v-loading="listLoading" :data="list" size="mini" fit style="width: 100%;" height="600" @row-dblclick="handleDblclick">
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column type="index" align="center" width="40" />
      <el-table-column label="节目名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration | formateSeconds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="码率" align="center">
        <template slot-scope="{row}">
          <span>{{ row.coderate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.finishtime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :layout="'total, prev, pager, next, sizes'" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/program'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    formateSeconds(second) {
      let secondTime = parseInt(second / 1000)
      // var haomiao = parseInt(second % 1000)
      let min = 0 // 初始化分
      let h = 0 // 初始化小时
      let result = ''
      if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60) // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60) // 获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) { // 如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60) // 获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) // 获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    }
  },
  props: {
    channel: {
      type: String,
      default: ''
    },
    channelId: {
      type: Number,
      default: 0
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
        showname: '',
        finishtime_range: []
      }
    }
  },
  created() {
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        if (data.items) {
          data.items.map((item, idx, arr) => {
            item.starttime = ''
            item.endtime = ''
            item.filename = item.name // 文件名称
            item.name = item.showname // 节目名称
            item.flag = 0 // 0: 顺播；1: 定时播
          })
          this.list = data.items
        } else {
          this.list = []
        }

        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.showname !== '') {
        this.listQuery.showname = this.filterForm.showname
      }
      if (this.channel !== '') {
        this.listQuery.channel = this.channel
      }
      if (this.channelId) {
        this.listQuery.channelId = this.channelId
      }
      if (this.filterForm.finishtime_range && this.filterForm.finishtime_range.length) {
        this.listQuery.finishtime_range = this.filterForm.finishtime_range
      }
      this.getList()
    },
    // 双击插入
    handleDblclick(item) {
      this.$emit('append-pro', { item: item })
    }
  }
}
</script>
