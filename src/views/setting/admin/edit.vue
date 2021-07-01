<template>
  <div class="app-container">
    <div class="formWrap">
      <el-form ref="form" :model="currUser" :rules="ruleValidate" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currUser.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="currUser.mobile" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="commit">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updateUser } from '@/api/admin'
import { getToken, setToken } from '@/utils/auth'
export default {
  data() {
    return {
      currUser: JSON.parse(getToken()),
      loading: false,
      ruleValidate: {
        username: [
          { required: true, type: 'string', message: '姓名不能为空', trigger: 'blur' },
          { type: 'string', message: '用户名为2-8位字符', min: 2, max: 8, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号格式不正确', length: 11, pattern: /^1[3|5|8|7]([0-9]{9})$/, trigger: 'blur' }
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
          this.updateUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateUser() {
      this.loading = true
      updateUser(this.currUser).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.$store.commit('user/SET_TOKEN', JSON.stringify(this.currUser))
        setToken(JSON.stringify(this.currUser))
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped>
.formWrap {
  width: 500px;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 10px;
}
</style>
