<template>
  <div id="">
    <el-upload
      class="upload"
      action="http://ope.lingyi365.com:5608/cloud/wurengongxiangdanche/FileUpload/Upload"
      :before-upload="beforeUpload"
      :data="updateData"
      :headers="{Authentication:Authentication}"
      :on-success="onSuccess"
      list-type="picture-card">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as USER from 'assets/js/user.js';

  export default {
    data() {
      return {
        Authentication: USER.GetUserToken(),
        updateData: {
          files: {},
          isFullPath: ''
        },
        src: 'group1/M00/9B/6C/ooYBAFsLnLaAC-bYAAAeJrTLLSE137.jpg'
      };
    },
    methods: {
      beforeUpload(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
        const extension = testmsg === 'jpg';
        const extension2 = testmsg === 'png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 jpg、png格式!',
            type: 'warning'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
        }
        this.updateData['files'] = file;
        this.updateData['isFullPath'] = 0;
      },
      onSuccess(response, file, fileList) {
        console.log(response);
      }
    }
  };
</script>
<style scoped>
</style>
