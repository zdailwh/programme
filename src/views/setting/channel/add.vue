<template>
  <el-dialog
    title="创建频道"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
    top="0"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="频道名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入频道名称" />
        </el-form-item>
        <el-form-item label="频道端口" prop="port">
          <el-input v-model="formadd.port" placeholder="请输入频道端口" />
        </el-form-item>
        <el-form-item label="频道编号" prop="index">
          <el-input v-model="formadd.index" placeholder="请输入频道编号" />
        </el-form-item>
        <el-form-item label="垫片路径" prop="defaultts">
          <el-input v-model="formadd.defaultts" placeholder="请输入垫片路径" />
        </el-form-item>
        <el-form-item label="EPG路径" prop="epgurl">
          <el-input v-model="formadd.epgurl" placeholder="请输入EPG路径" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-col :span="11">
            <el-form-item prop="width">
              <el-input v-model="formadd.width" placeholder="分辨率宽" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">x</el-col>
          <el-col :span="11">
            <el-form-item prop="height">
              <el-input v-model="formadd.height" placeholder="分辨率高" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="视频类型" prop="videores">
          <el-select v-model="formadd.videores" placeholder="请选择视频类型">
            <el-option v-for="(item,k) in videoTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="播出类型" prop="type">
          <el-select v-model="formadd.type" placeholder="请选择播出类型">
            <el-option v-for="(item,k) in outputTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <!-- SDI -->
        <template v-if="formadd.type === 1">
          <el-form-item label="码率卡序号" prop="cardno">
            <el-select v-model="formadd.cardno" placeholder="请选择码率卡序号">
              <el-option :value="0" label="0" />
              <el-option :value="1" label="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="端口号" prop="portno">
            <el-select v-model="formadd.portno" placeholder="请选择端口号">
              <el-option v-for="item in 8" :key="item" :value="item" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出帧率" prop="fps">
            <el-select v-model="formadd.fps" placeholder="请选择输出帧率">
              <el-option :value="25" label="25" />
              <el-option :value="30" label="30" />
              <el-option :value="50" label="50" />
              <el-option :value="60" label="60" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出声道" prop="audiotype">
            <el-select v-model="formadd.audiotype" placeholder="请选择输出声道">
              <el-option :value="2" label="双声道" />
              <el-option :value="6" label="六声道" />
            </el-select>
          </el-form-item>
        </template>
        <!-- UDP -->
        <template v-if="formadd.type === 0">
          <el-form-item label="网络ID" prop="networkid">
            <el-input v-model="formadd.networkid" placeholder="请输入网络ID" />
          </el-form-item>
          <el-form-item label="传送流ID" prop="tsid">
            <el-input v-model="formadd.tsid" placeholder="请输入传送流ID" />
          </el-form-item>
          <el-form-item label="业务ID" prop="serviceid">
            <el-input v-model="formadd.serviceid" placeholder="请输入业务ID" />
          </el-form-item>
          <el-form-item label="PMT PID" prop="pmtpid">
            <el-input v-model="formadd.pmtpid" placeholder="请输入PMT PID" />
          </el-form-item>
          <el-form-item label="VIDEO PID" prop="videopid">
            <el-input v-model="formadd.videopid" placeholder="请输入VIDEO PID" />
          </el-form-item>
          <el-form-item label="组播地址" prop="outurl">
            <el-input v-model="formadd.outurl" placeholder="请输入组播地址" />
          </el-form-item>
          <el-form-item label="组播端口" prop="outport">
            <el-input v-model="formadd.outport" placeholder="请输入组播端口" />
          </el-form-item>
          <el-form-item label="输出码率" prop="bitrate">
            <el-input v-model="formadd.bitrate" placeholder="请输入输出码率" />
          </el-form-item>
          <el-form-item label="输出网卡IP地址" prop="localaddr">
            <el-input v-model="formadd.localaddr" placeholder="请输入输出网卡IP地址" />
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
import { createChannel } from '@/api/channel'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formadd: {
        name: '',
        port: '',
        index: '',
        defaultts: '',
        epgurl: '',
        width: '1920',
        height: '1080',
        videores: 'SD',
        type: 0,
        cardno: null,
        portno: null,
        fps: null,
        audiotype: null,
        networkid: null,
        tsid: null,
        serviceid: null,
        pmtpid: null,
        videopid: null,
        outurl: null,
        outport: null,
        bitrate: null,
        localaddr: null
      },
      ruleValidate: {
        name: [
          { required: true, message: '频道名称不能为空', trigger: 'blur' }
        ],
        index: [
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
          this.createChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createChannel() {
      console.log(this.formadd)
      createChannel(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          index: '',
          defaultts: '',
          epgurl: '',
          width: '1920',
          height: '1080',
          videores: 'SD',
          type: 0,
          cardno: null,
          portno: null,
          fps: null,
          audiotype: null,
          networkid: null,
          tsid: null,
          serviceid: null,
          pmtpid: null,
          videopid: null,
          outurl: null,
          outport: null,
          bitrate: null,
          localaddr: null
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
