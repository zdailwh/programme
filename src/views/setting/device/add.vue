<template>
  <el-dialog
    title="创建设备"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备IP" prop="ip">
          <el-input v-model="formadd.ip" placeholder="请输入设备IP" />
        </el-form-item>
        <el-form-item label="输出网卡IP" prop="devips">
          <el-input v-model="formadd.devips" placeholder="当为多个IP时，用|连接，如：127.0.0.0|127.0.0.1|127.0.0.2" />
        </el-form-item>
        <el-form-item label="媒资目录" prop="mediapath">
          <el-input v-model="formadd.mediapath" placeholder="请输入媒资目录" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="commit">确 定</el-button>
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
    }
  },
  data() {
    return {
      loading: false,
      formadd: {
        name: '',
        ip: '',
        mediapath: '',
        devips: ''
      },
      bitrateUnit: 'K',
      ruleValidate: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '设备IP不能为空', trigger: 'blur' }
        ],
        devips: [
          { required: true, message: '输出网卡IP不能为空', trigger: 'blur' }
        ],
        mediapath: [
          { required: true, message: '媒资目录不能为空', trigger: 'blur' }
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
      console.log(this.formadd)
      this.loading = true
      createDevice(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          ip: '',
          devips: '',
          mediapath: ''
        }
        this.loading = false
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
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
