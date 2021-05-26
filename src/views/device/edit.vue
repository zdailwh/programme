<template>
  <el-dialog
    title="编辑设备"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <!-- <el-form-item label="设备名称" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入设备名称" />
        </el-form-item> -->
        <el-form-item label="设备IP" prop="ip">
          <el-input v-model="editItem.ip" placeholder="请输入设备IP" />
        </el-form-item>
        <el-form-item label="媒资目录" prop="mediapath">
          <el-input v-model="editItem.mediapath" placeholder="请输入媒资目录" />
        </el-form-item>
        <el-form-item label="输出网卡IP" prop="devip">
          <el-select v-model="editItem.devip" placeholder="请选择输出网卡IP地址" style="width: 100%;">
            <el-option v-for="(item,k) in netCardArr" :key="k" :value="item.ip" :label="k + '（' + item.ip + ' / ' + item.netmask + '）'" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateDevice } from '@/api/device'
export default {
  props: {
    dialogVisibleEdit: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
    },
    netCardArr: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      ruleValidate: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '设备IP不能为空', trigger: 'blur' }
        ],
        mediapath: [
          { required: true, message: '媒资目录不能为空', trigger: 'blur' }
        ],
        devip: [
          { required: true, message: '输出网卡IP不能为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateDevice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateDevice() {
      this.editItem.bitrate = this.bitrateUnit === 'K' ? this.editItem.bitrate * 1000 : this.editItem.bitrate * 1000000
      updateDevice(this.editItem).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeEditVisible', false)
    },
    handleClose(done) {
      this.$emit('changeEditVisible', false)
      // done()
    }
  }
}
</script>
