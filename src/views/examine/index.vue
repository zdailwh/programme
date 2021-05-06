<template>
  <div class="container">
    <div class="channelTabs routerTabs">
      <el-radio-group v-model="currChannel">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label">
          <router-link :to="{ name: 'ExamineMain', query: {currChannel: item.label, currChannelId: item.value}}" class="radioRouter">{{ item.label }}</router-link>
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>新编节目单 <span v-if="tempEpg !== null" style="color: #F56C6C;">（{{ tempEpg.statusstr }}）</span></span>
            <template v-if="tempEpg !== null">
              <el-button type="text" icon="el-icon-finished" class="cardBtn" @click="passHandler">审核通过</el-button>
              <el-button type="text" icon="el-icon-refresh-left" class="cardBtn" @click="failHandler">返回再编</el-button>
            </template>
          </div>
          <Waiting :list-curr="listCurrComp" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header">
            <span>在播节目单</span>
          </div>
          <Online ref="epgs" :channel-id="currChannelId" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchList, pass, fail, upload, updateTempEpg } from '@/api/temp-epg'
import { getAllChannels } from '@/api/channel'
import { getLastEpg } from '@/api/epg'
import Online from './Online.vue'
import Waiting from './Waiting.vue'

export default {
  components: { Online, Waiting },
  beforeRouteUpdate(to, from, next) {
    this.currChannel = to.query.currChannel || this.allChannels[0].name || ''
    this.currChannelId = parseInt(to.query.currChannelId) || this.allChannels[0].id || 0
    next()
  },
  data() {
    return {
      tempEpg: null,
      currChannel: '',
      currChannelId: 0,
      options: [],
      allChannels: [],
      listCurr: [],
      lastEpg: null
    }
  },
  computed: {
    listCurrComp: function() {
      if (this.lastEpg !== null) {
        return [this.lastEpg].concat(this.listCurr)
      } else {
        return this.listCurr
      }
    }
  },
  watch: {
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
      this.listCurr = []
      // 获取指定频道下的最后一条在播节目
      this.getLastEpg().then(() => {
        // 获取指定频道下的临时节目单
        this.getTempEpg()
        // 获取指定频道下的在播节目单
        this.$refs.epgs.handleFilter()
      })
    }
  },
  mounted() {
    this.getAllChannels()
  },
  methods: {
    getTempEpg() {
      this.listLoading = true
      fetchList({ page: 1, limit: 20, channelId: this.currChannelId, status: [1] }).then(data => {
        this.tempEpg = data.items ? data.items[0] : null
        if (this.tempEpg !== null) {
          this.listCurr = this.listCurr.concat(JSON.parse(this.tempEpg.epg))
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
    passHandler() {
      this.$confirm(`确定要将此节目单通过审核并提交播出吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTempEpg({ id: this.tempEpg.id }).then(() => {
          pass({ id: this.tempEpg.id }).then(data => {
            upload({ id: this.tempEpg.id }).then(() => {
              this.$message({
                message: '节目单已通过审核并提交播出！',
                type: 'success'
              })
              // 获取指定频道下的最后一条在播节目
              this.getLastEpg().then(() => {
                // 获取指定频道下的临时节目单
                this.listCurr = []
                this.getTempEpg()
                // 获取指定频道下的在播节目单
                this.$refs.epgs.handleFilter()
              })
            })
          })
        })
      }).catch(() => {
        console.log('已取消')
      })
    },
    failHandler() {
      this.$confirm(`确定要将此节目单返回再编吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTempEpg({ id: this.tempEpg.id }).then(() => {
          fail({ id: this.tempEpg.id }).then(data => {
            this.$router.push({ name: 'ProEditMain', query: { currChannel: this.currChannel, currChannelId: this.currChannelId }})
          })
        })
      }).catch(() => {
        console.log('已取消')
      })
    },
    async getLastEpg() {
      await getLastEpg({ orderby: '-id', channelId: this.currChannelId }).then(data => {
        this.lastEpg = data.items ? data.items[0] : null
        if (this.lastEpg) {
          this.lastEpg.isTheLastEpg = true
        }
      })
    }
  }
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
