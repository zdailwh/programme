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
      <el-button type="primary" :loading="loading" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { resetPwd } from '@/api/admin'
import Cookies from 'js-cookie'
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
    var validatePwd = (rule, value, callback) => {
      var len = this.pwdset.length
      var complexity = this.pwdset.complexity
      var reg = new RegExp('^.*(?=.{8,})(?=.*[0-9])(?=.*[a-zA-Z]).*$')
      var regMsg = '至少8位字母数字'
      if (complexity === 1) {
        // 字母数字
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[a-zA-Z]).*$')
        regMsg = `至少${len}位字母数字`
      } if (complexity === 2) {
        // 大小写及数字
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$')
        regMsg = `至少${len}位大小写字母加数字`
      } if (complexity === 3) {
        // 大小写、数字及特殊符号
        reg = new RegExp('^.*(?=.{' + len + ',})(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$')
        regMsg = `至少${len}位大小写字母加数字加特殊符号`
      }
      if (value === '') {
        callback(new Error('新密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error(regMsg))
      } else {
        callback()
      }
    }
    return {
      pwdset: (Cookies.get('Programme-pwdset') && JSON.parse(Cookies.get('Programme-pwdset'))) || { length: 8, complexity: 1, changespace: 30 },
      loading: false,
      formadd: {
        password: ''
      },
      ruleValidate: {
        password: [
          { required: true, validator: validatePwd, trigger: 'blur' }
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
      this.loading = true
      this.formadd.id = this.editItem.id
      resetPwd(this.formadd).then(response => {
        this.$message({
          message: '密码重置成功！',
          type: 'success'
        })
        this.formadd = {
          password: ''
        }
        this.loading = false
        this.$emit('changeResetPwdVisible', false)
      }).catch(() => {
        this.loading = false
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
