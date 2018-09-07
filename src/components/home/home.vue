<template>
  <div id="">
    <div class="header-text">{{titleText}}</div>
    <Header :headText="header.headText" :tabItems.sync="header.items"></Header>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import Header from 'common/header/header';
  import {mapGetters} from 'vuex';
  export default {
    data() {
      return {
        header: {
          headText: '约车系统',
          items: [
            {
              name: '租车',
              url: 'http://www.lingyi365.com'
            },
            {
              name: '出租车',
              url: 'http://www.lingyi365.com'
            },
            {
              name: '顺租车',
              url: 'http://www.lingyi365.com'
            },
            {
              name: '代驾',
              url: 'http://www.lingyi365.com'
            },
            {
              name: '共享单车',
              url: '#'
            }
          ]
        }
      };
    },
    methods: {

    },
    components: {
      Header
    },
    computed: {
      ...mapGetters([
        'routerName'
      ]),
      titleText() {
        let routerNames = this.routerName.split('→');
        let name = routerNames.pop();
        return name;
      }
    },
    mounted() {
//      console.log(this.routerName);
//      console.log(this.titleText);
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

  .el-menu {
    border-right: none;
  }

  .header-text {
    padding-left: 6px;
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

  .el-menu-vertical i {
    font-size: 20px;
    margin-right: 6px;
  }
</style>
