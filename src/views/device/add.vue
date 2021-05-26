<template>
  <el-dialog
    title="创建设备"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
    top="0"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备IP" prop="ip">
          <el-input v-model="formadd.ip" placeholder="请输入设备IP" />
        </el-form-item>
        <el-form-item label="媒资目录" prop="mediapath">
          <el-input v-model="formadd.mediapath" placeholder="请输入媒资目录" />
        </el-form-item>
        <el-form-item label="输出网卡IP" prop="devip">
          <el-select v-model="formadd.devip" placeholder="请选择输出网卡IP地址" style="width: 100%;">
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
import { createDevice } from '@/api/device'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
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
      formadd: {
        name: '',
        ip: '',
        mediapath: '',
        devip: null
      },
      bitrateUnit: 'K',
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
          this.createDevice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createDevice() {
      this.formadd.bitrate = this.bitrateUnit === 'K' ? this.formadd.bitrate * 1000 : this.formadd.bitrate * 1000000
      console.log(this.formadd)
      createDevice(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          ip: '',
          mediapath: '',
          devip: null
        }
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeAddVisible', false)
    },
    handleClose(done) {
      this.$emit('changeAddVisible', false)
      // done()
    }
  }
}
</script>
