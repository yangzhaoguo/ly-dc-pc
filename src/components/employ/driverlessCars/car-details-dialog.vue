<template>
  <div id="content">
    <!--<header>-->
    <!--车辆正努力赶来，请耐心等待-->
    <!--</header>-->
    <main class="flex">
      <div>{{bikeData.bike_number}}</div>
      <div>
        <img src="https://ss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1592985218.jpg" alt="">
      </div>
      <div>
        <div>{{bikeData.bike_name}}</div>
        <div style="line-height: 32px">
          <i style="color: orange;font-size: 18px;line-height: 12px" class="iconfont icon-pingjiaxingxing"></i>
          <span>4.8 &nbsp; 137单</span>&nbsp;
        </div>
      </div>
    </main>
    <footer class="flex">
      <div><i class="el-icon-message"></i> 发消息</div>
      <p></p>
      <div><i class="el-icon-phone"></i> 打电话</div>
      <p></p>
      <div @click="upDataStatus(0)" v-if="distance_status===1"><i class="el-icon-circle-close"></i> 取消订单</div>
      <!--<div @click="upDataStatus(2)" v-if="distance_status===2"><i class="el-icon-circle-close"></i> 确认上车</div>-->
      <div @click="upDataStatus(3)" v-if="distance_status===4"> 确认下车</div>
      <p></p>
      <div>
        <el-popover
          v-model="showItem">
          <div class="outer">
            <div v-if="distance_status===1" style="border-bottom: 1px solid #ccc;" @click="upDataStatus(1)">开始调度</div>
            <div v-if="distance_status===2||distance_status===3" style="border-bottom: 1px solid #ccc;"
                 @click="upDataStatus(2)">去哪儿</div>
            <div @click="showItem = false">求救电话</div>
          </div>
          <div slot="reference"><i class="el-icon-more"></i> 更多</div>
        </el-popover>
      </div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showItem: false
      };
    },
    props: ['bikeData', 'distance_status'],
    mounted() {
    },
    methods: {
      upDataStatus(n) {
        this.showItem = false;
        this.$emit('upDataStatus', n);
      }
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/css/public";

  #content {
    color: #666666;
  }

  .outer {
    div {
      padding: 6px;
      margin-bottom: -1px;
    }
  }

  header {
    line-height: 42px;
    border-bottom: @border1px;
    padding-left: 12px;
    font-size: 14px;
  }

  main {
    height: 100px;
    font-size: 14px;
    padding: 6px 12px;
    justify-content: space-between;
    align-items: center;
    img {
      width: 120px;
    }
  }

  footer {
    border: @border1px;
    div {
      flex: 1;
      line-height: 44px;
      text-align: center;
    }
    p {
      width: 1px;
      background: #e4e7ed;
    }
  }
</style>
