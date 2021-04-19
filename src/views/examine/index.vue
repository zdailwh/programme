<template>
  <div class="container">
    <div class="channelTabs">
      <el-radio-group v-model="radio1">
        <el-radio-button v-for="item in options" :key="item.value" :label="item.label" />
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>新编节目单</span>
            <el-button type="text" icon="el-icon-finished" class="cardBtn">提交播出</el-button>
            <el-button type="text" icon="el-icon-refresh-left" class="cardBtn">返回再编</el-button>
          </div>
          <Waiting />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header">
            <span>在播节目单</span>
          </div>
          <Online />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Online from './Online.vue'
import Waiting from './Waiting.vue'
export default {
  components: { Online, Waiting },
  data() {
    return {
      radio1: '频道1',
      options: [{ value: '11', label: '频道1' }, { value: '12', label: '频道2' }, { value: '13', label: '频道3' }, { value: '14', label: '频道4' }, { value: '15', label: '频道5' }]
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped>
.container {
  padding: 20px;
}
.channelTabs {
  margin-bottom: 10px;
}
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.cardBtn {
  margin: 0 10px;
  padding: 2px 0;
  float: right;
}
</style>
