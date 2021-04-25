<template>
  <div class="container">
    <div class="channelTabs">
      <el-radio-group v-model="currChannel">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label" />
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>在编节目单 <span v-if="tempEpg !== null" style="color: #F56C6C;">（{{ tempEpg.statusstr }}）</span></span>
            <template v-if="tempEpg === null">
              <el-button type="text" icon="el-icon-s-claim" class="cardBtn" @click="createHandler">保存编单</el-button>
            </template>
            <template v-else>
              <el-button v-if="tempEpg.status === 0 || tempEpg.status === 3" type="text" icon="el-icon-upload2" class="cardBtn" @click="pendHandler">提交审核</el-button>
              <el-button v-if="tempEpg.status === 0 || tempEpg.status === 3" type="text" icon="el-icon-s-claim" class="cardBtn" @click="updateHandler">确认修改</el-button>
            </template>
          </div>
          <Edit ref="editlist" :list-curr="listCurr" @remove-pro="removePro" @copy-pro="copyPro" @update-start-time="updateStartTime" />
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
import { getLastEpg } from '@/api/epg'
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
  beforeRouteLeave(to, from, next) {
    if (this.listCurr.length) {
      this.$confirm('您还没有提交编单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      firstStartTime: parseTime((new Date().getTime()) - 24 * 60 * 60 * 1000),
      updateStartIdx: 0,
      lastEpg: null
    }
  },
  watch: {
    listCurr: {
      handler: function(newVal) {
        if (!newVal.length) return []
        newVal.map((item, idx, arr) => {
          if (idx === this.updateStartIdx) {
            item.starttime = this.firstStartTime
          } else if (idx > this.updateStartIdx) {
            item.starttime = arr[idx - 1].endtime
          }
          item.endtime = parseTime(new Date(item.starttime).getTime() + parseInt(item.duration))
        })
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
    currChannel: function(newVal) {
      var filteredOpt = this.options.filter((item, idx, arr) => {
        return item.label === newVal
      })
      this.currChannelId = filteredOpt[0] ? filteredOpt[0].value : 0

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
        this.currChannel = this.allChannels[0].name || ''
        this.currChannelId = this.allChannels[0].id || 0
      })
    },
    // 向节目单插入记录
    appendPro(params) {
      var pros = deepClone2(params.items)
      var insertIdx = this.listCurr.indexOf(this.$refs.editlist.currentRow)
      if (insertIdx !== -1) {
        // 插入到指定节目之后
        pros.map((item, idx, arr) => {
          this.listCurr.splice(insertIdx + 1 + idx, 0, item)
        })
      } else {
        // 插入到尾部
        this.listCurr = this.listCurr.concat(pros)
      }

      // 表格单选行取消选择
      this.$refs.editlist.$refs.multipleTable.setCurrentRow()
    },
    // 删除节目单中的记录
    removePro(params) {
      var pros = params.items
      var removeIdx = pros.map((item, idx, arr) => {
        return this.listCurr.indexOf(item)
      })

      this.listCurr = this.listCurr.filter((item, idx, arr) => {
        return removeIdx.indexOf(idx) === -1
      })
    },
    // 复制节目单记录
    copyPro(params) {
      var pros = deepClone2(params.items)
      this.listCurr = this.listCurr.concat(pros)
    },
    updateStartTime({ index, starttime }) {
      this.updateStartIdx = index
      this.firstStartTime = starttime
      this.listCurr[index].starttime = starttime
    },
    createHandler() {
      var epg = this.listCurr.map((item, idx, arr) => {
        return {
          name: item.name,
          starttime: item.starttime,
          endtime: item.endtime,
          duration: parseInt(item.duration)
        }
      })
      console.log(epg)
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
        epg: JSON.stringify(epg)
      }
      createTempEpg(params).then(data => {
        console.log(data)
      })
    },
    pendHandler() {
      this.$confirm(`确定要将在编节目单提交审核吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pend({ id: this.tempEpg.id }).then(data => {
          this.$router.push({ path: '/examine/index' })
        })
      }).catch(() => {
        console.log('已取消')
      })
    },
    updateHandler() {
      this.$confirm(`确定要保存对在编节目单的修改吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var epg = this.listCurr.map((item, idx, arr) => {
          return {
            name: item.name,
            starttime: item.starttime,
            endtime: item.endtime,
            duration: parseInt(item.duration)
          }
        })
        console.log(epg)
        if (!epg.length) {
          this.$message({
            message: '编单不能为空！',
            type: 'warning'
          })
          return
        }
        var params = {
          id: this.tempEpg.id,
          epg: JSON.stringify(epg)
        }
        updateTempEpg(params).then(data => {
          console.log(data)
        })
      }).catch(() => {
        console.log('已取消')
      })
    },
    async getLastEpg() {
      await getLastEpg({ limit: 20, channelId: this.currChannelId }).then(data => {
        this.lastEpg = data.items ? data.items[0] : null
        if (this.lastEpg) {
          this.listCurr.push(this.lastEpg)
          this.firstStartTime = this.lastEpg.starttime || parseTime((new Date().getTime()) - 24 * 60 * 60 * 1000)
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
