<template>
  <div class="app-container">
    <div class="formWrap upload-file">
      <el-form ref="addForm" label-width="100px">
        <el-form-item prop="chnids" label="所属频道：">
          <el-select v-model="addForm.chnids" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in chnOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="deviceids" label="所属设备：">
          <el-select v-model="addForm.deviceids" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型：">
          <el-tag v-for="tag in enableFile" :key="tag" closable :disable-transitions="false" @close="handleCloseExt(tag)">{{ tag }}</el-tag>
          <el-input v-if="inputExtVisible" ref="saveTagInput" v-model="inputExtValue" class="input-new-tag" size="small" @keyup.enter.native="handleInputExt" @blur="handleInputExt" />
          <el-button v-else class="button-new-tag" size="small" @click="showInputExt">+ 其他类型</el-button>
        </el-form-item>
        <el-form-item label="选择文件：">
          <el-button class="filter-item" icon="el-icon-folder-opened" @click="folderCheckConfirm">
            选择文件所属目录
          </el-button>
          <!-- <span style="color: #909399;margin-left: 10px;">目前支持的文件格式有：{{ enableFile.join('、') }}</span> -->
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-upload" @click="createHandle">
            上载
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- <div>
      <el-button v-if="status === Status.pause" @click="handleResume">恢复</el-button>
      <el-button v-else :disabled="status !== Status.uploading || !container.hash" @click="handlePause">暂停</el-button>

      <div>计算文件 hash</div>
      <el-progress :percentage="hashPercentage" />
      <div>总进度</div>
      <el-progress :percentage="fakeUploadPercentage" />
    </div> -->
    <div v-show="list.length" class="fileTableWrap">
      <el-form>
        <el-form-item :label="'文件类型筛选（' + checkedList.length + '/' + list.length + '）'" style="margin-bottom: 10px;">
          <el-checkbox-group v-model="checkedExts" @change="extFilter">
            <el-checkbox v-for="item in extsArr" :key="item" :label="item" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" v-loading="listLoading" :data="filterList" border fit highlight-current-row size="small" style="width: 900px;" height="500" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column fixed lable="序号" type="index" width="50" />
        <el-table-column label="文件名" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.file.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.file.size | change }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.ext }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件路径" align="center">
          <template slot-scope="{row}">
            <span>{{ row.file.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计算hash进度" align="center" width="150">
          <template slot-scope="{row}">
            <el-progress :percentage="row.percentageHash" />
            <!-- <span>{{ row.percentage }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="上传进度" align="center" width="150">
          <template slot-scope="{row}">
            <span v-if="row.createRes" style="color: #f00;">{{ row.createRes }}</span>
            <el-progress v-else :percentage="row.percentage" />
            <!-- <span>{{ row.percentage }}</span> -->
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <span></span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

  </div>
</template>
<script>
import { createProgram, mergeProgram } from '@/api/program'
import { getAllChannels } from '@/api/channel'
import { getAllDevices } from '@/api/device'
import { createProdevice, deleteProdevice } from '@/api/devicepros'
import { createProchn, deleteProchn } from '@/api/prochns'
const SIZE = 32 * 1024 * 1024 // 切片大小

export default {
  beforeRouteLeave(to, from, next) {
    if (!this.uploadCompleted) {
      this.$confirm('还有文件上传中, 确定要离开吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  },
  filters: {
    change(limit) {
      var size = ''
      if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
        size = limit.toFixed(2) + 'B'
      } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + 'KB'
      } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
      } else { // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      var sizeStr = size + '' // 转成字符串
      var index = sizeStr.indexOf('.') // 获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
      if (dou === '00') { // 判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size
    }
  },
  data() {
    return {
      chnOptions: [],
      allChannels: [],
      deviceOptions: [],
      allDevices: [],
      handleList: [],
      list: [],
      filterList: [],
      checkedList: [],
      rootHandle: {},
      addForm: {
        chnids: [],
        deviceids: []
      },
      container: {
        file: null,
        hash: '',
        worker: null
      },
      hashPercentage: 0,
      chunkData: [],
      requestList: [],
      extsArr: [],
      checkedExts: [],
      enableFile: ['TS', 'MXF', 'MP4', 'MPG', 'MOV', 'AVI', 'MPEG', 'M2TS', 'WMV', 'FLV', 'RMVB', 'M4V', 'MP2', 'MP3', 'AAC', 'AC3'],
      inputExtVisible: false,
      inputExtValue: '',
      listLoading: false,
      uploadCompleted: true // 当前页文件是否已经全部上传
    }
  },
  watch: {
    allChannels: function(newVal) {
      if (newVal.length) {
        this.chnOptions = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    allDevices: function(newVal) {
      if (newVal.length) {
        this.deviceOptions = newVal.map((item, idx, arr) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    }
  },
  created() {
    this.getAllChannels()
    this.getAllDevices()
  },
  mounted() {
    window.addEventListener('beforeunload', beforeunloadFn, true)
  },
  destroyed() {
    window.removeEventListener('beforeunload', beforeunloadFn, true)
  },
  methods: {
    async fileCheck() {
      const fileHandles = await window.showOpenFilePicker({ multiple: true })
      fileHandles.forEach(async(item, idx, arr) => {
        console.log(item)
        const file = await item.getFile()
        console.log(file)
      })
    },
    resetFilelist() {
      this.list = []
      this.filterList = []
      this.$refs.multipleTable.clearSelection()
      this.extsArr = []
      this.checkedExts = []
    },
    folderCheckConfirm() {
      if (!this.uploadCompleted) {
        this.$confirm('还有文件上传中, 确定要重新选择文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.folderCheck()
        })
      } else {
        this.folderCheck()
      }
    },
    async folderCheck() {
      if (!this.enableFile.length) {
        this.$message({
          message: '请设置需要筛选的文件类型！',
          type: 'warning'
        })
        return
      }
      this.resetFilelist()
      const parentHandle = await window.showDirectoryPicker()
      this.rootHandle = parentHandle
      this.rootDirectory = parentHandle.name
      this.listLoading = true
      await this.getSub(parentHandle)
      this.listLoading = false

      this.filterList = this.list
      this.$nextTick(() => {
        if (this.filterList.length) {
          this.filterList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      })

      this.getExts()
    },
    async getSub(parentHandle) {
      var that = this
      for await (const entry of parentHandle.values()) {
        if (entry.kind === 'directory') {
          var subHandle = await parentHandle.getDirectoryHandle(entry.name, { create: false })
          await that.getSub(subHandle)
        } else if (entry.kind === 'file') {
          // that.handleList.push(entry)
          // console.log(await that.rootHandle.resolve(entry))
          // console.log(await entry.getFile())
          var file = await entry.getFile()
          file.path = this.rootDirectory + '/' + (await that.rootHandle.resolve(entry)).join('/')
          var ext = file.name.substring(file.name.lastIndexOf('.') + 1)
          if (this.enableFile.includes(ext) || this.enableFile.includes(ext.toUpperCase()) || this.enableFile.includes(ext.toLowerCase())) {
            that.list.push({ file: file, ext: ext, percentage: 0, percentageHash: 0, createRes: '' })
          }
        }
      }
    },
    getExts() {
      const exts = this.enableFile
      // this.list.forEach((fileitem, idx, arr) => {
      //   if (exts.indexOf(fileitem.ext) === -1) {
      //     exts.push(fileitem.ext)
      //   }
      // })
      this.extsArr = exts
      this.checkedExts = exts
    },
    extFilter() {
      this.filterList = this.list.filter((fileitem, idx, arr) => {
        return (this.checkedExts.indexOf(fileitem.ext) !== -1 || this.checkedExts.indexOf(fileitem.ext.toUpperCase()) !== -1 || this.checkedExts.indexOf(fileitem.ext.toLowerCase()) !== -1)
      })
      this.$nextTick(() => {
        if (this.filterList.length) {
          this.filterList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.checkedList = val
    },
    async createHandle() {
      if (!this.addForm.chnids.length) {
        this.$message({
          message: '请选择所属频道！',
          type: 'warning'
        })
        return
      }
      if (!this.addForm.deviceids.length) {
        this.$message({
          message: '请选择所属设备！',
          type: 'warning'
        })
        return
      }
      if (!this.checkedList.length) {
        this.$message({
          message: '请选择要上传的文件！',
          type: 'warning'
        })
        return
      }
      await this.createTasks(this.checkedList, 0)
    },
    async createChannelPro(chnids, programmeId) {
      const requestList = chnids.map(async(item) => {
        this.createProchn(item, programmeId)
      })
      return requestList
    },
    async createDevicePro(deviceids, programmeId) {
      const requestList = deviceids.map(async(item) => {
        this.createProdevice(item, programmeId)
      })
      return requestList
    },
    async createTasks(filelist, startIdx) {
      this.uploadCompleted = false

      const listItem = filelist[startIdx]
      const fileChunkList = this.createFileChunk(listItem.file)
      filelist[startIdx].fileChunkList = fileChunkList
      console.log(startIdx + '切片个数：' + fileChunkList.length)
      listItem.hash = await this.calculateHash(fileChunkList, filelist, startIdx)
      await this.createTask(listItem, startIdx).then(async(response) => {
        console.log('创建节目返回' + startIdx + '/' + response.id)
        filelist[startIdx].programid = response.id

        var requestChnpros = await this.createChannelPro(this.addForm.chnids, response.id)
        console.log(requestChnpros)
        await Promise.all(requestChnpros).then(async(result) => {
          console.log('创建频道关联成功了')
        }).catch((error) => {
          console.log(error)
          console.log('创建频道关联失败了')
        })

        var requestDevicepros = await this.createDevicePro(this.addForm.deviceids, response.id)
        console.log(requestDevicepros)
        await Promise.all(requestDevicepros).then(async(result) => {
          console.log('创建设备关联成功了')
        }).catch((error) => {
          console.log(error)
          console.log('创建设备关联失败了')
        })

        await this.uploadFiles(filelist, startIdx)
      }).catch((error) => {
        filelist[startIdx].createRes = (error.response && error.response.data) || '节目创建执行失败'
      })

      if (startIdx < filelist.length - 1) {
        await this.createTasks(filelist, startIdx + 1)
      } else {
        this.uploadCompleted = true
      }
    },
    async createTask(fileItem, idx) {
      var md5 = fileItem.hash
      var params = {
        name: fileItem.file.name,
        md5: md5,
        ext: fileItem.ext
      }
      return new Promise((resolve, reject) => {
        createProgram(params).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    async uploadFiles(filelist, startIdx) {
      console.log('开始上传文件' + startIdx)
      const listItem = filelist[startIdx]
      const fileChunkList = listItem.fileChunkList

      var requestList = []
      // this.chunkData = fileChunkList.map(({ file }, index) => ({
      //   programid: listItem.programid,
      //   fileHash: listItem.hash,
      //   index,
      //   hash: listItem.hash + '-' + index,
      //   chunk: file,
      //   size: file.size,
      //   percentage: 0
      // }))

      // requestList = await this.uploadChunks(filelist, startIdx, this.chunkData)
      // await Promise.all(requestList).then(async(result) => {
      //   // 合并切片
      //   await this.mergeRequest(listItem.programid)
      // }).catch((error) => {
      //   console.log('分片上传失败了')
      //   console.log(error)
      // })

      var verifyRes = await this.verifyUpload(listItem.hash)
      if (verifyRes === '资源不存在' || (verifyRes.file === '' && !verifyRes.chunks.length)) {
        // 说明大文件file在服务端不存在，前端按正常流程将所有分片上传
        this.chunkData = fileChunkList.map(({ file }, index) => ({
          programid: listItem.programid,
          fileHash: listItem.hash,
          index,
          hash: listItem.hash + '-' + index,
          chunk: file,
          size: file.size,
          percentage: 0
        }))

        requestList = await this.uploadChunks(filelist, startIdx, this.chunkData)
        await Promise.all(requestList).then(async(result) => {
          // 合并切片
          await this.mergeRequest(listItem.programid)
        }).catch((error) => {
          console.log('分片上传失败了')
          console.log(error)
        })
      } else if (verifyRes.file) {
        // 若file有值，说明已完成上传，前端不需要再传输任何分片文件
        this.checkedList[startIdx].percentage = 100
      } else if (verifyRes.file === '' && verifyRes.chunks.length) {
        // 若file为空，分片chunks有值，说明部分分片已接收
        var uploadedList = verifyRes.chunks
        this.chunkData = fileChunkList.map(({ file }, index) => ({
          programid: listItem.programid,
          fileHash: listItem.hash,
          index,
          hash: listItem.hash + '-' + index,
          chunk: file,
          size: file.size,
          percentage: uploadedList.includes(listItem.hash + '-' + index) ? 100 : 0
        }))

        requestList = await this.uploadChunks(filelist, startIdx, this.chunkData, uploadedList)
        await Promise.all(requestList).then(async(result) => {
          // 合并切片
          await this.mergeRequest(listItem.programid)
        }).catch((error) => {
          console.log('分片上传失败了')
          console.log(error)
        })
      }
    },
    // 上传切片，同时过滤已上传的切片
    async uploadChunks(filelist, startIdx, chunkData, uploadedList = []) {
      const requestList = chunkData
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ programid, fileHash, chunk, hash, index }) => {
          const formData = new FormData()
          formData.append('bigFileId', programid)
          formData.append('chunk', chunk)
          formData.append('hash', hash)
          formData.append('chunkTotal', chunkData.length)
          formData.append('fileHash', fileHash)
          return { formData, index }
        })
        .map(async({ formData, index }) =>
          this.myRequest({
            url: '/api/admin/programme/v1/chunks',
            method: 'post',
            data: formData,
            onProgress: this.createProgressHandler(chunkData[index], filelist, startIdx, chunkData),
            requestList: this.requestList
          })
        )
      return requestList
    },
    // xhr
    myRequest({ url, method, data, headers = {}, onProgress = e => e, requestList }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = onProgress
        xhr.open(method, url)
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        )
        xhr.send(data)
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr)
            requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response
          })
        }
        // 暴露当前 xhr 给外部
        requestList?.push(xhr)
      })
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList, filelist, startIdx) {
      console.log('开始计算hash' + startIdx)
      return new Promise(resolve => {
        this.container.worker = new Worker('/programme/hash.js')
        this.container.worker.postMessage({ fileChunkList })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          filelist[startIdx].percentageHash = parseInt(percentage)
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    // 通知服务端合并切片
    async mergeRequest(id) {
      mergeProgram({ id: id }).then(response => {
        // this.$message({
        //   message: '合并成功！',
        //   type: 'success'
        // })
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    // 根据 hash 验证文件是否曾经已经被上传过
    // 没有才进行上传
    async verifyUpload(fileHash) {
      const { data } = await this.myRequest({
        url: '/api/admin/programme/v1/programmes/verify?md5=' + fileHash,
        method: 'get',
        headers: {
          'content-type': 'application/json'
        }
      })
      return JSON.parse(data)
    },
    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler(item, filelist, startIdx, chunkData) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100))

        const loaded = chunkData
          .map(item => item.size * item.percentage)
          .reduce((acc, cur) => acc + cur)
        const per = parseInt((loaded / filelist[startIdx].file.size).toFixed(2))
        filelist[startIdx].percentage = per > 100 ? 100 : per
      }
    },
    handleCloseExt(tag) {
      this.enableFile.splice(this.enableFile.indexOf(tag), 1)
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
        this.enableFile.push(inputExtValue)
      }
      this.inputExtVisible = false
      this.inputExtValue = ''
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    getAllDevices() {
      getAllDevices().then(data => {
        this.allDevices = data.items || []
      }).catch(error => {
        this.$message({
          message: error.message || '操作失败！',
          type: 'error'
        })
      })
    },
    createProdevice(deviceId, programmeId) {
      var formadd = {
        deviceId: deviceId,
        programmeId: programmeId
      }
      console.log(formadd)
      return new Promise((resolve, reject) => {
        createProdevice(formadd).then(response => {
          // this.$message({
          //   message: '节目设备关联记录创建成功！',
          //   type: 'success'
          // })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    delDevicepro(id) {
      deleteProdevice({ id: id }).then(response => {
        this.$message({
          message: '节目设备关联记录删除成功！',
          type: 'success'
        })
      })
    },
    createProchn(channelId, programmeId) {
      var formadd = {
        channelId: channelId,
        programmeId: programmeId
      }
      console.log(formadd)
      return new Promise((resolve, reject) => {
        createProchn(formadd).then(response => {
          // this.$message({
          //   message: '节目频道关联记录创建成功！',
          //   type: 'success'
          // })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    delProchn(id) {
      deleteProchn({ id: id }).then(response => {
        this.$message({
          message: '节目频道关联记录删除成功！',
          type: 'success'
        })
      })
    }
  }
}
function beforeunloadFn(e) {
  // 这个事件只有在鼠标真正和浏览器有了交互，再刷新或者关闭时才会触发, 浏览器事件会弹框确认用户是否要离开页面
  e = e || window.event
  if (e) {
    e.returnValue = '关闭提示'
  }
  return '关闭提示'
}
</script>
<style scoped>
.formWrap {
  width: 900px;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 10px;
}
.fileTableWrap {
  margin-top: 10px;
}
</style>
