<template>
  <el-dialog
    title="创建设备频道关联"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
    top="0"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item prop="deviceId" label="设备">
          <el-select v-model="formadd.device" placeholder="请选择" style="width: 100%;" @change="deviceChange">
            <el-option v-for="item in optionsDevices" :key="item.value" :label="item.label" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item prop="channelId" label="关联频道">
          <el-select v-model="formadd.channelId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in optionsChns" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="播出类型" prop="type">
          <el-select v-model="formadd.type" placeholder="请选择播出类型" style="width: 100%;">
            <el-option v-for="(item,k) in outputTypeArr" :key="k" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <!-- SDI -->
        <template v-if="formadd.type === 1">
          <el-form-item label="码率卡序号" prop="cardno">
            <el-select v-model="formadd.cardno" placeholder="请选择码率卡序号" style="width: 100%;">
              <el-option :value="0" label="0" />
              <el-option :value="1" label="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="端口号" prop="portno">
            <el-select v-model="formadd.portno" placeholder="请选择端口号" style="width: 100%;">
              <el-option v-for="item in 8" :key="item" :value="item" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出帧率" prop="fps">
            <el-select v-model="formadd.fps" placeholder="请选择输出帧率" style="width: 100%;">
              <el-option :value="25" label="25" />
              <el-option :value="30" label="30" />
              <el-option :value="50" label="50" />
              <el-option :value="60" label="60" />
            </el-select>
          </el-form-item>
          <el-form-item label="输出声道" prop="audiotype">
            <el-select v-model="formadd.audiotype" placeholder="请选择输出声道" style="width: 100%;">
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
            <el-input v-model="formadd.bitrate" placeholder="请输入输出码率">
              <el-select slot="append" v-model="bitrateUnit" style="width: 70px;">
                <el-option label="K" value="K" />
                <el-option label="M" value="M" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="输出网卡IP地址" prop="localaddr">
            <el-select v-model="formadd.localaddr" placeholder="请选择输出网卡IP地址" style="width: 100%;">
              <el-option v-for="(item,k) in netCardArr" :key="k" :value="item" :label="item" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createDevicechn } from '@/api/devicechns'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    optionsDevices: {
      type: Array,
      default: function() {
        return []
      }
    },
    optionsChns: {
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
        deviceId: '',
        channelId: '',
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
      bitrateUnit: 'K',
      ruleValidate: {
        deviceId: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ],
        type: [
          { required: true, message: '播出类型不能为空', trigger: 'change' }
        ]
      },
      outputTypeArr: [
        { label: 'UDP', value: 0 },
        { label: 'SDI', value: 1 }
      ],
      netCardArr: []
    }
  },
  mounted() {
  },
  methods: {
    deviceChange(dev) {
      this.formadd.deviceId = dev.value
      this.netCardArr = dev.devips
    },
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createDevicechn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createDevicechn() {
      this.loading = true
      this.formadd.bitrate = this.bitrateUnit === 'K' ? this.formadd.bitrate * 1000 : this.formadd.bitrate * 1000000
      console.log(this.formadd)
      createDevicechn(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          deviceId: '',
          channelId: '',
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
