<template>
  <div>
    <el-tag
      v-for="(tag, key) in datalist"
      :key="key"
      closable
      :disable-transitions="false"
      @close="handleClose(tag.id, key)"
    >
      {{ tag.name }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      size="small"
      class="input-new-tag"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加IP</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      datalist: [
        {
          name: '192.168.0.2',
          id: 12
        },
        {
          name: '192.168.0.3',
          id: 13
        }
      ]
    }
  },
  created() {
  },
  methods: {
    handleClose(id, key) {
      this.datalist.splice(key, 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.datalist.push({
          name: inputValue,
          id: 14
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 150px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
