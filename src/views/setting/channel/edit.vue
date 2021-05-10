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
          <el-select v-model="editItem.videores" placeholder="请选择视频类型" style="width: 100%;">
            <el-option v-for="(item,k) in videoTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="播出类型" prop="type">
          <el-select v-model="editItem.type" placeholder="请选择播出类型" style="width: 100%;">
            <el-option v-for="(item,k) in outputTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <!-- SDI -->
        <template v-if="editItem.type === 1">
          <el-form-item label="码率卡序号" prop="cardno" style="width: 100%;">
            <el-select v-model="editItem.cardno" placeholder="请选择码率卡序号">
              <el-option :value="0" label="0" />
              <el-option :value="1" label="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="端口号" prop="portno" style="width: 100%;">
            <el-select v-model="editItem.portno" placeholder="请选择端口号">
              <el-option v-for="item in 8" :key="item" :value="item" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出帧率" prop="fps" style="width: 100%;">
            <el-select v-model="editItem.fps" placeholder="请选择输出帧率">
              <el-option :value="25" label="25" />
              <el-option :value="30" label="30" />
              <el-option :value="50" label="50" />
              <el-option :value="60" label="60" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出声道" prop="audiotype" style="width: 100%;">
            <el-select v-model="editItem.audiotype" placeholder="请选择输出声道">
              <el-option :value="2" label="双声道" />
              <el-option :value="6" label="六声道" />
            </el-select>
          </el-form-item>
        </template>
        <!-- UDP -->
        <template v-if="editItem.type === 0">
          <el-form-item label="网络ID" prop="networkid">
            <el-input v-model="editItem.networkid" placeholder="请输入网络ID" />
          </el-form-item>
          <el-form-item label="传送流ID" prop="tsid">
            <el-input v-model="editItem.tsid" placeholder="请输入传送流ID" />
          </el-form-item>
          <el-form-item label="业务ID" prop="serviceid">
            <el-input v-model="editItem.serviceid" placeholder="请输入业务ID" />
          </el-form-item>
          <el-form-item label="PMT PID" prop="pmtpid">
            <el-input v-model="editItem.pmtpid" placeholder="请输入PMT PID" />
          </el-form-item>
          <el-form-item label="VIDEO PID" prop="videopid">
            <el-input v-model="editItem.videopid" placeholder="请输入VIDEO PID" />
          </el-form-item>
          <el-form-item label="组播地址" prop="outurl">
            <el-input v-model="editItem.outurl" placeholder="请输入组播地址" />
          </el-form-item>
          <el-form-item label="组播端口" prop="outport">
            <el-input v-model="editItem.outport" placeholder="请输入组播端口" />
          </el-form-item>
          <el-form-item label="输出码率" prop="bitrate">
            <el-input v-model="editItem.bitrate" placeholder="请输入输出码率" />
          </el-form-item>
          <el-form-item label="输出网卡IP地址" prop="localaddr">
            <el-select v-model="editItem.localaddr" placeholder="请选择输出网卡IP地址" style="width: 100%;">
              <el-option v-for="(item,k) in netCardArr" :key="k" :value="item.ip" :label="k + '（' + item.ip + ' / ' + item.netmask + '）'" />
            </el-select>
          </el-form-item>
        </template>
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
        ],
        type: [
          { required: true, message: '播出类型不能为空', trigger: 'change' }
        ]
      },
      outputTypeArr: [
        { label: 'UDP', value: 0 },
        { label: 'SDI', value: 1 }
      ],
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
