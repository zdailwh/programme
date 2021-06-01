<template>
  <el-dialog
    title="编辑节目"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <el-form-item label="节目名称" prop="showname">
          <el-input v-model="editItem.showname" />
        </el-form-item>
        <el-form-item label="所属频道" prop="chnids">
          <el-select v-model="fo.chnids" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsChannels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属设备" prop="deviceids">
          <el-select v-model="fo.deviceids" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsDevices" :key="item.value" :label="item.label" :value="item.value" />
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
import { updateProgram } from '@/api/program'
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
    optionsChannels: {
      type: Array,
      default() {
        return []
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
      fo: {
        chnids: [],
        deviceids: []
      },
      ruleValidate: {
        showname: [
          { required: true, type: 'string', message: '节目名称不能为空', trigger: 'blur' }
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
          if (!this.fo.chnids.length) {
            this.$message({
              message: '请选择所属频道！',
              type: 'warning'
            })
            return
          }
          if (!this.fo.deviceids.length) {
            this.$message({
              message: '请选择所属设备！',
              type: 'warning'
            })
            return
          }
          this.updateProgram()
          this.updatechannelPro()
          this.updateDevicePro()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateProgram() {
      updateProgram(this.editItem).then(response => {
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
    },
    updatechannelPro() {
      console.log(this.fo.chnids)
    },
    updateDevicePro() {
      console.log(this.fo.deviceids)
    }
  }
}
</script>
