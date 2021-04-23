<template>
  <div class="container">
    <div class="channelTabs">
      <el-radio-group v-model="currChannel">
        <!-- <el-radio-button v-for="item in options" :key="item.value" :label="item.label" :disabled="tempEpg !== null && item.label !== currChannel" /> -->
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
              <el-button v-if="tempEpg.status === 0 || tempEpg.status === 3" type="text" icon="el-icon-s-claim" class="cardBtn" @click="createHandler">确认修改</el-button>
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
          <Programs ref="programs" @append-pro="appendPro" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchList, createTempEpg, pend } from '@/api/temp-epg'
import { getAllChannels } from '@/api/channel'
import Programs from './Programs.vue'
import Edit from './Edit.vue'
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
      currChannelId: '',
      options: [],
      allChannels: [],
      listCurr: [],
      firstStartTime: (new Date().getTime()) - 24 * 60 * 60 * 1000,
      updateStartIdx: 0
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
          item.endtime = item.starttime + item.duration * 1000
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
      this.currChannelId = filteredOpt[0] ? filteredOpt[0].value : ''
      // 获取指定频道下的节目列表
      this.$refs.programs.handleFilter(this.currChannel, this.currChannelId)
    }
  },
  mounted() {
    this.getAllChannels()
    this.getTempEpg()
  },
  methods: {
    // 获取临时节目单
    getTempEpg() {
      this.listLoading = true
      fetchList({ page: 1, limit: 20 }).then(data => {
        this.tempEpg = data.items ? data.items[0] : null
        console.log('已保存的编单记录')
        console.log(this.tempEpg)
        if (this.tempEpg !== null) {
          this.currChannel = this.tempEpg.name
          this.listCurr = JSON.parse(this.tempEpg.epg)
        }

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items
      })
    },
    // 向节目单插入记录
    appendPro(params) {
      var pros = deepClone2(params.items)
      var insertIdx = this.listCurr.indexOf(this.$refs.editlist.currentRow)
      if (insertIdx !== -1) {
        // 插入到指定节目之后
        pros.map((item, idx, arr) => {
          this.listCurr.splice(insertIdx + 1, 0, item)
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
      this.starttime = new Date(starttime).getTime()
      this.listCurr[index].starttime = new Date(starttime).getTime()
    },
    createHandler() {
      var epg = this.listCurr.map((item, idx, arr) => {
        return {
          name: item.showname,
          starttime: item.starttime,
          endtime: item.endtime,
          duration: item.duration
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
      console.log(this.listCurr)
      pend().then(data => {
        console.log(data)
      })
    }
  }
}
function deepClone2(obj) {
  var _obj = JSON.stringify(obj)
  var objClone = JSON.parse(_obj)
  return objClone
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
