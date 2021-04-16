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
            <span>在编节目单</span>
            <el-button type="text" icon="el-icon-upload2" class="cardBtn">提交审核</el-button>
          </div>
          <Edit />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>节目列表</span>
          </div>
          <Programs />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Programs from './Programs.vue'
import Edit from './Edit.vue'
export default {
  components: { Programs, Edit },
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
