<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  };
</script>
<style lang="less">
  @import 'assets/css/reset.css';
  @import 'assets/fonts/iconfont.css';
  @import 'assets/css/public.less';
  @import 'assets/css/style.css';
  #header .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    background: @mainColor;
    color: #ffffff;
  }
  .el-tabs__header{
    margin-bottom: 0;
  }
</style>
