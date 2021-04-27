<template>
  <div class="programListWrap">
    <el-table :data="listCurr" size="mini" fit style="width: 100%;" height="600" :row-class-name="tableRowClassName">
      <!-- <el-table-column type="index" width="50" /> -->
      <el-table-column label="开始时间" align="center" class-name="start-time">
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
      <el-table-column label="文件名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center">
        <template slot-scope="{row}">
          <span>{{ row.duration | formateSeconds }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
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
    listCurr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row && row.isTheLastEpg) {
        return 'bg-gray'
      }
      if (rowIndex) {
        var startT = new Date(this.listCurr[rowIndex].starttime).getTime()
        var prevEndT = new Date(this.listCurr[rowIndex - 1].endtime).getTime()
        if (startT > prevEndT) {
          return 'bg-orange'
        }
      }
    }
  }
}
</script>
