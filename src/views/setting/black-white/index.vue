<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="黑名单"><Black /></el-tab-pane>
      <el-tab-pane label="白名单"><White /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Black from './black.vue'
import White from './white.vue'
export default {
  components: { Black, White },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
