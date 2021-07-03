<template>
  <el-dialog
    title="编辑角色"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editItem.description" placeholder="请输入角色描述" />
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
import { updateRole } from '@/api/myrole'

export default {
  props: {
    dialogVisibleEdit: {
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
      loading: false,
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
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
          this.updateRole()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateRole() {
      this.loading = true
      updateRole(this.editItem).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.loading = false
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeEditVisible', false)
    },
    handleClose(done) {
      this.$emit('changeEditVisible', false)
      // done()
    }
  }
}
</script>
