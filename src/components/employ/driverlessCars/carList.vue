<template>
  <div id="">
    <div class="list" v-if="nearbyCarList.length>0">
      <ul style="max-height: 500px;overflow:auto">
        <li v-if="item.bike_status==1" v-for="(item,index) in nearbyCarList" :key="index" class="item" @click="selectCarfn(item)">
          <div class="flex item-top">
            <div>
              <img class="car-img" :src="item.image_path" :onerror="errImg">
            </div>
            <div class="car-text">
              <div class="number">{{item.bike_number}}</div>
              <div class="position">{{item.position_name}}</div>
            </div>
            <div style="flex: 1"></div>
            <div class="el-icon-arrow-right icon-r"></div>
          </div>
          <div class="flex justify-between item-foot">
            <div>
              <span v-if="item.lease_type===1">个人</span>
              <span v-if="item.lease_type===2">公司</span>
              ：{{item.lessor_name}}
            </div>
            <div class="foot-l">{{item.bike_distance}} km</div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else style="text-align: center">附近暂无共享车</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import errImg from "../../../assets/img/error-img.png";

  export default {
    data() {
      return {
        errImg: 'this.src="' + errImg + '"'
      };
    },
    props: ['carItemDialog', 'nearbyCarList', 'selectCar'],
    methods: {
      selectCarfn(item) {
        this.$emit('update:carItemDialog', true);
        this.$emit('update:selectCar', item);
        console.log(this.nearbyCarList);
      }
    },
    created() {
    }
  };
</script>

<style scoped lang="less">
  .list {
    .item {
      padding-bottom: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid #cccccc;
      .item-top {
        height: 60px;
        .car-img {
          width: 80px;
          height: 60px;
          margin-right: 26px;
        }
        .car-text {
          .number {
            color: #999999;
          }
          .position {
            margin-top: 14px;
          }
        }
        .icon-r {
          line-height: 60px;
          font-size: 22px;
        }
      }
      .item-foot {
        line-height: 40px;
        .foot-l {
          color: orange;
        }
      }
    }
  }
</style>
