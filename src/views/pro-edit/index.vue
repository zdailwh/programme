<template>
  <div class="container">
    <div class="channelTabs routerTabs">
      <el-radio-group v-model="currChannel">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label">
          <router-link :to="{ name: 'ProEditMain', query: {currChannel: item.label, currChannelId: item.value}}" class="radioRouter">{{ item.label }}</router-link>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>在编节目单 <span v-if="tempEpg !== null" style="color: #F56C6C;">（{{ tempEpg.statusstr }}）</span></span>
            <template v-if="tempEpg === null">
              <el-button type="text" icon="el-icon-s-claim" class="cardBtn" @click="createHandler">保存编单</el-button>
              <el-button type="text" icon="el-icon-download" class="cardBtn" :disabled="!!listCurr.length" @click="getEpgsOfDay">读取在播单</el-button>
            </template>
            <template v-else>
              <el-button type="text" icon="el-icon-upload2" class="cardBtn" @click="pendHandler">提交审核</el-button>
              <el-button type="text" icon="el-icon-s-claim" class="cardBtn" @click="updateHandler">确认修改</el-button>
            </template>
          </div>
          <Edit ref="editlist" :list-curr="listCurrComp" @remove-pro="removePro" @copy-pro="copyPro" @cut-pro="cutPro" @fixed-time="fixedTime" @turn-time="turnTime" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>节目列表</span>
          </div>
          <Programs ref="programs" :channel="currChannel" :channel-id="currChannelId" @append-pro="appendPro" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchList, createTempEpg, pend, updateTempEpg } from '@/api/temp-epg'
import { getAllChannels } from '@/api/channel'
import { fetchListByDate, getLastEpg } from '@/api/epg'
import Programs from './Programs.vue'
import Edit from './Edit.vue'

// var tempEpgDemo = JSON.stringify([{
//   name: '节目名1',
//   starttime: '2021-04-22 13:45:06.345',
//   endtime: '2021-04-22 13:48:06.345',
//   duration: '180123'
// },
// {
//   name: '节目名2',
//   starttime: '2021-04-22 13:48:06.345',
//   endtime: '2021-04-22 13:53:06.345',
//   duration: '300456'
// }])

export default {
  components: { Programs, Edit },
  beforeRouteUpdate(to, from, next) {
    if ((this.tempEpg === null && this.listCurr.length) || (this.tempEpg !== null && this.listCurr.length && JSON.stringify(this.listCurr) !== this.tempEpg.epg)) {
      this.$confirm(`${this.currChannel}编单还没有保存`, '提示', {
        confirmButtonText: '保存离开',
        cancelButtonText: '留下',
        type: 'warning'
      }).then(async() => {
        // 保存
        if (this.tempEpg === null) {
          await this.createHandler(false)
        } else {
          await this.updateHandler(false)
        }

        this.currChannel = to.query.currChannel || this.allChannels[0].name || ''
        this.currChannelId = parseInt(to.query.currChannelId) || this.allChannels[0].id || 0
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      this.currChannel = to.query.currChannel || this.allChannels[0].name || ''
      this.currChannelId = parseInt(to.query.currChannelId) || this.allChannels[0].id || 0
      next()
    }
  },
  beforeRouteLeave(to, from, next) {
    if ((this.tempEpg === null && this.listCurr.length) || (this.tempEpg !== null && this.listCurr.length && JSON.stringify(this.listCurr) !== this.tempEpg.epg)) {
      this.$confirm(`${this.currChannel}编单还没有保存`, '提示', {
        confirmButtonText: '保存离开',
        cancelButtonText: '留下',
        type: 'warning'
      }).then(async() => {
        // 保存
        if (this.tempEpg === null) {
          await this.createHandler(false)
        } else {
          await this.updateHandler(false)
        }
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  },
  data() {
    return {
      tempEpg: null,
      currChannel: '',
      currChannelId: 0,
      options: [],
      allChannels: [],
      listCurr: [],
      firstStartTime: '',
      lastEpg: null,
      epgsBefore: null
    }
  },
  computed: {
    listCurrComp: function() {
      if (this.epgsBefore !== null) {
        return this.epgsBefore.concat(this.listCurr)
      } else if (this.lastEpg !== null) {
        return [this.lastEpg].concat(this.listCurr)
      } else {
        return this.listCurr
      }
    }
  },
  watch: {
    listCurr: {
      handler: function(newVal) {
        if (!newVal.length) return []
      },
      deep: true
    },
    allChannels: function(newVal) {
      if (newVal.length) {
        this.options = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    currChannel: async function(newVal, oldVal) {
      this.listCurr = []
      // 获取指定频道下的最后一条在播节目
      this.getLastEpg().then(() => {
        // 获取指定频道下的临时节目单
        this.getTempEpg()
        // 获取指定频道下的节目列表
        this.$refs.programs.handleFilter()
      })
    }
  },
  mounted() {
    this.getAllChannels()
  },
  methods: {
    // 获取临时节目单
    getTempEpg() {
      this.listLoading = true
      fetchList({ page: 1, limit: 20, channelId: this.currChannelId, status: [0, 3] }).then(data => {
        this.tempEpg = data.items ? data.items[0] : null
        if (this.tempEpg !== null) {
          this.listCurr = this.listCurr.concat(JSON.parse(this.tempEpg.epg))
          // this.listCurr = JSON.parse(tempEpgDemo)
        }

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items
        this.currChannel = this.$route.query.currChannel || this.allChannels[0].name || ''
        this.currChannelId = parseInt(this.$route.query.currChannelId) || this.allChannels[0].id || 0
      })
    },
    // 向节目单插入记录(可以不用pros.map 因为只有1条)
    appendPro(params) {
      var item = deepClone2(params.item)
      var insertIdx = this.listCurr.indexOf(this.$refs.editlist.currentRow)
      if (insertIdx !== -1) {
        // 插入到指定节目之后
        item.starttime = this.$refs.editlist.currentRow.endtime
        item.endtime = parseTime(new Date(item.starttime).getTime() + parseInt(item.duration))
        this.listCurr.splice(insertIdx + 1, 0, item)

        this.updatetimeAfterHandle(insertIdx + 1, item.duration)
      } else {
        // 插入到尾部
        insertIdx = this.listCurr.length
        item.starttime = insertIdx === 0 ? this.firstStartTime : this.listCurr[insertIdx - 1].endtime
        item.endtime = parseTime(new Date(item.starttime).getTime() + parseInt(item.duration))
        this.listCurr.splice(insertIdx, 0, item)
      }
    },
    updatetimeAfterHandle(startIdx, offset) {
      this.listCurr.map((item, idx, arr) => {
        if (idx > startIdx) {
          item.starttime = parseTime(new Date(item.starttime).getTime() + parseInt(offset))
          item.endtime = parseTime(new Date(item.endtime).getTime() + parseInt(offset))
        }
      })
    },
    // 正常删除节目单中的记录
    removePro(params) {
      var pros = params.items
      pros.map((item) => {
        var delIdx = this.listCurr.indexOf(item)
        this.updatetimeAfterHandle(delIdx, -(new Date(item.endtime).getTime() - new Date(item.starttime).getTime()))
        this.listCurr.splice(delIdx, 1)
      })
    },
    // 节目被砍 删除节目单中的记录
    cutPro(params) {
      var item = params.item
      var delIdx = this.listCurr.indexOf(item)
      this.listCurr.splice(delIdx, 1)
    },
    // 复制节目单记录
    copyPro(params) {
      var pros = deepClone2(params.items)
      pros.map((item) => {
        var insertIdx = this.listCurr.length
        // 被复制节目的播出时长
        var playduration = new Date(item.endtime).getTime() - new Date(item.starttime).getTime()
        item.starttime = insertIdx === 0 ? this.firstStartTime : this.listCurr[insertIdx - 1].endtime
        item.endtime = parseTime(new Date(item.starttime).getTime() + parseInt(playduration))
        this.listCurr.splice(insertIdx, 0, item)
      })
    },
    // 定时播
    fixedTime({ index, starttime }) {
      if (this.lastEpg !== null) {
        index = index - 1
      }
      this.updatetimeAfterHandle(index - 1, new Date(starttime).getTime() - new Date(this.listCurr[index].starttime).getTime())

      this.listCurr[index].flag = 1
    },
    // 顺时播
    turnTime({ index, starttime }) {
      if (this.lastEpg !== null) {
        index = index - 1
      }
      this.updatetimeAfterHandle(index - 1, new Date(starttime).getTime() - new Date(this.listCurr[index].starttime).getTime())

      this.listCurr[index].flag = 0
    },
    async createHandler(ifRefresh = true) {
      var epg = this.listCurr.map((item, idx, arr) => {
        return {
          name: item.name,
          filename: item.filename,
          starttime: item.starttime,
          endtime: item.endtime,
          duration: new Date(item.endtime).getTime() - new Date(item.starttime).getTime(),
          flag: item.flag
        }
      })
      if (!this.currChannelId) {
        this.$message({
          message: '请选择频道！',
          type: 'warning'
        })
        return
      }
      if (!epg.length) {
        this.$message({
          message: '编单不能为空！',
          type: 'warning'
        })
        return
      }
      var params = {
        channelId: this.currChannelId,
        starttime: epg[0] && epg[0].starttime,
        epg: JSON.stringify(epg)
      }
      await createTempEpg(params).then(data => {
        if (ifRefresh) {
          this.listCurr = []
          this.getTempEpg()
        }
      })
    },
    pendHandler() {
      this.$confirm(`确定要将在编节目单提交审核吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pend({ id: this.tempEpg.id }).then(data => {
          this.listCurr = []
          this.$router.push({ name: 'ExamineMain', query: { currChannel: this.currChannel, currChannelId: this.currChannelId }})
        })
      }).catch(() => {
        console.log('已取消')
      })
    },
    async updateHandler(ifRefresh = true) {
      var epg = this.listCurr.map((item, idx, arr) => {
        return {
          name: item.name,
          filename: item.filename,
          starttime: item.starttime,
          endtime: item.endtime,
          duration: new Date(item.endtime).getTime() - new Date(item.starttime).getTime(),
          flag: item.flag
        }
      })
      if (!epg.length) {
        this.$message({
          message: '编单不能为空！',
          type: 'warning'
        })
        return
      }
      var params = {
        id: this.tempEpg.id,
        starttime: epg[0] && epg[0].starttime,
        epg: JSON.stringify(epg)
      }
      await updateTempEpg(params).then(data => {
        if (ifRefresh) {
          this.listCurr = []
          this.getTempEpg()
        }
        this.$message({
          message: '编单修改成功！',
          type: 'success'
        })
      })
    },
    // 获取频道播出单最后一条
    async getLastEpg() {
      await getLastEpg({ limit: 20, channelId: this.currChannelId }).then(data => {
        this.lastEpg = data.items ? data.items[0] : null
        if (this.lastEpg) {
          this.lastEpg.isTheLastEpg = true
          this.firstStartTime = this.lastEpg.endtime
        } else {
          this.firstStartTime = parseTime(new Date().getTime())
        }
      })
    },
    // 获取频道在播单(当前时间之后的)
    getEpgsOfDay() {
      fetchListByDate({ channelId: this.currChannelId, starttime: parseTime(new Date().getTime()) }).then(data => {
        this.epgsBefore = data.items ? data.items : null
        if (this.epgsBefore) {
          this.firstStartTime = this.epgsBefore[this.epgsBefore.length - 1].endtime
        } else {
          this.firstStartTime = parseTime(new Date().getTime())
        }
      })
    }
  }
}
function deepClone2(obj) {
  var _obj = JSON.stringify(obj)
  var objClone = JSON.parse(_obj)
  return objClone
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

  return `${formatObj.y}-${formatObj.m.toString().padStart(2, '0')}-${formatObj.d.toString().padStart(2, '0')} ${formatObj.h.toString().padStart(2, '0')}:${formatObj.i.toString().padStart(2, '0')}:${formatObj.s.toString().padStart(2, '0')}.${formatObj.ms.toString().padStart(3, '0')}`
}
</script>
<style scoped>
.container {
  padding: 20px;
}
.channelTabs {
  margin-bottom: 10px;
}
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.cardBtn {
  margin: 0 10px;
  padding: 2px 0;
  float: right;
}
</style>
