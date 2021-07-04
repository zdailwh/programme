<template>
  <el-dialog
    title="创建用户"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formadd.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formadd.password" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formadd.mobile" />
        </el-form-item>
        <el-form-item prop="roleId" label="角色">
          <el-select v-model="roleId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { createUser } from '@/api/admin'
import { createRoleUser } from '@/api/roleuser'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsRoles: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      formadd: {
        username: '',
        password: '',
        mobile: ''
      },
      roleId: null,
      ruleValidate: {
        username: [
          { required: true, type: 'string', message: '姓名不能为空', trigger: 'blur' }
          // { type: 'string', message: '用户名为2-8位字符', min: 2, max: 8, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
          // { type: 'string', message: '密码为6-12位字符', min: 6, max: 12, trigger: 'blur' }
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
          if (!this.roleId) {
            this.$message({
              message: '请选择用户角色！',
              type: 'error'
            })
            return false
          }
          this.createUser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createUser() {
      console.log(this.formadd)
      this.loading = true
      createUser(this.formadd).then(response => {
        this.$message({
          message: '用户创建成功！',
          type: 'success'
        })
        this.createRoleUser(response.id, this.roleId)
        this.formadd = {
          username: '',
          password: '',
          mobile: ''
        }
        this.loading = false
        // this.$emit('changeAddVisible', false)
        // this.$emit('refresh')
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
    },
    createRoleUser(userId, roleId) {
      createRoleUser({ userId: userId, roleId: roleId }).then(response => {
        this.$message({
          message: '用户角色关联创建成功！',
          type: 'success'
        })
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(() => {
      })
    }
  }
}
</script>
