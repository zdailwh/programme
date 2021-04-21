<template>
  <div class="programListWrap">
    <el-form ref="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-document-copy" :disabled="!selectedItems.length" @click="handleCopySelected">
          复制
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!selectedItems.length" @click="handleDelSelected">
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" :data="listCurr" size="mini" fit highlight-current-row style="width: 100%;" height="600" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="40" />
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
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-popover
            title="节目开始时间"
            placement="top"
            width="190"
            trigger="hover"
            @show="setDefaultStartTime(row.start_time)"
          >
            <el-input v-model="myStartTime" size="small" placeholder="请输入节目开始时间" style="margin-bottom: 10px;" />
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="updateStartTime(row, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="small">编辑</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive

export default {
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
  props: {
    listCurr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectedItems: [],
      currentRow: null,
      myStartTime: ''
    }
  },
  created() {
  },
  methods: {
    setDefaultStartTime(starttime) {
      this.myStartTime = parseTime(starttime)
    },
    updateStartTime(row, idx) {
      this.$emit('update-start-time', { index: idx, starttime: this.myStartTime })
    },
    handleDelSelected() {
      this.$emit('remove-pro', { items: this.selectedItems })
      this.$refs.multipleTable.clearSelection()
    },
    handleCopySelected() {
      this.$emit('copy-pro', { items: this.selectedItems })
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>
