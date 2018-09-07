<template>
  <div id="">
    <div class="title-text clear-float">
      <div class="f-l">
        <span style="color: #333;">当前位置</span>
        <slot name="right"></slot>
      </div>
      <div class="f-r">
        <slot name="left"></slot>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {};
    }
  };
</script>

<style scoped lang="less">
  @import "~@/assets/css/public";

  .title-text {
    font-size: 12px;
    padding: 12px;
    position: relative;
    color: @mainColor;
    border: @border1px;
    border-top: 0;
    a {
      color: @mainColor;
    }
    .f-r {
      span {
        margin-left: 30px;
      }
    }
  }
</style>
