<template>
  <div>
    <modal v-show="show">
      <div class="content">
        <div class="header">
          <span class="el-icon-close" @click="close()"></span>
        </div>
        <div>
          <input class="input" v-model="bikeNumber">
        </div>
        <div class="button">
          <div><img src="../../assets/img/saoma.png"/></div>
          <div><img src="../../assets/img/shoudiantong.png"/></div>
        </div>
        <div class="foot-button">
          <el-button class="button" type="primary" v-bind:disabled="bikeNumber.length<6">
            立即用车
          </el-button>
        </div>

      </div>
    </modal>
  </div>
</template>
<script>
  import modal from './modal.vue';
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    data() {
      return {
        bikeNumber: ""
      };
    },
    methods: {
      close() {
        this.$emit('update:show', false);
      }
    },
    components: {
      ElButton,
      modal
    },
    props: {
      show: {
        type: Boolean,
        required: true
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/css/public";

  .content {
    margin: 330px auto 0;
    width: 60%;
    background: #ffffff;
    overflow: hidden;
    .header {
      line-height: 40px;
      padding-right: 12px;
      text-align: right;
      color: #666;
    }
    .input {
      border-bottom: @border1px;
      margin: 20px auto;
      display: block;
      height: 40px;
      font-size: 22px;
      width: 220px;
      padding: 0 22px 0 22px;
      outline: medium;
    }
    .button {
      display: flex;
      justify-content: space-around;
      div {
        border-radius: 100%;
        border: @border1px;
        padding: 6px;
        text-align: center;
        img {
          width: 28px;
        }
      }
    }
    .foot-button {
      margin-top: 20px;
      text-align: center;
      font-size: 20px;
      color: #ffffff;
      background: @mainColor;
      .button {
        width: 100%;
        border-radius: 0;
      }
    }
  }
</style>
