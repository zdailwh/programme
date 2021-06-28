<template>
  <el-dialog
    title="新增白名单"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="formadd.ip" />
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
import { createIp_white } from '@/api/ip'
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
        ip: ''
      },
      ruleValidate: {
        ip: [
          { required: true, type: 'string', message: 'IP不能为空', trigger: 'blur' }
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
          this.createIp()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createIp() {
      console.log(this.formadd)
      this.loading = true
      createIp_white(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          ip: ''
        }
        this.loading = false
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(error => {
        this.loading = false
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
