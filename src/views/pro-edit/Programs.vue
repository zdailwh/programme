<template>
  <div class="programListWrap">
    <el-form ref="filterForm" :model="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" clearable placeholder="节目名称" style="width:120px" />
      </el-form-item>
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.create_time_range"
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
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-d-arrow-left" :disabled="!selectedItems.length" @click="handleAddSelected">
          插入
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" v-loading="listLoading" :data="list" size="mini" fit style="width: 100%;" height="600" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="40" />
      <el-table-column label="ID" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration | formateSeconds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="码率" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bitrate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center" sortable="custom" prop="createdate">
        <template slot-scope="{row}">
          <span>{{ row.createdate }}</span>
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
      selectedItems: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
        this.total = data.total

        this.listLoading = false
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
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    handleSortChange(val) {
      console.log(val)
    },
    handleAddSelected() {
      this.$emit('append-pro', { items: this.selectedItems })
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>
