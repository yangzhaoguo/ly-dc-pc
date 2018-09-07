<template>
  <div class="content">
    <el-button @click="alertProtocol" class="open-serve-button" type="primary">开启单车服务</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {};
    },
    methods: {
      alertProtocol() {
        this.$confirm('' +
          '<div>您在使用ofo的产品或者服务钱，请点击阅读并确认下方条款。同意条款后即可开始使用由ofo依据该条款向您提供的服务。' +
          '<br>' +
          '<a style="color:#00a0e9;margin-top: 6px;" href="https:www.baidu.com">' +
          '《ofo用户服务协议》' +
          '</a>' +
          '</div>', 'ofo用户服务协议', {
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$router.push({
            name: 'protocolSteps1'
          });
        }, () => {
          console.log(2);
        });
      }
    },
    mounted() {}
  };
</script>

<style scoped>
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/img/zhuce-background.png") left 0 top 0 no-repeat;
    background-size: 100% auto;
  }

  .open-serve-button {
    position: absolute;
    top: 600px;
    left: 50%;
    width:40%;
    margin-left: -20%;
  }
</style>
