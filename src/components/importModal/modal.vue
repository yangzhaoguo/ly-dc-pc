<template>
  <div class="modal">
    <slot></slot>
  </div>
</template>

<script>
  export default {};
</script>

<style scoped lang="less">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 100000;
  }
</style>
