<template>
  <el-dialog
    title="编辑权限"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="editItem.type" placeholder="请选择权限类型" style="width: 100%;">
            <el-option v-for="(item,k) in typeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述" prop="info">
          <el-input v-model="editItem.info" placeholder="请输入权限描述" />
        </el-form-item>
        <el-form-item label="菜单" prop="menu">
          <el-tree
            ref="tree"
            :default-expand-all="false"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            :default-checked-keys="editItem.menu"
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
import { updatePermission } from '@/api/mypermission'

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
      ruleValidate: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '权限类型不能为空', trigger: 'change' }
        ]
      },
      typeArr: [
        { label: '菜单权限', value: 1 }
      ],
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
              names.push(item.parent + '_')
            }
          })
          this.editItem.menu = names
          if (!this.editItem.menu.length) {
            this.$message({
              message: '请选择权限菜单',
              type: 'warning'
            })
            return
          }
          this.updatePermission()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePermission() {
      this.loading = true
      updatePermission(this.editItem).then(response => {
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
