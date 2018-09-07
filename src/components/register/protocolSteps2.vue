<template>
  <div id="box" class="content">
    <el-steps :active=active finish-status="success" simple style="margin-top: 20px">
      <el-step title="实名认证"></el-step>
      <el-step title="缴纳押金"></el-step>
      <el-step title="立即用车"></el-step>
    </el-steps>
    <div style="padding: 6px;line-height: 24px" v-if="active===1">
      <div class="money">199元</div>
      <div style="color: #999999;">
        <div style="text-align: center;margin-top: 12px">为确保合规用车，需缴纳押金</div>
        <div style="text-align: center;">可随时退回付款账户</div>
      </div>
    </div>
    <el-button @click="next" class="open-serve-button" type="primary">确认缴纳199元押金</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 1
      };
    },
    methods: {
      next() {
        this.$router.push({name: 'employ-dc'});
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
    width:40%;
    margin-left: -20%;
  }

  .money {
    text-align: center;
    font-size: 52px;
    line-height: 42px;
    margin-top: 52px;
    color: #333;
  }
</style>
