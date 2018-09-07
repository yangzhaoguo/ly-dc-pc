<template>
  <div id="">
    <el-row>
      <el-col style='margin-bottom: 12px' :span="24">
        <el-col :span="4">
          上车位置：
        </el-col>
        <el-col :span="20">
          {{beginPositionName}}
        </el-col>
      </el-col>
      <el-col style='margin-bottom: 12px' :span="24">
        <el-col :span="4">
          预约时间：
        </el-col>
        <el-col :span="20">
          {{new Date(beginTime).toLocaleString()}}
        </el-col>
      </el-col>
      <el-col style='margin-bottom: 12px' :span="24">
        <el-col :span="4">
          车牌号码：
        </el-col>
        <el-col :span="20">
          {{selectCar.bike_number}}
        </el-col>
      </el-col>
    </el-row>
    <div class="foot">
      <el-button type="primary" @click.native="makeSure">呼叫单车</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {};
    },
    methods: {
      makeSure() {
        this.$emit('update:visible', false);
        this.$emit('update:visibleItem', false);
        this.$emit('update:carNumber', this.selectCar.bike_number);
        this.$emit('bike_create');
      }
    },
    props: ['selectCar', 'beginTime', 'beginPositionName']
  };
</script>

<style scoped lang="less">
  .foot {
    margin-top: 50px;
    text-align: center;
  }
</style>
