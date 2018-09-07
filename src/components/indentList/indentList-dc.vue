<template>
  <div id="">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label='有人车'></el-tab-pane>
      <el-tab-pane label='无人车'></el-tab-pane>
    </el-tabs>
    <header-router>
     <span slot="right">
        {{routerName}}
      </span>
    </header-router>
    <div class="content" ref="viewBox">
      <ul ref="chatContainer">
        <li class="flex justify-between list" v-for="(item , i) in list" :key="i">
          <div class="list-left">
            <div style="font-size: 20px">灵铱单车</div>
            <div style="color: #999;font-size: 14px">
              <div>{{item.begin_time}}<span style="margin-left: 12px">{{item.begin_position_name}}</span></div>
              <div>{{item.end_time}}<span style="margin-left: 12px">{{item.end_position_name}}</span></div>
              <div>车牌号：{{item.bike_number}}</div>
            </div>
          </div>
          <div style="margin:auto 0" @click="goItem(item.distance_id)">
            <el-button v-if="item.distance_status===1" type="primary">进行中</el-button>
            <el-button v-if="item.distance_status===2" type="warning">待支付</el-button>
            <el-button v-if="item.distance_status===3" type="success">已完成</el-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerRouter from 'common/header/header-router';
  import {mapMutations, mapGetters} from 'vuex';
  import * as USER from "assets/js/user";

  export default {
    data() {
      return {
        activeName: "0",
        list: [],
        count: 0,
        page: 1
      };
    },
    computed: {
      ...mapGetters(['routerName'])
    },
    methods: {
      ...mapMutations({
        setRouterName: 'SET_ROUTERNAME'
      }),
      getDistanceRetrieveListByParms() {
        if (this.count && this.count === this.list.length) {
          this.$message('没有更多了');
          return false;
        }
        let self = this;
        const ret = function (ret) {
          self.count = ret.data.count;
          self.page++;
          self.list = [...self.list, ...ret.data.list];
        };
        const url = 'yourengongxiangdanche/Distance/RetrieveListByParms';
        USER.ajax(url, 'GET', {pageIndex: this.page}, ret);
      },
      goItem(distanceId) {
        this.$router.push({
          name: 'employ-dc',
          query: {
            prop_distance_id: distanceId
          }
        });
      },
      handleClick(tab, event) {
        if (tab.index === '0') {
          this.$router.push({name: 'employ-dc'});
        }
        if (tab.index === '1') {
          this.$router.push({name: 'employ-wrc'});
        }
      },
      contentScroll() {
        let box = this.$refs.viewBox;
        box.addEventListener('scroll', () => {
          let ulH = this.$refs.chatContainer.scrollHeight;
          if (ulH === box.scrollTop + box.clientHeight - 24) {
            this.getDistanceRetrieveListByParms();
          }
        }, false);
      }
    },
    mounted() {
      this.setRouterName('共享单车→我的订单');
      this.getDistanceRetrieveListByParms();
      this.contentScroll();
    },
    components: {
      headerRouter
    }
  };
</script>

<style scoped lang="less">
  @import '../../assets/css/public.less';

  .content {
    border: @border1px;
    padding: 12px;
    overflow: auto;
    height: 440px;
    min-height: 440px;
    position: relative;
  }

  .list {
    border-bottom: @border1px;
    margin-bottom: 12px;
    padding: 0 0 12px 0;
    .list-left {
      color: @mainColor;
      line-height: 22px;
    }
  }
</style>
