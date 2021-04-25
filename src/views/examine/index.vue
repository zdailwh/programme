<template>
  <div class="container">
    <div class="channelTabs">
      <el-radio-group v-model="currChannel">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label" :disabled="tempEpg !== null && item.label !== currChannel" />
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>新编节目单</span>
            <el-button type="text" icon="el-icon-finished" class="cardBtn" @click="passHandler">提交播出</el-button>
            <el-button type="text" icon="el-icon-refresh-left" class="cardBtn" @click="failHandler">返回再编</el-button>
          </div>
          <Waiting :list-curr="listCurr" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header">
            <span>在播节目单</span>
          </div>
          <Online ref="epgs" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchList, pass, fail } from '@/api/temp-epg'
import { getAllChannels } from '@/api/channel'
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
      if (!this.currChannelId) {
        var filteredOpt = this.options.filter((item, idx, arr) => {
          return item.label === newVal
        })
        this.currChannelId = filteredOpt[0] ? filteredOpt[0].value : ''
      }
      this.$refs.epgs.handleFilter(this.currChannelId)
    }
  },
  mounted() {
    this.getAllChannels().then(() => {
      this.getTempEpg()
    })
  },
  methods: {
    getTempEpg() {
      this.listLoading = true
      fetchList({ page: 1, limit: 20 }).then(data => {
        this.tempEpg = data.items ? data.items[0] : null
        console.log(this.tempEpg)
        if (this.tempEpg !== null) {
          this.currChannel = this.tempEpg.channel.name
          this.currChannelId = this.tempEpg.channel.id
          this.listCurr = JSON.parse(this.tempEpg.epg)
        }

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    async getAllChannels() {
      await getAllChannels().then(data => {
        this.allChannels = data.items
      })
    },
    passHandler() {
      this.$confirm(`确定要将此节目单通过审核吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pass({ id: this.tempEpg.id }).then(data => {
          console.log(data)
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
