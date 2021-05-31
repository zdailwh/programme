<template>
  <el-dialog
    title="创建频道节目关联"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="channelId" label="频道">
          <el-select v-model="formadd.channelId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsChannels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="programmeId" label="关联节目">
          <el-select v-model="formadd.programmeId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsPros" :key="item.value" :label="item.label" :value="item.value" />
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
import { createProdevice } from '@/api/devicepros'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsChannels: {
      type: Array,
      default: function() {
        return []
      }
    },
    optionsPros: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      formadd: {
        channelId: '',
        programmeId: ''
      },
      ruleValidate: {
        channelId: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ],
        programmeId: [
          { required: true, message: '请选择节目', trigger: 'change' }
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
          this.createProdevice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createProdevice() {
      console.log(this.formadd)
      createProdevice(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          channelId: '',
          programmeId: ''
        }
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
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
