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
            <span>新编节目单</span>
            <template v-if="tempEpg !== null">
              <el-button type="text" icon="el-icon-finished" class="cardBtn" @click="passHandler">审核通过</el-button>
              <el-button type="text" icon="el-icon-refresh-left" class="cardBtn" @click="failHandler">返回再编</el-button>
            </template>
          </div>
          <Waiting :list-curr="listCurr" />
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
import { fetchList, pass, fail, uploaded } from '@/api/temp-epg'
import { getAllChannels } from '@/api/channel'
import { getLastEpg } from '@/api/epg'
import Online from './Online.vue'
import Waiting from './Waiting.vue'

export default {
  components: { Online, Waiting },
  data() {
    return {
      tempEpg: null,
      currChannel: '',
      currChannelId: '',
      options: [],
      allChannels: [],
      listCurr: []
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
      var filteredOpt = this.options.filter((item, idx, arr) => {
        return item.label === newVal
      })
      this.currChannelId = filteredOpt[0] ? filteredOpt[0].value : ''

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
        this.currChannel = this.allChannels[0].name || ''
        this.currChannelId = this.allChannels[0].id || ''
      })
    },
    passHandler() {
      this.$confirm(`确定要将此节目单通过审核并提交播出吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pass({ id: this.tempEpg.id }).then(data => {
          uploaded({ id: this.tempEpg.id })
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
        fail({ id: this.tempEpg.id }).then(data => {
          this.$router.push({ path: '/proEdit/index' })
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
