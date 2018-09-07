<template>
  <div id="box" class="content">
    <el-steps :active=active finish-status="success" simple style="margin-top: 20px">
      <el-step title="实名认证"></el-step>
      <el-step title="缴纳押金"></el-step>
      <el-step title="立即用车"></el-step>
    </el-steps>
    <div style="padding: 6px;" v-if="active===0">
      <el-input
        placeholder="请输入姓名"
        v-model.trim="user_name">
        <i slot="prefix" class="el-input__icon icon-person el-icon-search"></i>
      </el-input>
      <div style="margin-top:12px; "></div>
      <el-input
        placeholder="请输入身份证号"
        v-model.trim="mobile_number">
        <i slot="prefix" class="el-input__icon icon-shenfenzheng el-icon-search"></i>
      </el-input>
    </div>
    <el-button @click="next" class="open-serve-button" type="primary">立即认证</el-button>
  </div>
</template>
<script>
  import * as USER from 'assets/js/user.js';

  export default {
    data() {
      return {
        active: 0,
        user_name: '',
        mobile_number: ''
      };
    },
    methods: {
      next() {
        if (this.user_name === '') {
          this.$message.error({
            message: '输入姓名不可为空',
            type: 'error',
            showClose: true
          });
          return false;
        }
        ;
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(this.mobile_number) === false) {
          this.$message.error({
            message: '身份证输入不合法',
            type: 'error',
            showClose: true
          });
          return false;
        }
        ;
        this.userInfo();
      },
      //用户信息认证
      userInfo() {
        let self = this;
        let data = {
          "mobile_number": this.mobile_number,
          "user_name": this.user_name
        };

        const ret = function (ret) {
          if (ret.data) {
            self.$router.push({name: 'protocolSteps2'});
          } else {
            self.$message.error({
              message: ret.message,
              type: 'error',
              showClose: true
            });
          }
          console.log(ret);
        };
        const url = 'yourengongxiangdanche/UserInfo/Create';
        USER.ajax(url, 'POST', data, ret);
      }
    }
  };
</script>
<style scoped>
  .content {
    background: #f5f7fa;
    position: relative;
  }

  .open-serve-button {
    position: absolute;
    top: 600px;
    left: 50%;
    width: 40%;
    margin-left: -20%;
  }

  .money {
    text-align: center;
    font-size: 46px;
    line-height: 36px;
    color: #333;
  }
</style>
