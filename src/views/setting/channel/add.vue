<template>
  <el-dialog
    title="创建频道"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div class="channelForm">
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="频道名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入频道名称" />
        </el-form-item>
        <el-form-item label="显示名称" prop="showname">
          <el-input v-model="formadd.showname" placeholder="请输入频道显示名称" />
        </el-form-item>
        <el-form-item label="频道编号" prop="no">
          <el-input v-model="formadd.no" placeholder="请输入频道编号" />
        </el-form-item>
        <!-- <el-form-item label="EPG路径" prop="epgurl">
          <el-input v-model="formadd.epgurl" placeholder="请输入EPG路径" />
        </el-form-item> -->
        <el-form-item label="视频类型" prop="videores">
          <el-select v-model="formadd.videores" :disabled="formadd.type === 1" placeholder="请选择视频类型" style="width: 100%;" @change="setWH">
            <el-option v-for="(item,k) in videoTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率">
          <el-col :span="11">
            <el-form-item prop="width">
              <el-input v-model="formadd.width" :readonly="true" placeholder="分辨率宽" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">x</el-col>
          <el-col :span="11">
            <el-form-item prop="height">
              <el-input v-model="formadd.height" :readonly="true" placeholder="分辨率高" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="素材格式">
          <el-tag v-for="tag in currFormat" :key="tag" closable :disable-transitions="false" @close="handleCloseExt(tag)">{{ tag }}</el-tag>
          <el-input v-if="inputExtVisible" ref="saveTagInput" v-model="inputExtValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputExt" @blur="handleInputExt" />
          <el-button v-else class="button-new-tag" size="small" @click="showInputExt">+ 其他格式</el-button>
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
import { createChannel } from '@/api/channel'
import { deepClone } from '@/utils/index'
const defaultFormat = ['TS', 'MXF', 'MP4', 'MPG', 'MOV', 'AVI', 'MPEG', 'M2TS', 'WMV', 'FLV', 'RMVB', 'M4V', 'MP2', 'MP3', 'AAC', 'AC3']

export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
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
      loading: false,
      formadd: {
        name: '',
        showname: '',
        no: '',
        width: '',
        height: '',
        videores: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '频道名称不能为空', trigger: 'blur' }
        ],
        showname: [
          { required: true, message: '频道显示名称不能为空', trigger: 'blur' }
        ],
        no: [
          { required: true, message: '频道编号不能为空', trigger: 'blur' }
        ],
        videores: [
          { required: true, message: '视频类型不能为空', trigger: 'change' }
        ]
      },
      videoTypeArr: [
        { label: '625I', value: '625I', width: '720', height: '576' },
        { label: '720P', value: '720P', width: '1280', height: '720' },
        { label: '1080I', value: '1080I', width: '1920', height: '1080' },
        { label: '1080P', value: '1080P', width: '1920', height: '1080' }
      ],
      currFormat: deepClone(defaultFormat),
      inputExtVisible: false,
      inputExtValue: ''
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.currFormat.length) {
            this.$message({
              message: '请选择素材格式',
              type: 'warning'
            })
            return
          }
          this.createChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createChannel() {
      console.log(this.formadd)
      this.formadd.supportedformat = deepClone(this.currFormat).join('|')
      this.loading = true
      createChannel(this.formadd).then(response => {
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
        this.currFormat = deepClone(defaultFormat)
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
    },
    handleCloseExt(tag) {
      this.currFormat.splice(this.currFormat.indexOf(tag), 1)
    },
    showInputExt() {
      this.inputExtVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputExt() {
      const inputExtValue = this.inputExtValue
      if (inputExtValue) {
        this.currFormat.push(inputExtValue)
      }
      this.inputExtVisible = false
      this.inputExtValue = ''
    },
    setWH(type) {
      this.videoTypeArr.map(item => {
        if (item.value === type) {
          this.formadd.width = item.width
          this.formadd.height = item.height
        }
      })
    }
  }
}
</script>
