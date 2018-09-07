<template>
  <div>
    <div class="header">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label='有人车'></el-tab-pane>
        <el-tab-pane label='无人车'></el-tab-pane>
      </el-tabs>
    </div>
    <header-router>
     <span slot="right">
        {{routerName}}
      </span>
      <span slot="left">
        <router-link :to="{name:'indentListDc'}">我的订单</router-link>
      </span>
    </header-router>
    <div style="position: relative">
      <div id="container" class="mymap"></div>
      <!--扫码用车-->
      <el-button @click.native='userInfoStatus' v-if="bikeType===0" class="open-serve-button" type="primary">
        扫码用车
      </el-button>
      <!--获得密码-->
      <div v-if="bikeType===1&&countDownOver===false">
        <div class="hint">
          120秒后将自动开始计费（计费说明：1元/小时）。请检查车况。如有问题请报修。
        </div>
        <div class="hint clear-float" style="top: 60px;margin-left: -105px">
          <countDown class="f-l" :yancheTime="120" :begin_time='begin_time' v-on:overTime="overTime"></countDown>
          <div class="f-l" style="line-height: 48px;margin-left: 20px">即将开始计费</div>
        </div>
        <div class="bike-details">
          <div class="header"><span>&nbsp;车牌号{{bike_number}}&nbsp;</span></div>
          <div style="text-align: center;line-height: 32px;font-size: 22px">解锁码</div>
          <div class="possword flex justify-center">
            <div v-for="(item,index) in bike_unlock_code.split('')" :key="index">{{item}}</div>
          </div>
          <div style="text-align: center;color: #999;">请检查车况，如有车辆有问题请报修</div>
          <div style="margin: 4px auto;text-align: center">
            <img class="shoudiantong" src="../../../assets/img/shoudiantong.png" alt="">
          </div>
          <div class="fotter">
            <div>如何开锁</div>
            <div>
              <router-link :to="{name:'repair',params:{bike_id:bike_id,bike_number:bike_number}}">
                <span style="display: block">车辆报修</span>
              </router-link>
            </div>
            <div>联系客服</div>
          </div>
        </div>
      </div>
      <!--骑行中-->
      <div v-if="bikeType===1&&countDownOver===true">
        <div class="hint" style="margin-left:-192px;">
          共享单车已经为您本次出行购买了 <a href="#">《安全保险》</a>
        </div>
        <div class="hint" style="top: 60px;margin-left: -123px">
          骑行时间 <span class="text">{{compute_time}}</span> 丨 <span class="text">{{compute_expense}}</span>元
        </div>
        <div class="bike-details" style="height: 145px;">
          <div class="header"><span>&nbsp;车牌号{{bike_number}}&nbsp;</span></div>
          <div class="text">
            骑行结束后，请手动关锁并打乱密码
          </div>
          <div class="fotter">
            <el-button @click.native="indentComplete" style="margin: 12px auto;width: 40%;" type="primary">结束行程
            </el-button>
          </div>
        </div>
      </div>
      <!--等待支付-->
      <div v-if="bikeType===2||bikeType===3">
        <div v-if="bikeType===2" class="hint" style="margin-left:-192px;">
          共享单车已经为您本次出行购买了 <a href="#">《安全保险》</a>
        </div>
        <div class="bike-details" style="">
          <div class="header">
            <div><span>&nbsp;车牌号{{bike_number}}&nbsp;</span></div>
            <div style="color: #666;line-height: 32px;margin-top: 6px">
              骑行时间 <b>{{distance_time}}</b>分钟，骑行距离 <b>{{distance_mileage}}</b>公里
            </div>
          </div>
          <div class="text">
            联系客服
          </div>
          <div style="text-align: center">
            <div style="font-size: 40px;line-height: 46px"> {{expense}}元</div>
            <div @click="goBillItem" style="color:#999;line-height: 32px;margin-bottom:6px;">
              <!--&nbsp;&nbsp;&nbsp;查看明细 <span class="el-icon-arrow-right"></span>-->
            </div>
          </div>
          <div class="fotter">
            <el-button @click.native="payDistanceOrder" v-if="bikeType===2" style="margin: 12px auto;width: 40%;"
                       type="primary">去支付
            </el-button>
            <div v-if="bikeType===3" style="margin: 12px auto;width: 40%;">
              支付方式:  <b>微信支付</b>
            </div>
          </div>
          <div v-if="bikeType===3" class="go-back" @click="overBake()">
            <span>返回</span>
          </div>
        </div>
      </div>
    </div>
    <import-modal :show.sync="showImportModal"></import-modal>
  </div>
</template>
<script>
  import * as USER from "assets/js/user";
  import headerRouter from '../../../common/header/header-router';
  import importModal from '../../importModal/importModal.vue';
  import bikeIcon from '../../../assets/img/bike-icon.png';
  import countDown from 'common/countDown/count_down';
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  let gdmap, geolocation, circle, infoWindow;
  let markers = []; //地图api
  export default {
    data() {
      return {
        activeName: '0',
        countDownOver: false,
        begin_time: 0, //开始时间戳
        use_time: '',
        firstopen: false, //判断第一次打开页面
        bikeType: 0, //单车状态
        showImportModal: false, //输入解锁码的模态框
        bike_number: "", //单车号码
        bike_id: "", //单车id
        bike_unlock_code: '', //解锁码
        distance_id: '', //骑行id
        distance_time: '', //骑行时间
        distance_expense: '', // 骑行费用
        distance_mileage: '', //骑行距离
        bikePositionRetrieveListByDistanceId: [], //骑行轨迹
        compute_time: '', //计算骑行时间
        compute_expense: '', //骑行费用
        begin_position_name: '' //下单位置
      };
    },
    computed: {
      ...mapGetters([
        'routerName',
        'position',
        'windowMessage'
      ]),
      expense() {
        var value = this.distance_expense;
        value = Math.round(parseFloat(value) * 100) / 100;
        var xsd = value.toString().split(".");
        if (xsd.length === 1) {
          value = value.toString() + ".00";
          return value;
        }
        if (xsd.length > 1) {
          if (xsd[1].length < 2) {
            value = value.toString() + "0";
          }
          return value;
        }
      }
    },
    components: {
      countDown,
      headerRouter,
      importModal
    },
    methods: {
      ...mapMutations({
        setPostiton: 'SET_POSITION',
        setWindowMessage: 'SET_WINDOWMESSAGE',
        setRouterName: 'SET_ROUTERNAME'
      }),
      ...mapActions([]),
      //初始化地图 2
      map_init() {
        if (!this.gdmap) {
          gdmap = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 14
          });
        }
        let time, computeTimesetInterval;
        if (this.bikeType === 1) {
          this.createdGeolocation();
          time = setInterval(() => {
            this.createdGeolocation();
          }, 30000);
          computeTimesetInterval = setInterval(() => {
            this.computeTime();
          }, 1000);
        } else if (this.bikeType === 2 || this.bikeType === 3) {
          this.createdGeolocation();
          clearInterval(time);
          clearInterval(computeTimesetInterval);
        } else {
          this.geolocation();
          clearInterval(time);
          clearInterval(computeTimesetInterval);
        }
      },
      //下单前地图定位
      geolocation() {
        //浏览器定位
        gdmap.plugin('AMap.Geolocation', () => {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
//            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RT',
            zoomToAccuracy: true
          });
          gdmap.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            this.setPostiton([]); //清空定位信息重新赋值
            let position = [];
            position.push(data.position.getLng());
            position.push(data.position.getLat());
            this.setPostiton(position);
            //console.log(str); //返回定位信息
            if (!this.firstopen) {
              this.firstopen = true;
              this.circle();
              this.regeocoder();
              this.addListendrag();
            }
            var time = setTimeout(function () {
              var center = document.getElementsByClassName('amap-marker')[0];
              if (center) {
                center.style.zIndex = 130;
                AMap.event.addDomListener(center, 'click', function () {
                  infoWindow.open(gdmap, this.position);
                }, true);
              } else {
                clearTimeout(time);
              }
            }, 100);
          });
          AMap.event.addListener(geolocation, 'error', () => {
            this.$message.error('定位失败');
            this.addListendrag();
          });
        });
      },
      //下单后地图定位
      createdGeolocation() {
        let self = this;
        AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
          //启动页面
          if (self.bikeType === 2 || self.bikeType === 3) {
            let beginPosition = []; //起点
            let lng1 = self.bikePositionRetrieveListByDistanceId[0].bike_longitude;
            let lat1 = self.bikePositionRetrieveListByDistanceId[0].bike_latitude;
            beginPosition.push(lng1);
            beginPosition.push(lat1);
            self.initPage(SimpleMarker, '起', beginPosition, 'white', 'blue');
            let overPosition = []; //终点
            let lng2 = self.bikePositionRetrieveListByDistanceId[self.bikePositionRetrieveListByDistanceId.length - 1].bike_longitude;
            let lat2 = self.bikePositionRetrieveListByDistanceId[self.bikePositionRetrieveListByDistanceId.length - 1].bike_latitude;
            overPosition.push(lng2);
            overPosition.push(lat2);
            self.initPage(SimpleMarker, '终', overPosition, 'white', 'red');
            self.pathSimplifier();
          }
        });
        gdmap.plugin('AMap.Geolocation', () => {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
//            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RT',
            zoomToAccuracy: true,
            showButton: false,
            showMarker: false
          });
          gdmap.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            var str = ['定位成功'];
            str.push('LNG：' + data.position.getLng());
            str.push('LAT：' + data.position.getLat());
            this.setPostiton([]); //清空定位信息重新赋值
            var position = [];
            position.push(data.position.getLng());
            position.push(data.position.getLat());
            this.setPostiton(position);
            if (data.accuracy) {
              str.push('精度：' + data.accuracy + ' 米');
            } //如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            //console.log(str); //返回定位信息
            self.regeocoder();
            if (self.bikeType === 1) {
              //上传经纬度
              self.postPosition(data.position.getLng(), data.position.getLat());
              //绘制定位图标
              let m = {};
              m.position = position;
              m.icon = bikeIcon;
              self.marker([m]);
            }
          });
          AMap.event.addListener(geolocation, 'error', () => {
            this.$message.error('定位失败');
            this.addListendrag();
          });
        });
      },
      //上传定位
      postPosition(lng, lat) {
        let self = this;
        let data = {
          "bike_id": this.bike_id,
          "bike_latitude": lat,
          "bike_longitude": lng,
          "bike_number": this.bike_number
        };
        const ret = function (ret) {
          const retChild = function (r) {
            console.log('上传了一次定位');
            let beginPosition = []; //起点
            let lng = r.data.bikePositionRetrieveListByDistanceId[0].bike_longitude;
            let lat = r.data.bikePositionRetrieveListByDistanceId[0].bike_latitude;
            beginPosition.push(lng);
            beginPosition.push(lat);
            AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
              self.initPage(SimpleMarker, '起', beginPosition, 'white', 'blue');
            });
          };
          const url = 'yourengongxiangdanche/Distance/RetrieveDetailOfInProgress';
          USER.ajax(url, 'GET', {}, retChild, 30000, false);
        };
        const url = 'yourengongxiangdanche/BikePosition/Create';
        USER.ajax(url, 'POST', data, ret, 30000, false);
      },
      //插入ui标注
      initPage(SimpleMarker, innerHTML, position, color, iconStyle) {
        //创建SimpleMarker实例
        // eslint-disable-next-line
        new SimpleMarker({
          //前景文字
          iconLabel: {
            innerHTML: innerHTML,
            style: {
              color: color
            }
          },
          //图标主题
          iconTheme: 'default',
          //背景图标样式
          iconStyle: iconStyle,
          map: gdmap,
          position: position
        });
      },
      //绘制圆形区域
      circle() {
        let _self = this;
        circle = new AMap.Circle({
          center: new AMap.LngLat(_self.position[0], _self.position[1]), // 圆心位置
          radius: 700, //半径
          strokeColor: "#409eff", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: "#409eff", //填充颜色
          fillOpacity: 0.1 //填充透明度
        });
        circle.setMap(gdmap);
      },
      //地图弹框
      infoWindow() {
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], (SimpleInfoWindow) => {
          infoWindow = new SimpleInfoWindow({
            infoTitle: `<style>
                          .amap-ui-infowindow-body{display: none}
                          strong{font-weight: 700}
                          .amap-ui-infowindow-title{padding:5px 24px 5px 5px;border:none;font-size: 15px;}
                        </style>
                      您在<strong> ${this.windowMessage} </strong>附近`,
            enableCloseOnClick: true,
            size: 8
          });
          infoWindow.open(gdmap, this.position);
          infoWindow.get$Container().on('click', (event) => {
//            alert('windowMessage 的点击事件');
          });
        });
      },
      //逆地理编码
      regeocoder() {
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(this.position, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              var way = result.regeocode.addressComponent.street ? result.regeocode.addressComponent.street : result.regeocode.addressComponent.district;
              this.setWindowMessage(way + " " + result.regeocode.aois["0"].name);
              this.infoWindow();
            }
          }
        );
      },
      //绘制地图小图标
      marker(m) {
        gdmap.remove(markers);
        markers = [];
        m.forEach((item) => {
          /*eslint-disable*/
          let maker = new AMap.Marker({
            map: gdmap,
            position: [item.position[0], item.position[1]],
            icon: new AMap.Icon({
              image: item.icon,
              size: new AMap.Size(64, 64),
              imageSize: new AMap.Size(50, 50)

            }),
          });
          markers.push(maker);
        });
      },
      //骑行轨迹绘制
      pathSimplifier() {
        let self = this;
        AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {

          if (!PathSimplifier.supportCanvas) {
            self.$alert('当前环境不支持 查看骑行轨迹');
            return;
          }
          //启动页面
          initPage(PathSimplifier);
        });

        function initPage(PathSimplifier) {
          //创建组件实例
          var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: gdmap, //所属的地图实例
            getPath: function (pathData, pathIndex) {
              //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
              return pathData.path;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              //返回鼠标悬停时显示的信息
              if (pointIndex >= 0) {
                //鼠标悬停在某个轨迹节点上
                return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
              }
              //鼠标悬停在节点之间的连线上
              return pathData.name + '，点数量' + pathData.path.length;
            },
            renderOptions: {
              //轨迹线的样式
              pathLineStyle: {
                strokeStyle: 'red',
                lineWidth: 6,
                dirArrowStyle: true
              }
            }
          });
          let list = []; //轨迹集合
          self.bikePositionRetrieveListByDistanceId.forEach((item) => {
            let position = [];
            let lng = item.bike_longitude;
            let lat = item.bike_latitude;
            position.push(lng);
            position.push(lat);
            list.push(position);
          });
          //这里构建两条简单的轨迹，仅作示例
          pathSimplifierIns.setData([{
            name: '骑行轨迹',
            path: list
          }]);
        }
      },
      //地图拖拽事件
      addListendrag() {
        let self = this;
        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
          var positionPicker = new PositionPicker({
            mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: gdmap //依赖地图对象
          });
          // TODO事件绑定、结果处理等
          positionPicker.start();
          positionPicker.on('success', function (positionResult) {
            self.t = positionResult.position.lat;
            self.g = positionResult.position.lng;
            self.getAroundBike(positionResult.position.lng, positionResult.position.lat);
          });
        });
      },
      //获取地图中心点单车
      getAroundBike(lng, lat) {
        let self = this;
        let data = {
          "longitude": self.l,
          "latitude": lat
        };

        function ret(r) {
          if (r.status !== 1) {
            alert(r.message);
            return
          }
          let arrar = [];
          r.data.list.forEach((item) => {
            let data = {};
            let position = [];
            position.push(item.bike_longitude);
            position.push(item.bike_latitude);
            data.position = position;
            data.icon = bikeIcon;
            arrar.push(data);
          });
          self.marker(arrar);
        }

        const url = 'yourengongxiangdanche/BikePosition/RetrieveListByParms';
        USER.ajax(url, 'GET', data, ret, 30000, false);
      },
      //获取用户骑车状态 1
      getUserStatus(id) {
        let self = this;
        const ret = function (r) {
          console.log(r)
          if (r.status !== 1) {
            alert(r.message);
            return
          }
          if (!r.data) {
            self.bikeType = 0;
          } else {
            self.bikeType = r.data.distance_status;
            try {
              self.distance_id = r.data.distance_id;
              self.bike_number = r.data.bike_number;
              self.begin_time = new Date(r.data.begin_time).getTime();
              console.log(new Date(r.data.begin_time));
              self.bike_unlock_code = r.data.bike_unlock_code ? r.data.bike_unlock_code : "";
              self.distance_time = r.data.distance_time;
              self.distance_mileage = r.data.distance_mileage;
              self.distance_expense = r.data.distance_expense;
              self.bikePositionRetrieveListByDistanceId = r.data.bikePositionRetrieveListByDistanceId;
              self.begin_position_name = r.data.begin_position_name;
              self.bike_id = r.data.bike_id;
              self.computeTime()
            } catch (err) {
              console.log(err);
            }
          }
          self.map_init();
        };
        if (id) {
          let data = {
            distance_id: id
          };
          const url = 'yourengongxiangdanche/Distance/RetrieveDetailByDistanceId';
          USER.ajax(url, 'GET', data, ret, 30000, false);
        } else {
          const url = 'yourengongxiangdanche/Distance/RetrieveDetailOfInProgress';
          USER.ajax(url, 'GET', {}, ret, 30000, false);
        }
      },
      //获取用户认证和押金状态 2
      userInfoStatus() {
        let self = this;
        const ret = function (r) {
//          if (r.data === 0) {
//            self.$router.push({name: 'protocol'})
//          } else if (r.data === 1) {
//            self.getBikePwd(111111);
//          } else if (r.data === 2) {
//            self.getBikePwd(123456);
//          }
          self.getBikePwd(111111);
        };
        const url = 'yourengongxiangdanche/UserInfo/RetrieveIsPayDeposit';
        USER.ajax(url, 'GET', {}, ret, 30000, false);
      },
      //获取单车解锁码 3
      getBikePwd(bike_number) {
        var self = this;
        let data = {
          bike_number: bike_number
        };
        const ret = function (r) {
          if (!r.data) {
            self.$message({
              showClose: true,
              message: '输入单车牌号有误',
              type: 'error'
            });
            return false;
          }
          self.bike_unlock_code = r.data.bike_unlock_code;
          self.createIndent(r.data.bike_id, r.data.bike_number)
        };
        const url = 'yourengongxiangdanche/Bike/RetrieveBikeUnlockCodeByBikeNumber';
        USER.ajax(url, 'GET', data, ret, 30000, false);
      },
      //新增订单 4
      createIndent(bike_id, bike_number) {
        var self = this;
        const data = {
          bike_id: bike_id,
          bike_number: bike_number
        };
        const ret = function (r) {
//          console.log(r);
          self.getUserStatus();
        };
        const url = 'yourengongxiangdanche/Distance/Create';
        USER.ajax(url, 'POST', data, ret);
      },
      //结束骑行 5
      indentComplete() {
        let self = this;
        this.$confirm('确定结束骑行么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {
            "distance_id": this.distance_id,
            "end_position_name": this.windowMessage
          };
          const ret = (r) => {
            self.getUserStatus();
          };
          const url = 'yourengongxiangdanche/Distance/Update';
          USER.ajax(url, "POST", data, ret);
        }).catch(() => {
        });
      },
      //支付费用 6
      payDistanceOrder() {
        let self = this;
        let data = {
          "distance_id": this.distance_id,
          "pay_method": 1
        };

        const ret = function (r) {
          if (r.status === 1) {
            self.bikeType = 3;
          } else {
            alert(r.message);
          }
        };
        const url = "yourengongxiangdanche/Distance/PayDistanceOrder";
        USER.ajax(url, 'POST', data, ret);
      },
      //结束倒计时状态
      overTime() {
        this.countDownOver = true;
      },
      //路由跳转我的订单
      goBillItem() {
        this.$router.push({name: 'indentListDc'});
      },
      //计算经过的时间
      computeTime() {
        var nowTime = new Date().getTime();
        var benginTime = new Date(this.begin_time).getTime();
        var nTime = nowTime - benginTime;
        var days = Math.floor(nTime / (24 * 3600 * 1000));
        //计算出小时数
        var leave1 = nTime % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);  //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);

        this.compute_time = `${minutes}分${seconds}秒`;
        if (hours > 0) {
          this.compute_time = `${hours}小时${minutes}分${seconds}秒`;
        }
        this.compute_expense = Math.floor(hours + 1);
      },
      handleClick(tab, event) {
        if (tab.index === '0') {
          this.$router.push({name: 'employ-dc'});
        }
        if (tab.index === '1') {
          this.$router.push({name: 'employ-wrc'});
        }
      },
      overBake() {
        if (this.$route.query.prop_distance_id) {
          this.$router.back(-1)
        } else {
          this.bikeType = 0;
        }
      }
    },
    mounted() {
    },
    created() {
      if (this.$route.query.prop_distance_id) {
        this.setRouterName('→共享单车→订单详情');
        this.getUserStatus(this.$route.query.prop_distance_id);
        this.rightName = [];
      } else {
        this.setRouterName('→共享单车');
        this.getUserStatus();
      }
    }
  };
</script>
<style scoped lang="less">
  @import '~assets/css/public.less';

  .mymap {
    width: 100%;
    height: 600px;
    position: relative;
  }

  .open-serve-button {
    position: absolute;
    top: 520px;
    left: 50%;
    width: 30%;
    margin-left: -15%;
    z-index: 1000;
  }

  .title-text {
    font-size: 12px;
    padding: 12px;
    color: @mainColor;
  }

  .hint {
    position: absolute;
    padding: 16px 22px 16px 22px;
    top: 6px;
    left: 50%;
    z-index: 800;
    margin-left: -300px;
    background: #ffffff;
    border-radius: 6px;
    .text {
      text-align: center;
      color: orange;
    }
  }

  .bike-details {
    position: absolute;
    bottom: 6px;
    left: 20%;
    width: 60%;
    border-radius: 14px;
    background: #fff;
    z-index: 999;
    .header {
      padding: 8px;
      text-align: center;
      border-bottom: @border1px;
      line-height: 22px;
      span {
        background: #cccccc;
        border-radius: 3px;
      }
    }

    .text {
      text-align: center;
      color: #999;
      line-height: 40px;
      border-bottom: @border1px;
    }

    .possword {
      div {
        width: 60px;
        height: 60px;
        background: #F5F5F5;
        margin: 6px;
        line-height: 60px;
        text-align: center;
        font-size: 40px;
        border: @border1px;
      }
    }
    .fotter {
      display: flex;
      div {
        flex: 1;
        border: @border1px;
        text-align: center;
        line-height: 46px;
        color: #777;
      }
    }
  }

  .shoudiantong {
    width: 22px;
    border-radius: 100%;
    border: @border1px;
    padding: 6px;
  }

  .go-back {
    font-size: 14px;
    position: absolute;
    top: 8px;
    right: 14px;
    color: #ccc;
  }
</style>
