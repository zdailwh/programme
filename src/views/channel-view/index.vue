<template>
  <div class="app-container">
    <div class="deviceTabs">
      <el-radio-group v-model="currDevice" @change="handleFilter">
        <el-radio-button v-for="item in optionsDevices" :key="item.value" :label="item.label" />
        <el-radio-button label="全部" />
      </el-radio-group>
    </div>

    <div class="headerWrap">
      <p v-if="currDeviceObj.id" class="leftCont">
        <el-tag effect="plain">设备空间：{{ (currDeviceObj.spaceavail / 1024).toFixed(3) }} GB 可用 ， 共 {{ (currDeviceObj.spacetotal / 1024).toFixed(3) }} GB</el-tag>
      </p>
      <h4 class="time-head">{{ currtime }}</h4>
      <p v-if="currDeviceObj.id" class="rightCont">
        <el-tag v-if="heartbeatSpace > 60" effect="dark" type="danger">设备通讯异常</el-tag>
        <el-tag v-else effect="dark" type="success">设备通讯正常</el-tag>
      </p>
    </div>
    <el-table :data="tableData" :row-class-name="tableRowClassName" fit highlight-current-row size="small" style="width: 100%">
      <el-table-column prop="no" label="频道编号" width="60" align="center" />
      <el-table-column prop="videores" label="视频类型" width="60" align="center" />
      <el-table-column prop="name" label="频道名称" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toGetEpgs(scope.row.id)">{{ scope.row.showname }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="CurEpg.name" label="当前播出节目" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.emergency !== 0">
            <div v-if="scope.row.emergency === 1 && scope.row.defaultrecord" class="playstate">{{ scope.row.defaultrecord.showname }}</div>
            <div v-if="scope.row.emergency === 2 && scope.row.record" class="playstate">{{ scope.row.record.showname }}</div>
          </template>
          <template v-if="scope.row.emergency === 0 && scope.row.CurEpg">
            <div class="currEpg">{{ scope.row.CurEpg.name }}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="" label="节目已播时长" align="center">
        <template v-if="scope.row.emergency === 0 && scope.row.CurEpg" slot-scope="scope">
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
        <template v-if="scope.row.emergency === 0 && scope.row.CurEpg" slot-scope="scope">
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
          <div v-if="scope.row.EndTime">{{ (new Date(scope.row.EndTime).getTime() - new Date().getTime()) | timeDiff }}</div>
          <div v-else>0</div>
        </template>
      </el-table-column>
      <el-table-column prop="defaultrecord" label="垫播节目" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.defaultrecord" style="text-align: center;">
            {{ scope.row.defaultrecord.showname }}
            <el-button v-show="!isVisitor" type="warning" size="mini" style="margin-left: 10px;margin-bottom: 5px;" @click="toGetTs(scope.row.id, 1)">选择垫片</el-button>
            <el-button v-show="!isVisitor" type="primary" size="mini" @click="emerempty(scope.row.id)">播出垫片</el-button>
          </div>
          <div v-else>
            <el-button v-show="!isVisitor" type="warning" size="mini" style="margin-top: 5px;margin-left: 0;" @click="toGetTs(scope.row.id, 1)">选择垫片</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="record" label="应急切播节目" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.record" style="text-align: center;">
            {{ scope.row.record.showname }}
            <el-button v-show="!isVisitor" type="warning" size="mini" style="margin-left: 10px;margin-bottom: 5px;" @click="toGetTs(scope.row.id, 2)">选择切播节目</el-button>
            <el-button v-show="!isVisitor" type="primary" size="mini" @click="emerreplace(scope.row.id)">节目替换</el-button>
          </div>
          <div v-else>
            <el-button v-show="!isVisitor" type="warning" size="mini" style="margin-top: 5px;margin-left: 0;" @click="toGetTs(scope.row.id, 2)">选择切播节目</el-button>
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
      <el-table-column v-if="!isVisitor" label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.emergency !== 1" type="text" size="mini" @click="emerempty(scope.row.id)">播出垫片</el-button>
          <el-button v-if="scope.row.emergency !== 2" type="text" size="mini" @click="emerreplace(scope.row.id)">节目替换</el-button> -->
          <el-button v-if="scope.row.emergency !== 0" type="text" size="mini" @click="emernone(scope.row.id)">非应急</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="设置应急垫片" :visible.sync="tsVisible1" width="70%" :before-close="handleCloseTs">
      <div>
        <p>
          <el-input v-model="tsName" placeholder="节目名称" style="width:250px;margin-right: 10px;" />
          <el-button type="primary" icon="el-icon-search" @click="getProChnList">搜索</el-button>
        </p>
        <el-radio-group v-model="checkedTs">
          <el-row>
            <el-col v-for="item in tsList" :key="item.id" :span="12">
              <el-radio :label="item" :disabled="item.status !== 2" border style="margin-bottom: 10px;">{{ item.record.showname }}</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
        <el-pagination
          :current-page="currentPageTslist"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSizeTslist"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tsListTotal"
          @size-change="handleTslistSizeChange"
          @current-change="handleTslistCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tsVisible1 = false; canInterval = true;">取 消</el-button>
        <el-button type="primary" :loading="tsLoading" @click="checkTs(1)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置应急切播节目" :visible.sync="tsVisible2" width="70%" :before-close="handleCloseTs">
      <div>
        <p>
          <el-input v-model="tsName" placeholder="节目名称" style="width:250px;margin-right: 10px;" />
          <el-button type="primary" icon="el-icon-search" @click="getProChnList">搜索</el-button>
        </p>
        <el-radio-group v-model="checkedTs">
          <el-row>
            <el-col v-for="item in tsList" :key="item.id" :span="12">
              <el-radio :label="item" :disabled="item.status !== 2" border style="margin-bottom: 10px;">{{ item.record.showname }}</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
        <el-pagination
          :current-page="currentPageTslist"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSizeTslist"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tsListTotal"
          @size-change="handleTslistSizeChange"
          @current-change="handleTslistCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tsVisible2 = false; canInterval = true;">取 消</el-button>
        <el-button type="primary" :loading="tsLoading" @click="checkTs(2)">确 定</el-button>
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
import Cookies from 'js-cookie'
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
      isVisitor: (Cookies.get('Programme-isVisitor') && JSON.parse(Cookies.get('Programme-isVisitor'))) || false,
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
      currDeviceObj: {},
      allDevices: [],
      optionsDevices: [],
      tsVisible1: false,
      tsVisible2: false,
      checkedTs: null,
      tsList: [],
      tsName: '',
      getTsCurrChannel: null,
      currentPageTslist: 1,
      pageSizeTslist: 20,
      tsListTotal: 0,
      tsLoading: false,
      epglistLoading: false,
      epgList: [],
      epgVisible: false
    }
  },
  computed: {
    heartbeatSpace() {
      if (this.currDeviceObj.id) {
        return this.currDeviceObj.timestamp - this.currDeviceObj.heartbeat
      } else {
        return ''
      }
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
        this.tableData = response.items || []
        this.currDeviceObj = response.device || {}
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
      var endtime = row.EndTime ? (new Date(row.EndTime).getTime() - new Date().getTime()) : 0
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
      this.$confirm('确定要播出垫片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        emerempty({ id: id }).then(data => {
          if (data.emergency === 1) {
            this.$message({
              message: '执行成功！',
              type: 'success'
            })
            this.epgExport(id)
          }
        })
      })
    },
    // 修改应急状态为第二种————节目替换
    emerreplace(id) {
      this.$confirm('确定要切播节目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        emerreplace({ id: id }).then(data => {
          if (data.emergency === 2) {
            this.$message({
              message: '执行成功！',
              type: 'success'
            })
            this.epgExport(id)
          }
        })
      })
    },
    // 修改应急状态为非应急状态
    emernone(id) {
      this.$confirm('确定要恢复非应急状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        emernone({ id: id }).then(data => {
          if (data.emergency === 0) {
            this.$message({
              message: '执行成功！',
              type: 'success'
            })
            this.epgExport(id)
          }
        })
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
    toGetTs(id, tag) {
      this['tsVisible' + tag] = true
      this.canInterval = false
      this.checkedTs = null
      this.getTsCurrChannel = id
      this.tsName = ''
      this.currentPageTslist = 1
      this.pageSizeTslist = 20
      this.getProChnList()
    },
    handleTslistSizeChange(val) {
      this.pageSizeTslist = val
      this.getProChnList()
    },
    handleTslistCurrentChange(val) {
      this.currentPageTslist = val
      this.getProChnList()
    },
    getProChnList() {
      var param = {
        page: this.currentPageTslist,
        limit: this.pageSizeTslist,
        channelId: this.getTsCurrChannel
      }
      if (this.tsName !== '') {
        param.name = this.tsName
      }
      fetchList(param).then(data => {
        this.tsList = data.items || []
        this.tsListTotal = data.total
      }).catch(() => {
      })
    },
    handleCloseTs(tag) {
      this['tsVisible' + tag] = false
      this.canInterval = true
    },
    checkTs(tag) {
      if (this.checkedTs !== null) {
        if (tag === 1) {
          if (this.checkedTs.emertag === 1 || this.checkedTs.emertag === 3) {
            this.$message({
              message: '该节目已经是该频道的垫片！',
              type: 'error'
            })
            return false
          }
        }
        if (tag === 2) {
          if (this.checkedTs.emertag === 2 || this.checkedTs.emertag === 3) {
            this.$message({
              message: '该节目已经是该频道的应急切播节目！',
              type: 'error'
            })
            return false
          }
        }
        this.tsLoading = true
        emergency({ id: this.checkedTs.id, tag: tag }).then(response => {
          if (response.emertag === tag || response.emertag === 3) {
            this.$message({
              message: '执行成功！',
              type: 'success'
            })
          }
          this.tsLoading = false
          this['tsVisible' + tag] = false
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
