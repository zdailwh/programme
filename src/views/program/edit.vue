<template>
  <el-dialog
    title="编辑节目"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <el-form-item label="节目名称" prop="showname">
          <el-input v-model="editItem.showname" />
        </el-form-item>
        <el-form-item label="所属频道" prop="chnids">
          <el-select v-model="editItem.chnids" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { updateProgram } from '@/api/program'
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
    allChannels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: [],
      ruleValidate: {
        showname: [
          { required: true, type: 'string', message: '节目名称不能为空', trigger: 'blur' }
        ],
        chnids: [
          { required: true, type: 'array', message: '所属频道不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    allChannels: function(newVal) {
      if (newVal.length) {
        this.options = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    'editItem.chnids': function(newVal) {
      this.editItem.chnnames = this.options.filter((item, idx, arr) => {
        return newVal.indexOf(item.value) !== -1
      }).map((item, idx, arr) => {
        return item.label
      })
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateProgram()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateProgram() {
      updateProgram(this.editItem).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
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
