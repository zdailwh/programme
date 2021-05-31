<template>
  <el-dialog
    title="编辑频道"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <!-- <el-form-item label="频道名称" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入频道名称" />
        </el-form-item> -->
        <el-form-item label="频道编号" prop="no">
          <el-input v-model="editItem.no" placeholder="请输入频道编号" />
        </el-form-item>
        <el-form-item label="垫片路径" prop="defaultts">
          <el-input v-model="editItem.defaultts" placeholder="请输入垫片路径" />
        </el-form-item>
        <el-form-item label="EPG路径" prop="epgurl">
          <el-input v-model="editItem.epgurl" placeholder="请输入EPG路径" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-col :span="11">
            <el-form-item prop="width">
              <el-input v-model="editItem.width" placeholder="分辨率宽" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">x</el-col>
          <el-col :span="11">
            <el-form-item prop="height">
              <el-input v-model="editItem.height" placeholder="分辨率高" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="视频类型" prop="videores">
          <el-select v-model="editItem.videores" :disabled="editItem.type === 1" placeholder="请选择视频类型" style="width: 100%;">
            <el-option v-for="(item,k) in videoTypeArr" :key="k" :value="item.value" :label="item.label" />
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
import { updateChannel } from '@/api/channel'
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
    netCardArr: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      ruleValidate: {
        name: [
          { required: true, message: '频道名称不能为空', trigger: 'blur' }
        ],
        no: [
          { required: true, message: '频道编号不能为空', trigger: 'blur' }
        ],
        defaultts: [
          { required: true, message: '垫片路径不能为空', trigger: 'blur' }
        ],
        epgurl: [
          { required: true, message: 'EPG路径不能为空', trigger: 'blur' }
        ],
        width: [
          { required: true, message: '分辨率宽不能为空', trigger: 'blur' }
        ],
        height: [
          { required: true, message: '分辨率高不能为空', trigger: 'blur' }
        ],
        videores: [
          { required: true, message: '视频类型不能为空', trigger: 'change' }
        ]
      },
      videoTypeArr: [
        { label: 'SD', value: 'SD' },
        { label: 'HD', value: 'HD' },
        { label: '4K', value: '4K' }
      ]
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateChannel() {
      updateChannel(this.editItem).then(response => {
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
