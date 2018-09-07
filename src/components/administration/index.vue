<template>
  <div id="">
    <!--<div class="header-text">{{header.titleText}}</div>-->
    <Header :headText="header.headText" :tabItems.sync="header.items"></Header>
    <div class="content clearfloat">
      <!--<div style="margin-bottom: 15px"></div>-->
      <el-menu
        default-active="1"
        class="el-menu-vertical">
        <!--@open="handleOpen"-->
        <!--@close="handleClose"-->
        <el-menu-item index="1">
          <i class="iconfont icon-guanlizhongxin"></i>
          <span slot="title">车辆管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="iconfont icon-msnui-camera"></i>
          <span slot="title">车辆监控</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="iconfont icon-xiuliweihu"></i>
          <span slot="title">车辆报修管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="iconfont icon-zhexiantu"></i>
          <span slot="title">收入统计</span>
        </el-menu-item>
      </el-menu>
      <div class="right-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Header from 'common/header/header';

  export default {
    data() {
      return {
        activeName: '0',
        header: {
          titleText: '首页',
          headText: '约车系统',
          items: [
            {
              name: '租车',
              url: 'http://www.baidu.com'
            },
            {
              name: '出租车',
              url: 'http://www.baidu.com'
            },
            {
              name: '顺租车',
              url: 'http://www.baidu.com'
            },
            {
              name: '代驾',
              url: 'http://www.baidu.com'
            },
            {
              name: '共享单车',
              url: 'http://www.baidu.com'
            }
          ]
        }
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.index === '0') {
          this.$router.push({name: 'employY'});
        }
        if (tab.index === '1') {
          this.$router.push({name: 'employN'});
        }
      }
    },
    components: {
      Header
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/css/public";

  .content {
    min-height: 700px;
    border-bottom: 1px solid #e4e7ed;
    overflow: hidden;
  }
  .el-menu{
    border-right: none;
  }
  .header-text {
    line-height: 34px;
    color: @mainColor;
    font-size: 18px;
    border-bottom: 1px solid #e4e7ed;
    margin: 0px 0 10px 0;
    font-weight: 600;
  }

  .el-menu-vertical {
    width: 146px;
    height: 100%;
    float: left;
  }

  .right-content {
    float: right;
    background: #f5f5f5;
    width: calc(100% - 147px);
    height: 100%;
  }
  .el-menu-vertical i{
    font-size: 20px;
    margin-right: 6px;
  }
</style>
