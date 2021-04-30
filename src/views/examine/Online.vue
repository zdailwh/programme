<template>
  <div class="programListWrap tempEpgTableWrap">
    <el-form ref="filterForm" :model="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item prop="starttime">
        <el-date-picker
          v-model="filterForm.starttime"
          align="right"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="播出日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tableList" v-loading="listLoading" :data="list" size="mini" fit style="width: 100%;" height="600" :row-class-name="tableRowClassName">
      <el-table-column type="index" align="center" width="50" />
      <el-table-column label="开始时间" align="center" class-name="start-time">
        <template slot-scope="{row}">
          <span>{{ row.starttime.substring(0, row.starttime.length - 4) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endtime.substring(0, row.endtime.length - 4) }}</span>
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
            <el-button v-if="new Date(row.starttime).getTime() > new Date().getTime()" slot="reference" type="text" size="small" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchListByDate, deleteEpg } from '@/api/epg'

export default {
  filters: {
    formateSeconds(second) {
      let secondTime = parseInt(second / 1000)
      // var haomiao = parseInt(second % 1000)
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
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        orderby: 'id'
      },
      filterForm: {
        starttime: parseTime(new Date(new Date().toLocaleDateString()).getTime())
      },
      currIndex: 0
    }
  },
  computed: {
    pickerOptions() {
      var selectedDate = this.filterForm.starttime
      var opt = {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: '前一天',
            onClick(picker) {
              const date = new Date(new Date(selectedDate).toLocaleDateString())
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date(new Date().toLocaleDateString()))
            }
          },
          {
            text: '后一天',
            onClick(picker) {
              const date = new Date(new Date(selectedDate).toLocaleDateString())
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }
        ]
      }
      return opt
    }
  },
  watch: {
    currIndex(val) {
      this.$nextTick(function() {
        var currTr = this.$refs.tableList.$el.querySelectorAll('table.el-table__body')[0].querySelectorAll('tr')[val]
        if (currTr.offsetTop > (600 - 33) / 2) {
          this.$refs.tableList.bodyWrapper.scrollTop = currTr.offsetTop - ((600 - 33) / 2)
        }
      })
    }
  },
  created() {
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListByDate(this.listQuery).then(data => {
        this.list = data.items

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
      if (this.channelId) {
        this.listQuery.channelId = this.channelId
      }
      if (this.filterForm.starttime) {
        this.listQuery.starttime_range = [this.filterForm.starttime, parseTime(new Date(new Date(this.filterForm.starttime).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000)]
      }
      this.getList()
    },
    delEpg(id, idx) {
      deleteEpg({ id: id }).then(response => {
        this.$message({
          message: `${response.delcnt}条节目被成功删除！`,
          type: 'success'
        })
        this.getList()
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (new Date(row.starttime).getTime() <= new Date().getTime() && new Date(row.endtime).getTime() >= new Date().getTime()) {
        // 当前在播节目
        this.currIndex = rowIndex
        return 'bg-blue'
      } else if (new Date(row.endtime).getTime() < new Date().getTime()) {
        // 已播节目
        return 'bg-gray'
      }
    }
  }
}
function parseTime(time) {
  const date = new Date(time)

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    ms: date.getMilliseconds()
  }

  return `${formatObj.y}-${formatObj.m.toString().padStart(2, '0')}-${formatObj.d.toString().padStart(2, '0')} ${formatObj.h.toString().padStart(2, '0')}:${formatObj.i.toString().padStart(2, '0')}:${formatObj.s.toString().padStart(2, '0')}`
}
</script>
