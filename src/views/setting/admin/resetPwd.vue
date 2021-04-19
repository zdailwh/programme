<template>
  <el-dialog
    title="重置密码"
    :visible.sync="dialogVisibleResetPwd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="formadd.password" type="password" />
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
import { resetPwd } from '@/api/admin'
export default {
  props: {
    dialogVisibleResetPwd: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formadd: {
        password: ''
      },
      ruleValidate: {
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', message: '密码为6-12位字符', min: 6, max: 12, trigger: 'blur' }
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
          this.resetPwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPwd() {
      this.formadd.id = this.editItem.id
      resetPwd(this.formadd).then(response => {
        this.$message({
          message: '密码重置成功！',
          type: 'success'
        })
        this.formadd = {
          password: ''
        }
        this.$emit('changeResetPwdVisible', false)
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeResetPwdVisible', false)
    },
    handleClose(done) {
      this.$emit('changeResetPwdVisible', false)
      // done()
    }
  }
}
</script>
