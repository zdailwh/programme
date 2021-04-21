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
          <Edit ref="editlist" :list-curr="listCurr" @remove-pro="removePro" @copy-pro="copyPro" @update-start-time="updateStartTime" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>节目列表</span>
          </div>
          <Programs @append-pro="appendPro" />
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
  beforeRouteLeave(to, from, next) {
    this.$confirm('您还没有提交编单, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {
      next(false)
    })
  },
  data() {
    return {
      radio1: '频道1',
      options: [{ value: '11', label: '频道1' }, { value: '12', label: '频道2' }, { value: '13', label: '频道3' }, { value: '14', label: '频道4' }, { value: '15', label: '频道5' }],
      listCurr: [],
      start_time: (new Date().getTime()) - 24 * 60 * 60 * 1000,
      updateStartIdx: 0
    }
  },
  watch: {
    listCurr: {
      handler: function(newVal) {
        if (!newVal.length) return []
        newVal.map((item, idx, arr) => {
          if (idx === this.updateStartIdx) {
            item.start_time = this.start_time
          } else if (idx > this.updateStartIdx) {
            item.start_time = arr[idx - 1].end_time
          }
          item.end_time = item.start_time + item.duration * 1000
        })
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    appendPro(params) {
      var pros = deepClone2(params.items)
      var insertIdx = this.listCurr.indexOf(this.$refs.editlist.currentRow)
      if (insertIdx !== -1) {
        // 插入到指定节目之后
        pros.map((item, idx, arr) => {
          this.listCurr.splice(insertIdx + 1, 0, item)
        })
      } else {
        // 插入到尾部
        this.listCurr = this.listCurr.concat(pros)
      }

      // 表格单选行取消选择
      this.$refs.editlist.$refs.multipleTable.setCurrentRow()
    },
    removePro(params) {
      var pros = params.items
      var removeIdx = pros.map((item, idx, arr) => {
        return this.listCurr.indexOf(item)
      })

      this.listCurr = this.listCurr.filter((item, idx, arr) => {
        return removeIdx.indexOf(idx) === -1
      })
    },
    copyPro(params) {
      var pros = deepClone2(params.items)
      this.listCurr = this.listCurr.concat(pros)
    },
    updateStartTime({ index, starttime }) {
      this.updateStartIdx = index
      this.start_time = new Date(starttime).getTime()
      this.listCurr[index].start_time = new Date(starttime).getTime()
    }
  }
}
function deepClone2(obj) {
  var _obj = JSON.stringify(obj)
  var objClone = JSON.parse(_obj)
  return objClone
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
