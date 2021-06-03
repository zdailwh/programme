<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>主线程</span>
          </div>
          <div class="cardMain">
            <p><span class="label">status：</span><span class="val">{{ thread.statusstr }}</span></p>
            <p><span class="label">flag：</span><span class="val">{{ thread.flag }}</span></p>
            <p><span class="label">jobs：</span><span class="val"><router-link v-if="thread.id" :to="{name: 'TaskJobList', query: { thread_id: thread.id }}"><el-button type="text">jobs</el-button></router-link></span></p>
            <p><span class="label">schedule：</span><span class="val">{{ thread.schedule }}</span></p>
            <p><span class="label">cycle：</span><span class="val">{{ thread.cycle }}</span></p>
            <p><span class="label">execute：</span><span class="val">{{ thread.execute }}</span></p>
            <p><span class="label">success：</span><span class="val">{{ thread.success }}</span></p>
            <p><span class="label">exception：</span><span class="val">{{ thread.exception }}</span></p>
            <p><span class="label">log：</span><span class="val">{{ thread.log }}</span></p>
          </div>
          <div>
            <el-button type="primary" round :disabled="!(thread.status === 0 && thread.flag === 0)" @click="threadStop">停止</el-button>
            <el-button type="primary" round @click="threadRestart">重启</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLast, threadStop, threadRestart } from '@/api/task-thread'

export default {
  data() {
    return {
      thread: {},
      listLoading: true
    }
  },
  created() {
    this.getLast()
  },
  methods: {
    getLast() {
      this.listLoading = true
      getLast().then(data => {
        this.thread = data || {}

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    threadStop() {
      threadStop().then(response => {
        this.$message({
          message: '已停止！',
          type: 'success'
        })
        this.getLast()
      })
    },
    threadRestart() {
      threadRestart().then(response => {
        this.$message({
          message: '已重启！',
          type: 'success'
        })
        this.getLast()
      })
    }
  }
}
</script>
