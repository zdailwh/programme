<template>
  <div class="app-container">
    <h4 class="time-head">{{ currtime }}</h4>
    <el-table :data="tableData" :row-class-name="tableRowClassName" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="servicetype" label="特性" width="60px" align="center" />
      <el-table-column prop="name" label="频道名称" width="120px" align="center" />
      <el-table-column prop="CurEpg.Name" label="当前播出节目" align="center">
        <template slot-scope="scope"><div class="currEpg">{{ scope.row.CurEpg.Name }}</div></template>
      </el-table-column>
      <el-table-column prop="" label="节目已播时长" align="center">
        <template slot-scope="scope">
          <div v-if="new Date().getTime() > scope.row.CurEpg.EndTime * 1000">
            播放结束
          </div>
          <div v-else-if="new Date().getTime() < scope.row.CurEpg.StartTime * 1000">
            尚未开始
          </div>
          <div v-else>
            <el-progress :percentage="Math.round((new Date().getTime() - (scope.row.CurEpg.StartTime * 1000)) / ((scope.row.CurEpg.EndTime - scope.row.CurEpg.StartTime) * 1000) * 100)" />
            {{ (new Date().getTime() - (scope.row.CurEpg.StartTime * 1000)) | timeDiff }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="节目剩余时长" align="center">
        <template slot-scope="scope">
          <div v-if="new Date().getTime() > scope.row.CurEpg.EndTime * 1000">
            播放结束
          </div>
          <div v-else-if="new Date().getTime() < scope.row.CurEpg.StartTime * 1000">
            尚未开始
          </div>
          <div v-else>
            <el-progress :percentage="Math.round(((scope.row.CurEpg.EndTime * 1000) - new Date().getTime()) / ((scope.row.CurEpg.EndTime - scope.row.CurEpg.StartTime) * 1000) * 100)" />
            {{ ((scope.row.CurEpg.EndTime * 1000) - new Date().getTime()) | timeDiff }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="NextEpg.Name" label="下一个待播节目" align="center" />
      <el-table-column prop="NextEpg.StartTime" label="下一个节目播出时间" align="center">
        <template slot-scope="scope">{{ scope.row.NextEpg.StartTime | formatTime }}</template>
      </el-table-column>
      <el-table-column prop="" label="下一个节目时长" align="center">
        <template slot-scope="scope">{{ (scope.row.NextEpg.EndTime - scope.row.NextEpg.StartTime) * 1000 | timeDiff }}</template>
      </el-table-column>
      <el-table-column prop="EndTime" label="节目单剩余时间" class-name="endtime" align="center" width="120">
        <template slot-scope="scope">
          {{ (scope.row.EndTime * 1000 - new Date().getTime()) | timeDiff }}
          <br>
          <el-button plain size="mini">查看节目单</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="defaultts" label="垫播节目" align="center">
        <template slot-scope="scope">
          <p style="text-align: center;">
            {{ scope.row.defaultts }}<br>
            <el-button type="primary" size="mini" @click="playDefaultTs(scope.row)">应急垫片</el-button>
            <el-button type="primary" size="mini" style="margin-top: 5px;margin-left: 0;" @click="tsVisible = true; canInterval = false;">素材库</el-button>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="PlayState" label="播放状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.PlayState === 0 && scope.row.State === 'Play'" class="playstate">异常停止</div>
          <div v-else>{{ scope.row.PlayState === 1 ? '播出' : '停止' }}</div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="素材库" :visible.sync="tsVisible" width="30%" :before-close="handleCloseTs">
      <div>
        <el-radio v-for="item in tsList" :key="item.id" v-model="checkedTs" border :label="item.id">{{ item.name }}</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tsVisible = false; canInterval = true;">取 消</el-button>
        <el-button type="primary" @click="checkTs">指定播出</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { getAllChannels } from '@/api/channel'

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
      },
      tsVisible: false,
      checkedTs: '',
      tsList: [
        { id: 11, name: '垫片1' }, { id: 12, name: '垫片2' }, { id: 13, name: '垫片3' }
      ]
    }
  },
  mounted() {
    this.getList()
    // var _this = this
    // timer = window.setInterval(function() {
    //   _this.currtime = parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s}')
    //   if (_this.canInterval) {
    //     _this.getList()
    //   }
    // }, 1000)
  },
  methods: {
    getList() {
      getAllChannels(this.listQuery).then((response) => {
        this.$parent.maintag = response.main
        this.tableData = response.items
        this.total = response.total
      }).catch((error) => {
        console.log(error)
      })
    },
    tableRowClassName({ row, rowIndex }) {
      var endtime = row.EndTime * 1000 - new Date().getTime()
      if (endtime <= 0) {
        return 'danger-row'
      } else {
        if (endtime < 8 * 3600 * 1000) {
          return 'warning-row'
        } else {
          return ''
        }
      }
    },
    playDefaultTs() {
      this.canInterval = false
      this.$confirm('确定要播放此垫片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.canInterval = true
      }).catch(() => {
        this.canInterval = true
      })
    },
    handleCloseTs() {
      this.tsVisible = false
      this.canInterval = true
    },
    checkTs() {
      console.log(this.checkedTs)
      // if (this.checkedTs) {}
      this.tsVisible = false
      this.canInterval = true
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
<style scoped>
.el-table .warning-row .endtime {
  background: #E6A23C;
}

.el-table .danger-row .endtime {
  animation: danger .5s ease infinite alternate;
  -moz-animation: danger .5s ease infinite alternate; /* Firefox */
  -webkit-animation: danger .5s ease infinite alternate;  /* Safari 和 Chrome */
  -o-animation: danger .5s ease infinite alternate; /* Opera */
}

@keyframes warn
{
  from {background: #fff;}
  to {background: #E6A23C;}
}

@-moz-keyframes warn /* Firefox */
{
  from {background: #fff;}
  to {background: #E6A23C;}
}

@-webkit-keyframes warn /* Safari 和 Chrome */
{
  from {background: #fff;}
  to {background: #E6A23C;}
}

@-o-keyframes warn /* Opera */
{
  from {background: #fff;}
  to {background: #E6A23C;}
}

@keyframes danger
{
  from {background: #fff;}
  to {background: #F56C6C;}
}

@-moz-keyframes danger /* Firefox */
{
  from {background: #fff;}
  to {background: #F56C6C;}
}

@-webkit-keyframes danger /* Safari 和 Chrome */
{
  from {background: #fff;}
  to {background: #F56C6C;}
}

@-o-keyframes danger /* Opera */
{
  from {background: #fff;}
  to {background: #F56C6C;}
}

.playstate {
  font-weight: bold;
  animation: dangerState .5s ease infinite alternate;
  -moz-animation: dangerState .5s ease infinite alternate; /* Firefox */
  -webkit-animation: dangerState .5s ease infinite alternate;  /* Safari 和 Chrome */
  -o-animation: dangerState .5s ease infinite alternate; /* Opera */
}
@keyframes dangerState
{
  from {color: #fff;}
  to {color: #F56C6C;}
}

@-moz-keyframes dangerState /* Firefox */
{
  from {color: #fff;}
  to {color: #F56C6C;}
}

@-webkit-keyframes dangerState /* Safari 和 Chrome */
{
  from {color: #fff;}
  to {color: #F56C6C;}
}

@-o-keyframes dangerState /* Opera */
{
  from {color: #fff;}
  to {color: #F56C6C;}
}

.currEpg {
  /*background-color: #DCDFE6;*/
  font-weight: bold;
  color: #409EFF;
}
.time-head {
  text-align: center;
  font-size: 25px;
  margin: 15px 0;
}
</style>
