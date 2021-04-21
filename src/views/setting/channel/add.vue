<template>
  <el-dialog
    title="创建频道"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="频道名称" prop="name">
          <el-input v-model="formadd.name" />
        </el-form-item>
        <el-form-item label="播出端口" prop="port">
          <el-input v-model="formadd.port" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-col :span="11">
            <el-form-item prop="width">
              <el-input v-model="formadd.width" placeholder="分辨率宽" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">x</el-col>
          <el-col :span="11">
            <el-form-item prop="height">
              <el-input v-model="formadd.height" placeholder="分辨率高" />
            </el-form-item>
          </el-col>
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
import { createChannel } from '@/api/channel'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formadd: {
        name: '',
        port: '',
        width: '1920',
        height: '1080'
      },
      ruleValidate: {
        name: [
          { required: true, type: 'string', message: '频道名称不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, type: 'string', message: '播出端口不能为空', trigger: 'blur' }
        ],
        width: [
          { required: true, type: 'string', message: '分辨率宽不能为空', trigger: 'blur' }
        ],
        height: [
          { required: true, type: 'string', message: '分辨率高不能为空', trigger: 'blur' }
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
          this.createChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createChannel() {
      console.log(this.formadd)
      createChannel(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          port: '',
          width: '',
          height: ''
        }
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
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
