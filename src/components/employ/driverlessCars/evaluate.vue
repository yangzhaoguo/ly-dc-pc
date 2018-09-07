<!--评价-->
<template>
  <div id="evaluate">
    <div style="margin: 0 auto; height: 56px">
      <el-rate
        show-text
        v-model="value"></el-rate>
    </div>

    <el-checkbox-group v-model="checkboxGroup">
      <el-checkbox-button v-for="city in evaluateList" :label="city" :key="city">{{city}}</el-checkbox-button>
    </el-checkbox-group>

    <el-input style="width: 400px;margin:12px auto 24px ;" v-model="remark" placeholder="其他想说的（将匿名延迟告知司机）"></el-input>
    <br>
    <el-button @click.native="postEvaluate" style="width: 400px" type="primary">提交</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
  import * as USER from '../../../assets/js/user';

  export default {
    components: {ElButton},
    data() {
      return {
        value: 0,
        evaluateList: ['驾驶不稳', '未送达制定地点', '车内不够整洁', '服务态度不好'],
        checkboxGroup: [],
        remark: ''
      };
    },
    props: ['distance_id', 'showEvaluate'],
    methods: {
      postEvaluate() {
        const data = {
          "discuss_content": this.checkboxGroup.join(','),
          "distance_id": this.distance_id,
          "remark": this.remark,
          "star_level": this.value
        };
        const url = 'wurengongxiangdanche/Discuss/Create';
        const ret = (r) => {
          console.log(r);
          if (r.status === 1) {
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          } else {
            this.$message.error(r.message);
          }
        };
        USER.ajax(url, 'POST', data, ret);
      }
    },
    mounted() {
      console.log(this.distance_id);
    }
  };
</script>
<style lang="less">
  @import '~assets/css/public.less';

  #evaluate {
    .el-checkbox-group {
      width: 400px;
      justify-content: space-between;
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
    }
    .el-checkbox-button {
      border-radius: 4px !important;
    }
    .el-checkbox-button__inner {
      margin-top: 12px;
      width: 190px;
      border-left: 1px solid #dcdfe6;
    }
    .el-checkbox-button .el-checkbox-button__inner {
      border-radius: 4px !important;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner, .is-focus .el-checkbox-button__inner {
      border-left: 1px solid #00a0e9;
    }
    .el-rate__item {
      i {
        font-size: 28px;
      }
    }
    .el-rate__text {
      display: block;
      margin-top: 6px;
      font-size: 16px;
    }
  }
</style>
<style scoped lang="less">
  @import '~assets/css/public.less';

</style>
