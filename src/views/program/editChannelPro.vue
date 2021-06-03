<template>
  <el-dialog
    title="编辑节目频道关联"
    :visible.sync="dialogVisibleEditChannelPro"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-tag
        v-for="tag in tags"
        :key="tag.id"
        closable
        :disable-transitions="false"
        @close="delProChn(tag.id)"
      >
        {{ tag.channel.name }}
      </el-tag>
      <el-select v-if="showSelect" v-model="mychannel" class="select-new-tag" size="small" placeholder="关联频道" @change="createProchn">
        <el-option v-for="item in optionsChannels" :key="item.value" :label="item.label" :value="item.value" :disabled="currIdx.indexOf(item.value) !== -1" />
      </el-select>
      <el-button v-else class="button-new-tag" size="small" @click="showSelect = true">+ 关联频道</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createProchn, deleteProchn } from '@/api/prochns'
import { getAllProchns } from '@/api/program'
export default {
  props: {
    dialogVisibleEditChannelPro: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
    },
    optionsChannels: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      showSelect: false,
      tags: [],
      mychannel: ''
    }
  },
  computed: {
    currIdx() {
      return this.tags.map((item) => {
        return item.channel.id
      })
    }
  },
  watch: {
    editItem() {
      this.getChannelProList()
    }
  },
  mounted() {
  },
  methods: {
    getChannelProList() {
      getAllProchns({ id: this.editItem.id }).then(response => {
        if (response.items) {
          this.tags = response.items
        } else {
          this.tags = []
        }
      }).catch(error => {
        console.log(error)
      })
    },
    createProchn() {
      var formadd = {
        channelId: this.mychannel,
        programmeId: this.editItem.id
      }
      createProchn(formadd).then(response => {
        this.$message({
          message: '节目频道关联记录创建成功！',
          type: 'success'
        })
        this.mychannel = ''
        this.showSelect = false
        this.getChannelProList()
      }).catch(error => {
        console.log(error)
      })
    },
    delProChn(id) {
      deleteProchn({ id: id }).then(response => {
        this.$message({
          message: '节目频道关联记录已删除！',
          type: 'success'
        })
        this.getChannelProList()
      })
    },
    handleClose(done) {
      this.$emit('changeEditChannelProVisible', false)
      // done()
    }
  }
}
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.select-new-tag {
  width: 130px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
