<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisibleUpdatePwd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="原密码" prop="old">
          <el-input v-model="formadd.old" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input v-model="formadd.new" type="password" />
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
import { updatePwd } from '@/api/admin'
export default {
  props: {
    dialogVisibleUpdatePwd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formadd: {
        old: '',
        new: ''
      },
      ruleValidate: {
        old: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        new: [
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
          this.updatePwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePwd() {
      updatePwd(this.formadd).then(async response => {
        this.$message({
          message: '密码修改成功，请重新登录！',
          type: 'success'
        })
        this.formadd = {
          old: '',
          new: ''
        }
        this.$emit('changeUpdatePwdVisible', false)
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeUpdatePwdVisible', false)
    },
    handleClose(done) {
      this.$emit('changeUpdatePwdVisible', false)
      // done()
    }
  }
}
</script>
