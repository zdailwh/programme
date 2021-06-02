<template>
  <el-dialog
    title="编辑节目设备关联"
    :visible.sync="dialogVisibleEditDevicePro"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-tag
        v-for="tag in tags"
        :key="tag.id"
        closable
        :disable-transitions="false"
        @close="delProdevice(tag.id)"
      >
        {{ tag.name }}
      </el-tag>
      <el-select v-if="showSelect" v-model="mydevice" class="select-new-tag" size="small" placeholder="关联设备" @change="createProdevice">
        <el-option v-for="item in optionsDevices" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-else class="button-new-tag" size="small" @click="showSelect = true">+ 关联设备</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createProdevice, deleteProdevice } from '@/api/devicepros'
export default {
  props: {
    dialogVisibleEditDevicePro: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
    },
    optionsDevices: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      showSelect: false,
      tags: [
        { id: 1, name: '设备1' }, { id: 2, name: '设备2' }
      ],
      mydevice: {}
    }
  },
  watch: {
    editItem() {
      this.getDeviceProList()
    }
  },
  mounted() {
  },
  methods: {
    getDeviceProList() {
      console.log(this.editItem.id)
    },
    createProdevice() {
      var formadd = {
        deviceId: this.mydevice.value,
        programmeId: this.editItem.id
      }
      createProdevice(formadd).then(response => {
        this.$message({
          message: '节目设备关联记录创建成功！',
          type: 'success'
        })
        this.mydevice = {}
        this.showSelect = false
        this.getDeviceProList()
      }).catch(error => {
        console.log(error)
      })
    },
    delProdevice(id) {
      deleteProdevice({ id: id }).then(response => {
        this.$message({
          message: '节目设备关联记录已删除！',
          type: 'success'
        })
        this.getDeviceProList()
      })
    },
    handleClose(done) {
      this.$emit('changeEditDeviceProVisible', false)
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
