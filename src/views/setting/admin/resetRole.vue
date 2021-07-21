<template>
  <el-dialog
    title="修改用户角色"
    :visible.sync="dialogVisibleResetRole"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editform" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="roleId" label="角色">
          <el-select v-model="editform.roleId" placeholder="请选择" style="width: 100%;">
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
import { getUserRole } from '@/api/admin'
import { createRoleUser, updateRoleUser } from '@/api/roleuser'
export default {
  props: {
    dialogVisibleResetRole: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
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
      userRoleItem: {},
      editform: {
        roleId: ''
      },
      ruleValidate: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    editItem(val) {
      this.getUserRole()
    }
  },
  mounted() {
  },
  methods: {
    getUserRole() {
      getUserRole({ id: this.editItem.id }).then(response => {
        if (response.id) {
          this.userRoleItem = response
          this.editform.roleId = response.role.id
        }
      }).catch((error) => {
        console.log(error.message)
      })
    },
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.userRoleItem && this.userRoleItem.id) {
            this.updateRoleUser()
          } else {
            this.createRoleUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateRoleUser() {
      this.loading = true
      updateRoleUser({ id: this.userRoleItem.id, roleId: this.editform.roleId }).then(response => {
        this.$message({
          message: '用户角色关联编辑成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeResetRoleVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    createRoleUser() {
      this.loading = true
      createRoleUser({ userId: this.editItem.id, roleId: this.editform.roleId }).then(response => {
        this.$message({
          message: '用户角色关联创建成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeResetRoleVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeResetRoleVisible', false)
    },
    handleClose(done) {
      this.$emit('changeResetRoleVisible', false)
      // done()
    }
  }
}
</script>
