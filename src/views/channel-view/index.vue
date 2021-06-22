<template>
  <div class="app-container">
    <div class="deviceTabs">
      <el-radio-group v-model="currDevice" @change="handleFilter">
        <el-radio-button v-for="item in optionsDevices" :key="item.value" :label="item.label" />
        <el-radio-button label="全部" />
      </el-radio-group>
    </div>

    <h4 class="time-head">{{ currtime }}</h4>
    <el-table :data="tableData" :row-class-name="tableRowClassName" fit highlight-current-row style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="videores" label="视频类型" width="60" align="center" />
      <el-table-column prop="name" label="频道名称" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toGetEpgs(scope.row.id)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
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
            {{ (new Date().getTime() - new Date(scope.row.CurEpg.starttime).getTime()) | formateSeconds }}
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
            {{ (new Date(scope.row.CurEpg.endtime).getTime() - new Date().getTime()) | formateSeconds }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="NextEpg.name" label="下一个待播节目" align="center" />
      <el-table-column prop="NextEpg.starttime" label="下一个节目播出时间" align="center">
        <template v-if="scope.row.NextEpg" slot-scope="scope">{{ scope.row.NextEpg.starttime.substring(0, scope.row.NextEpg.starttime.length - 4) }}</template>
      </el-table-column>
      <el-table-column prop="" label="下一个节目时长" align="center" width="100">
        <template v-if="scope.row.NextEpg" slot-scope="scope">{{ (new Date(scope.row.NextEpg.endtime).getTime() - new Date(scope.row.NextEpg.starttime).getTime()) | formateSeconds }}</template>
      </el-table-column>
      <el-table-column prop="EndTime" label="节目单剩余时间" class-name="endtime" align="center" width="100">
        <template slot-scope="scope">
          {{ (new Date(scope.row.EndTime).getTime() - new Date().getTime()) | formateSeconds }}
        </template>
      </el-table-column>
      <el-table-column prop="defaultts" label="垫播节目" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.defaultts" style="text-align: center;">
            {{ scope.row.defaultts }}
            <el-button type="primary" size="mini" @click="emerempty(scope.row.id)">播出垫片</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="record" label="应急切播节目" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.record" style="text-align: center;">
            {{ scope.row.record.showname }}
            <el-button type="warning" size="mini" style="margin-left: 10px;margin-bottom: 5px;" @click="toGetTs(scope.row.id)">选择节目</el-button>
            <el-button type="primary" size="mini" @click="emerreplace(scope.row.id)">节目替换</el-button>
          </div>
          <div v-else>
            <el-button type="warning" size="mini" style="margin-top: 5px;margin-left: 0;" @click="toGetTs(scope.row.id)">选择节目</el-button>
          </div>
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
      <el-table-column prop="emergency" label="应急播出状态" align="center" width="80">
        <template slot-scope="scope">
          <div :class="{ playstate: scope.row.emergency !== 0 }">{{ scope.row.emergency === 0 ? '正常' : scope.row.emergency === 1 ? '播出垫片' : '节目替换' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.emergency !== 1" type="text" size="mini" @click="emerempty(scope.row.id)">播出垫片</el-button>
          <el-button v-if="scope.row.emergency !== 2" type="text" size="mini" @click="emerreplace(scope.row.id)">节目替换</el-button> -->
          <el-button v-if="scope.row.emergency !== 0" type="text" size="mini" @click="emernone(scope.row.id)">非应急</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="素材库" :visible.sync="tsVisible" width="50%" :before-close="handleCloseTs">
      <div>
        <el-select v-model="checkedTs" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in tsList"
            :key="item.id"
            :label="item.record.showname"
            :value="item.id"
          />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tsVisible = false; canInterval = true;">取 消</el-button>
        <el-button type="primary" :loading="tsLoading" @click="checkTs">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="节目单" :visible.sync="epgVisible" width="50%" :before-close="handleCloseEpg">
      <div>
        <el-table ref="tableList" v-loading="epglistLoading" :data="epgList" size="mini" fit style="width: 100%;" height="600">
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
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="epgVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { getChannelsPreview, emerempty, emerreplace, emernone } from '@/api/channel'
import { getAllDevices } from '@/api/device'
import { epgExport } from '@/api/epg'
import { fetchList, emergency } from '@/api/prochns'
import { fetchListByDate } from '@/api/epg'

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
    },
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
      filterForm: {
        deviceId: ''
      },
      currDevice: '全部',
      allDevices: [],
      optionsDevices: [],
      tsVisible: false,
      checkedTs: null,
      tsList: [],
      tsLoading: false,
      epglistLoading: false,
      epgList: [],
      epgVisible: false
    }
  },
  watch: {
    allDevices: function(newVal) {
      if (newVal.length) {
        this.optionsDevices = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    optionsDevices: function(newVal) {
      if (newVal.length) {
        this.currDevice = newVal[0].label
        this.filterForm.device = newVal[0].label
        this.filterForm.deviceId = newVal[0].value
        this.handleFilter()
      }
    },
    currDevice: function(newVal) {
      if (newVal !== '全部') {
        this.filterForm.deviceId = this.optionsDevices.filter((item, idx, arr) => {
          return item.label === newVal
        })[0].value
      } else {
        this.filterForm.deviceId = ''
      }
    }
  },
  mounted() {
    // this.beginInterval()
    this.getAllDevices()
  },
  methods: {
    beginInterval() {
      var _this = this
      timer = window.setInterval(function() {
        _this.currtime = parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s}')
        if (_this.canInterval) {
          _this.getList()
        }
      }, 1000)
    },
    getList() {
      getChannelsPreview(this.listQuery).then((response) => {
        this.tableData = response.items
        this.total = response.total
      }).catch((error) => {
        console.log(error)
        window.clearInterval(timer)
      })
    },
    handleFilter() {
      window.clearInterval(timer)
      this.tableData = []
      this.total = 0
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.deviceId !== '') {
        this.listQuery.deviceId = this.filterForm.deviceId
      }
      this.beginInterval()
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
    },
    getAllDevices() {
      getAllDevices().then(data => {
        this.allDevices = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    // 修改应急状态为第一种————播出垫片
    emerempty(id) {
      emerempty({ id: id }).then(data => {
        if (data.emergency === 1) {
          this.$message({
            message: '执行成功！',
            type: 'success'
          })
          this.epgExport(id)
        }
      })
    },
    // 修改应急状态为第二种————节目替换
    emerreplace(id) {
      emerreplace({ id: id }).then(data => {
        if (data.emergency === 2) {
          this.$message({
            message: '执行成功！',
            type: 'success'
          })
          this.epgExport(id)
        }
      })
    },
    // 修改应急状态为非应急状态
    emernone(id) {
      emernone({ id: id }).then(data => {
        if (data.emergency === 0) {
          this.$message({
            message: '执行成功！',
            type: 'success'
          })
          this.epgExport(id)
        }
      })
    },
    epgExport(channelId) {
      epgExport({ channelId: channelId }).then((data) => {
        if (data.total === data.success) {
          this.$message({
            message: data.message || '节目单已导出！',
            type: 'success'
          })
        }
      })
    },
    toGetTs(id) {
      this.tsVisible = true
      this.canInterval = false
      this.getProChnList(id)
    },
    getProChnList(channelId) {
      fetchList({ page: 1, channelId: channelId }).then(data => {
        this.tsList = data.items || []
      }).catch(() => {
      })
    },
    handleCloseTs() {
      this.tsVisible = false
      this.canInterval = true
    },
    checkTs() {
      if (this.checkedTs) {
        this.tsLoading = true
        emergency({ id: this.checkedTs }).then(response => {
          if (response.emertag === 1) {
            this.$message({
              message: '执行成功！',
              type: 'success'
            })
          }
          this.tsLoading = false
          this.tsVisible = false
          this.canInterval = true
        }).catch(() => {
          this.tsLoading = false
        })
      }
    },
    toGetEpgs(id) {
      this.epgVisible = true
      var query = {
        channelId: id,
        orderby: 'id',
        starttime: parseTime(new Date().getTime()),
        op: 'egt'
      }
      this.epglistLoading = true
      fetchListByDate(query).then(data => {
        this.epgList = data.items || []

        this.epglistLoading = false
      }).catch(error => {
        this.epglistLoading = false
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    handleCloseEpg() {
      this.epgVisible = false
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
