<template>
  <div class="app-container">
    <div class="formWrap">
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="原密码" prop="old">
          <el-input v-model="formadd.old" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input v-model="formadd.new" type="password" />
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
import { updatePwd } from '@/api/admin'
export default {
  data() {
    return {
      loading: false,
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
      this.loading = true
      updatePwd(this.formadd).then(async response => {
        this.$message({
          message: '密码修改成功，请重新登录！',
          type: 'success'
        })
        this.formadd = {
          old: '',
          new: ''
        }
        this.loading = false

        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }).catch(() => {
        this.loading = false
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
