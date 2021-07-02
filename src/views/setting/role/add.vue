<template>
  <el-dialog
    title="创建角色"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限" prop="proms">
          <el-tree
            ref="tree"
            :default-expand-all="false"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="name"
            class="permission-tree"
          />
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
import { createRole } from '@/api/myrole'

export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    routesData: {
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
        name: '',
        proms: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var checkedNodes = this.$refs.tree.getCheckedNodes()
          console.log(checkedNodes.map(item => { return item.name }))
          var names = []
          checkedNodes.map(item => {
            names.push(item.name)
            if (item.parent && !names.includes(item.parent)) {
              names.push(item.parent)
            }
          })
          this.formadd.proms = names
          if (!this.formadd.proms.length) {
            this.$message({
              message: '请选择角色权限',
              type: 'warning'
            })
            return
          }
          this.createRole()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createRole() {
      console.log(this.formadd)
      this.loading = true
      createRole(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          showname: '',
          no: '',
          width: '',
          height: '',
          videores: ''
        }
        this.loading = false
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
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
<style scoped>
.permission-tree {
  margin-bottom: 30px;
}
</style>
