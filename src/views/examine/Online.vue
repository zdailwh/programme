<template>
  <div class="programListWrap">
    <el-form ref="filterForm" :model="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item prop="starttime">
        <el-date-picker
          v-model="filterForm.starttime"
          style="width:200px"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="起始时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" size="mini" fit style="width: 100%;" height="600">
      <el-table-column type="index" width="50" />
      <el-table-column label="开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endtime }}</span>
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
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-popover
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此节目及之后的所有节目吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delEpg(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="small" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :layout="'total, prev, pager, next, sizes'" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, deleteEpg } from '@/api/epg'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    formateSeconds(second) {
      let secondTime = parseInt(second / 1000)
      var haomiao = parseInt(second % 1000)
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
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}.${haomiao.toString().padStart(3, '0')}`
      return result
    }
  },
  props: {
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
        starttime: ''
      }
    }
  },
  created() {
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
      if (this.channelId) {
        this.listQuery.channelId = this.channelId
      }
      if (this.filterForm.starttime) {
        this.listQuery.starttime = this.filterForm.starttime
      }
      this.getList()
    },
    delEpg(id, idx) {
      deleteEpg({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>
