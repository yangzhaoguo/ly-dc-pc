<template>
  <div id="header" class="header">
    <div class="content">
      <div class="header-top">{{headText}}</div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item ,index) in tabItems" :label=item.name :key=index></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        activeName: '4'
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.index === '4') {
          return false;
        }
        window.location.href = this.tabItems[tab.index].url;
      }
    },
    props: ['tabItems', 'titleText', 'headText']
  };
</script>

<style scoped lang="less" type="text/less">
  @import '../../assets/css/public';

  #header {
    margin: 0 auto 6px;
    position: relative;
  }

  .header-text {
    line-height: 34px;
    color: @mainColor;
    font-size: 18px;
    border-bottom: 1px solid #e4e7ed;
    margin: 0px 0 10px 0;
    font-weight: 600;
  }

  .header-top {
    background: @mainColor;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    text-align: center;
    font-size: 16px;
    margin-bottom: 10px;
    position: relative;
  }
  .content {
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
  }
</style>
