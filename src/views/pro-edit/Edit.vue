<template>
  <div class="programListWrap tempEpgTableWrap">
    <el-form ref="filterForm" :inline="true" size="mini" class="filter-form">
      <el-form-item v-if="!isVisitor">
        <el-button class="filter-item" type="primary" icon="el-icon-document-copy" :disabled="!selectedItems.length" @click="handleCopySelected">
          复制
        </el-button>
      </el-form-item>
      <el-form-item v-if="!isVisitor">
        <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="!selectedItems.length" @click="handleDelSelected">
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" :data="listCurr" size="mini" fit highlight-current-row style="width: 100%;" height="600" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
      <el-table-column type="selection" width="50" align="center" :selectable="selectable" />
      <!-- <el-table-column type="index" width="40" /> -->
      <el-table-column label="操作" align="center" width="50">
        <template slot-scope="{row, $index}">
          <el-popover
            v-if="!row.isTheLastEpg && !row.isTheCurrEpg"
            title="节目开始时间"
            placement="top"
            width="250"
            trigger="click"
            @show="setDefaultStartTime(row.starttime)"
          >
            <el-row class="updateTimeWrap" style="margin-bottom: 10px;">
              <el-col :span="12">
                <el-date-picker v-model="myStartDate" type="date" placeholder="选择日期" size="mini" value-format="yyyy-MM-dd" :clearable="false" :editable="false" />
              </el-col>
              <el-col :span="12">
                <el-time-picker v-model="myStartTime" placeholder="选择时间" size="mini" value-format="HH:mm:ss" :clearable="false" :editable="false" />
              </el-col>
            </el-row>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="fixedTime(row, $index)">定时播</el-button>
              <el-button type="primary" size="mini" @click="turnTime(row, $index)">顺播</el-button>
            </div>
            <el-button slot="reference" type="text" size="small">{{ row.flag ? '定时播' : '顺播' }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
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
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="播出时长" align="center">
        <template slot-scope="{row}">
          <span>{{ (new Date(row.endtime).getTime() - new Date(row.starttime).getTime()) | formateSeconds }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import Cookies from 'js-cookie'
import waves from '@/directive/waves' // waves directive

export default {
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
    listCurr: {
      type: Array,
      default() {
        return []
      }
    },
    hasPrepend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isVisitor: (Cookies.get('Programme-isVisitor') && JSON.parse(Cookies.get('Programme-isVisitor'))) || false,
      selectedItems: [],
      currentRow: null,
      myStartDate: '',
      myStartTime: '',
      myStartTimeHaom: '',
      pin: false
    }
  },
  created() {
  },
  mounted() {
    window.addEventListener('keydown', code => {
      if (code.keyCode === 16 && code.shiftKey) {
        // 判断是否按住shift键，是就把pin赋值为true
        this.pin = true
      }
    })
    window.addEventListener('keyup', code => {
      if (code.keyCode === 16) {
        // 判断是否松开shift键，是就把pin赋值为false
        this.pin = false
      }
    })
  },
  methods: {
    setDefaultStartTime(starttime) {
      this.myStartDate = starttime.substring(0, starttime.indexOf(' '))
      this.myStartTime = starttime.substring(starttime.indexOf(' ') + 1, starttime.length - 4)
      this.myStartTimeHaom = starttime.substring(starttime.indexOf('.'))
    },
    fixedTime(row, idx) {
      var popNodes = document.querySelectorAll('.el-popover.el-popper')
      popNodes.forEach((item) => {
        item.style.display = 'none'
      })
      this.$emit('fixed-time', { index: idx, starttime: this.myStartDate + ' ' + this.myStartTime + this.myStartTimeHaom })
    },
    turnTime(row, idx) {
      var popNodes = document.querySelectorAll('.el-popover.el-popper')
      popNodes.forEach((item) => {
        item.style.display = 'none'
      })
      var starttime = ''
      if (this.listCurr[idx - 1]) {
        starttime = this.listCurr[idx - 1].endtime
      } else {
        starttime = this.myStartDate + ' ' + this.myStartTime + this.myStartTimeHaom
      }
      this.$emit('turn-time', { index: idx, starttime: starttime })
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
    handleCurrentChange(val, oldVal) {
      this.currentRow = val
      // checkbox选中逻辑
      this.$refs.multipleTable.clearSelection()
      var startIdx = this.listCurr.indexOf(oldVal)
      var endIdx = this.listCurr.indexOf(val)
      if (startIdx !== -1 && this.pin) {
        // shift多选
        const sum = Math.abs(startIdx - endIdx) + 1
        const min = Math.min(startIdx, endIdx)
        let i = 0
        while (i < sum) {
          const index = min + i
          if (this.listCurr[index]) {
            this.$refs.multipleTable.toggleRowSelection(this.listCurr[index], true)
          }
          i++
        }
      } else {
        if (val) {
          this.$refs.multipleTable.toggleRowSelection(val)
        }
      }
    },
    selectable(row) {
      if (row && (row.isTheLastEpg || row.isTheCurrEpg)) {
        return false
      } else {
        return true
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // delete row.isTheLastEpgInsert
      // if (!row.fromEpgsBefore && new Date(this.listCurr[rowIndex].starttime).getTime() < new Date().getTime() && new Date(this.listCurr[rowIndex].endtime).getTime() > new Date().getTime()) {
      //   // 判断临时节目单中某条是否为当前正在播出的节目
      //   this.listCurr[rowIndex].isTheLastEpgInsert = true
      //   this.$emit('hide-the-last-epg-online')
      // }

      if (this.listCurr[rowIndex - 1]) {
        var startT = new Date(this.listCurr[rowIndex].starttime).getTime()
        var prevStartT = new Date(this.listCurr[rowIndex - 1].starttime).getTime()
        var prevEndT = new Date(this.listCurr[rowIndex - 1].endtime).getTime()
        if (startT < prevEndT && startT > prevStartT) {
          // 当前节目占用上一节目部分时间
          // 修改上一条节目的结束时间
          this.listCurr[rowIndex - 1].endtime = this.listCurr[rowIndex].starttime
        } else if (startT <= prevStartT) {
          // 当前节目占用上一节目全部时间
          // 删除上一条节目
          if (this.hasPrepend) {
            if (rowIndex > 1) {
              this.$emit('cut-pro', { item: this.listCurr[rowIndex - 1] })
            }
          } else {
            this.$emit('cut-pro', { item: this.listCurr[rowIndex - 1] })
          }
        }
      }

      if (row && (row.isTheLastEpg || row.isTheCurrEpg)) {
        // 在播单最后一条节目
        return 'bg-gray'
      }
      if (this.listCurr[rowIndex + 1]) {
        var endT = new Date(this.listCurr[rowIndex].endtime).getTime()
        var nextStartT = new Date(this.listCurr[rowIndex + 1].starttime).getTime()
        if (nextStartT > endT) {
          // 下一条节目和上一条节目之间有间断
          return 'bg-red'
        }
      }
      if (row && row.flag) {
        // 定时播节目
        return 'bg-blue'
      }
      // if (new Date(this.listCurr[rowIndex].endtime).getTime() < new Date().getTime()) {
      //   // 节目播出时间已经过去
      //   // 删除这一条节目
      //   console.log(rowIndex + '/cut-pro')
      //   this.$emit('cut-pro', { item: this.listCurr[rowIndex] })
      // }
    }
  }
}
</script>
