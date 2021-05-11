<template>
  <div class="app-container">
    <h4 class="time-head">{{ currtime }}</h4>
    <el-table :data="tableData" :row-class-name="tableRowClassName" fit highlight-current-row style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="videores" label="视频类型" width="60" align="center" />
      <el-table-column prop="name" label="频道名称" width="120" align="center" />
      <el-table-column prop="CurEpg.name" label="当前播出节目" align="center">
        <template v-if="scope.row.CurEpg" slot-scope="scope"><div class="currEpg">{{ scope.row.CurEpg.name }}</div></template>
      </el-table-column>
      <el-table-column prop="" label="节目已播时长" align="center">
        <template v-if="scope.row.CurEpg" slot-scope="scope">
          <div v-if="new Date().getTime() > new Date(scope.row.CurEpg.endtime).getTime()">
            播放结束
          </div>
          <div v-else-if="new Date().getTime() < new Date(scope.row.CurEpg.starttime).getTime()">
            尚未开始
          </div>
          <div v-else>
            <el-progress :percentage="Math.round((new Date().getTime() - new Date(scope.row.CurEpg.starttime).getTime()) / (new Date(scope.row.CurEpg.endtime).getTime() - new Date(scope.row.CurEpg.starttime).getTime()) * 100)" />
            {{ (new Date().getTime() - new Date(scope.row.CurEpg.starttime).getTime()) | timeDiff }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="节目剩余时长" align="center">
        <template v-if="scope.row.CurEpg" slot-scope="scope">
          <div v-if="new Date().getTime() > new Date(scope.row.CurEpg.endtime).getTime()">
            播放结束
          </div>
          <div v-else-if="new Date().getTime() < new Date(scope.row.CurEpg.starttime).getTime()">
            尚未开始
          </div>
          <div v-else>
            <el-progress :percentage="Math.round((new Date(scope.row.CurEpg.endtime).getTime() - new Date().getTime()) / (new Date(scope.row.CurEpg.endtime).getTime() - new Date(scope.row.CurEpg.starttime).getTime()) * 100)" />
            {{ (new Date(scope.row.CurEpg.endtime).getTime() - new Date().getTime()) | timeDiff }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="NextEpg.name" label="下一个待播节目" align="center" />
      <el-table-column prop="NextEpg.starttime" label="下一个节目播出时间" align="center">
        <template v-if="scope.row.NextEpg" slot-scope="scope">{{ scope.row.NextEpg.starttime.substring(0, scope.row.NextEpg.starttime.length - 4) }}</template>
      </el-table-column>
      <el-table-column prop="" label="下一个节目时长" align="center" width="100">
        <template v-if="scope.row.NextEpg" slot-scope="scope">{{ (new Date(scope.row.NextEpg.endtime).getTime() - new Date(scope.row.NextEpg.starttime).getTime()) | timeDiff }}</template>
      </el-table-column>
      <el-table-column prop="EndTime" label="节目单剩余时间" class-name="endtime" align="center" width="100">
        <template slot-scope="scope">
          {{ (new Date(scope.row.EndTime).getTime() - new Date().getTime()) | timeDiff }}
        </template>
      </el-table-column>
      <el-table-column prop="defaultts" label="垫播节目" align="center">
        <template slot-scope="scope">
          {{ scope.row.defaultts }}
        </template>
      </el-table-column>
      <el-table-column prop="running" label="运行状态" align="center" width="80">
        <template slot-scope="scope">
          <!-- 频道手动停止 -->
          <div v-if="scope.row.action === 0"><el-tag type="success">正常</el-tag></div>
          <div v-else>
            <el-tag v-if="scope.row.running === 1" type="danger">异常</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { getChannelsPreview } from '@/api/channel'

var timer = null
export default {
  beforeRouteLeave(to, from, next) {
    window.clearInterval(timer)
    next()
  },
  components: { Pagination },
  filters: {
    timeDiff(diff) {
      if (!diff) return ''
      return formatTimeDiff(diff)
    },
    formatTime(time) {
      return parseTime(time, '{h}:{i}:{s}')
    }
  },
  data() {
    return {
      canInterval: true,
      currtime: parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s}'),
      tableData: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    var _this = this
    timer = window.setInterval(function() {
      _this.currtime = parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s}')
      if (_this.canInterval) {
        _this.getList()
      }
    }, 1000)
  },
  methods: {
    getList() {
      getChannelsPreview(this.listQuery).then((response) => {
        this.tableData = response.items
        this.total = response.total
      }).catch((error) => {
        console.log(error)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      var endtime = new Date(row.EndTime).getTime() - new Date().getTime()
      if (row.action === 0) {
        return 'stop-row'
      }
      if (endtime <= 0) {
        return 'danger-row'
      } else {
        if (endtime < 8 * 3600 * 1000) {
          return 'warning-row'
        } else {
          return ''
        }
      }
    }
  }
}
function formatTimeDiff(diff) {
  diff = diff / 1000
  if (diff > 0) {
    var SysSecond = diff
    var second = Math.floor(SysSecond % 60) // 计算秒
    var minite = Math.floor((SysSecond / 60) % 60) // 计算分
    var hour = Math.floor((SysSecond / 3600) % 24) // 计算小时
    var day = Math.floor((SysSecond / 3600) / 24) // 计算天
    var str = ''
    if (day) {
      str = str + day + '天'
    }
    if (hour) {
      str = str + hour + '小时'
    }
    if (minite) {
      str = str + minite + '分'
    }
    if (second) {
      str = str + second + '秒'
    }
    return str
  } else {
    return 0
  }
}
</script>
