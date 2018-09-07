<template>
  <div class="wrc">
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
      <!--<span slot="left">-->
      <!--发现-->
      <!--</span>-->
      <span slot="left">
        <router-link :to="{name:'wrIndentListDc'}">我的订单</router-link>
      </span>
    </header-router>

    <div class="select-bar" v-if="distance_status===null">
      <span style="margin-right: 12px;width: 80px;">上车位置:</span>
      <div class="mr-12">
        <el-input :placeholder="currentAddress" @focus="tackForm.mapStatus=true"
                  v-model="adsMsg.nearestPOI"></el-input>
      </div>
      <div style="width: 160px">
        <el-radio v-model="beginType" label="1">现在</el-radio>
        <el-radio v-model="beginType" label="2">预约</el-radio>
      </div>
      <div style="margin-left: 12px" v-show="beginType==='2'">
        <el-date-picker
          v-model="beginTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right">
        </el-date-picker>
      </div>
      <span style="margin-left: 10px;width: 80px;">选择车辆:</span>
      <div class="mr-12">
        <el-input v-model="carNumber" placeholder="请选择车辆" @focus="showCarList"></el-input>
      </div>
      <!--<div>-->
      <!--<el-button type="primary" @click.native="makeSure">呼叫单车</el-button>-->
      <!--</div>-->
    </div>
    <div class="mymap">
      <div id="container"></div>
      <div class="car-details-dialog">
        <car-details-dialog
          v-if="distance_status===1||distance_status===2||distance_status===3||distance_status===4"
          :bikeData="bikeData"
          :distance_status="distance_status"
          @upDataStatus="upDataStatus">
        </car-details-dialog>
      </div>
      <div class="right-title" v-if="distance_status==1">车辆 "<span style="color: orange;">正在等待出发</span>"。</div>
      <div class="right-title" v-if="distance_status==2">车辆 "<span style="color: orange;">正在路上</span>",请耐心等待。</div>
      <div class="right-title" v-if="distance_status==3">车辆 "<span style="color: orange;">已到达</span>",等待乘客上车。</div>
      <div class="right-title" v-if="distance_status==4">车辆 "<span style="color: orange;">行驶中</span>",下车时请'确认下车'，无人车按时间收费!
      </div>

      <div v-if="distance_status===5||distance_status===6">
        <div class="bike-details" style="">
          <div class="header">
            <div><span>&nbsp;车牌号{{distance_data.bike_number}}&nbsp;</span></div>
            <div style="color: #666;line-height: 32px;margin-top: 6px">
              行驶时间 <b>{{distance_data.distance_time}}</b>分钟，行驶距离 <b>{{distance_data.distance_mileage}}</b>公里
            </div>
          </div>
          <div class="text">
            联系客服
          </div>
          <div style="text-align: center">
            <div style="font-size: 40px;line-height: 60px"> {{distance_data.distance_expense}}元</div>
          </div>
          <div class="fotter">
            <el-button @click.native="payDistanceOrder" style="margin: 12px auto;width: 40%;" v-if="distance_status===5"
                       type="primary">去支付
            </el-button>
            <el-button v-if="distance_status==6" @click.native="showEvaluate=true" style="margin: 12px auto;width: 40%;"
                       type="primary">评价
            </el-button>
            <el-button v-if="distance_status==7" style="margin: 12px auto;width: 40%;"
            >已评价
            </el-button>
          </div>
          <div v-if="distance_status==6||distance_status==7" class="go-back" @click="buy_back">
            <span>返回</span>
          </div>
        </div>
      </div>
    </div>
    <select-map v-if="tackForm.mapStatus"
                :info='tackForm'
                :mapssig=[] @closeMap="closeMap"
                @adsMsg="setAdsMsg">
    </select-map>
    <select-map v-if="goEndpPosition.mapStatus"
                :mapssig=[] @closeMap="goEndpPosition.mapStatus=false"
                :info='goEndpPosition'
                @adsMsg="okEndpPosition">
    </select-map>
    <el-dialog
      title="选择车辆"
      :visible.sync="carListDialog"
      width="600px"
      center>
      <car-list :nearbyCarList="nearbyCarList" :carItemDialog.sync="carItemDialog"
                :selectCar.sync="selectCar"></car-list>
      <el-dialog
        width="500px"
        top="200px"
        title="呼叫单车"
        :visible.sync="carItemDialog"
        append-to-body>
        <call-car :selectCar="selectCar"
                  :visible.sync="carListDialog"
                  :visibleItem.sync="carItemDialog"
                  :carNumber.sync="carNumber"
                  :beginTime="computBeginTime"
                  :beginPositionName="adsMsg.nearestPOI"
                  @bike_create="bike_create">
        </call-car>
      </el-dialog>
    </el-dialog>
    <div v-if="showEvaluate">
      <el-dialog
        title="评价"
        :visible.sync="showEvaluate"
        width="520px"
        align="center">
        <evaluate :distance_id="distance_id" :showEvaluate.sync="showEvaluate" style="margin-top: -30px"></evaluate>
      </el-dialog>
    </div>
    <div>
      <button v-if="distance_status==2" @click="wurenchedaoda" style="margin-top: 12px">模拟无人车到达指定位置</button>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-multi-spaces */
  import {mapGetters, mapMutations} from 'vuex';
  import headerRouter from 'common/header/header-router';
  import * as USER from '../../../assets/js/user.js';
  import selectMap from '../../../common/selectMap/selectMap';
  import carList from './carList.vue';
  import callCar from './hujiaodanche.vue';
  import carDetailsDialog from './car-details-dialog.vue';
  import evaluate from './evaluate.vue';
  import WRCbikeIcon from 'assets/img/car-icon.png';
  import BeginIcon from 'assets/img/qidian-icon.png';

  let gdmap, geolocation, circle, infoWindow;
  let markers = []; //地图api
  export default {
    data() {
      return {
        carDetailsShow: true,  //车辆卡片
        carListDialog: false,
        carItemDialog: false,
        firstopen: false,
        showEvaluate: false, //评价
        bikePositionRetrieveListByDistanceId: [], //轨迹数组
        currentAddress: '',
        beginType: '1',
        adsMsg: {},
        beginTime: '',
        activeName: "1",
        routerName: '→共享无人车',
        nearbyCarList: [],
        distance_id: '',
        tackForm: {
          mapStatus: false,
          toChildMap: 'tackCarMap',
          delivery: true,
          cityList: [],
          city: '北京市',
          cityAddress: [],
          adss: '北京T1',
          carLNG: '',
          carLAT: ''
        },
        selectCar: {},
        goEndpPosition: {
          mapStatus: false,
          toChildMap: 'tackCarMap',
          delivery: true,
          cityList: [],
          city: '北京市',
          cityAddress: [],
          adss: '北京T1',
          carLNG: '',
          carLAT: ''
        },
        carNumber: '',
        bikeData: {},
        distance_status: null,  //订单状态
        distance_data: {
          distance_status: null
        }
      };
    },
    components: {
      headerRouter,
      selectMap,
      carList,
      callCar,
      carDetailsDialog,
      evaluate
    },
    computed: {
      ...mapGetters([
        'position',
        'windowMessage'
      ]),
      computBeginTime() {
        if (this.beginType === '1' || this.beginTime === '' || this.beginTime === null) {
          return new Date();
        } else if (this.beginType === '2') {
          return this.beginTime;
        }
      }
    },
    methods: {
      ...mapMutations({
        setPostiton: 'SET_POSITION',
        setWindowMessage: 'SET_WINDOWMESSAGE',
        setRouterName: 'SET_ROUTERNAME'
      }),
      map_init() {
        gdmap = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 16
        });
        console.log(gdmap);
        if (!this.distance_status) {
          this.geolocation();
        } else if (this.distance_status > 0 && this.distance_status < 5) {
          this.distanceStatus();
        }
        if (this.distance_status > 3) {
          this.pathSimplifier();
        }
      },

      geolocation() {
        //浏览器定位
        gdmap.plugin('AMap.Geolocation', () => {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,  //是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
//            zoomToAccuracy: true,  //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB',
            zoomToAccuracy: true
          });
          gdmap.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            var str = ['定位成功'];
            str.push('LNG：' + data.position.getLng());
            str.push('LAT：' + data.position.getLat());
            this.setPostiton([]);   //清空定位信息重新赋值
            var position = [];
            position.push(data.position.getLng());
            position.push(data.position.getLat());
            this.setPostiton(position);
            if (data.accuracy) {
              str.push('精度：' + data.accuracy + ' 米');
            }//如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            if (!this.firstopen) {
              this.firstopen = true;
              this.circle();
              this.regeocoder();
              this.addListendrag();
              this.tackForm.carLNG = data.position.getLng();
              this.tackForm.carLAT = data.position.getLat();
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
      distanceStatus() {
        gdmap.setCenter([this.distance_data.begin_longitude, this.distance_data.begin_latitude]);
        gdmap.remove(markers);
        markers = [];
        /* eslint-disable no-new */
        new AMap.Marker({
          map: gdmap,
          icon: new AMap.Icon({
            image: BeginIcon,
            imageSize: new AMap.Size(30, 30)
          })
        });
        new AMap.Marker({
          map: gdmap,
          position: [
            this.distance_data.bikePositionRetrieveListByDistanceId[0].bike_longitude,
            this.distance_data.bikePositionRetrieveListByDistanceId[0].bike_latitude
          ],
          icon: new AMap.Icon({
            image: WRCbikeIcon,
            size: new AMap.Size(64, 64),
            imageSize: new AMap.Size(64, 64)
          })
        });
      },
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
//            alert('在这搞事情');
          });
        });
      },
      regeocoder() {  //逆地理编码
        let self = this;
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(this.position, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              var way = result.regeocode.addressComponent.street ? result.regeocode.addressComponent.street : result.regeocode.addressComponent.district;
              this.setWindowMessage(way + " " + result.regeocode.aois["0"].name);
              self.currentAddress = result.regeocode.aois["0"].name;
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
            self.adsMsg = positionResult;
            self.getAroundBike(positionResult.position.lng, positionResult.position.lat);
          });
        });
      },
      getAroundBike(lng, lat) {
        let self = this;
        let data = {
          "longitude": lng,
          "latitude": lat,
          "bike_status": 1
        };

        function ret(r) {
          let arrar = [];
          r.data.list.forEach((item) => {
            let data = {};
            let position = [];
            position.push(item.bike_longitude);
            position.push(item.bike_latitude);
            data.position = position;
            data.icon = WRCbikeIcon;
            arrar.push(data);
          });
          self.nearbyCarList = Array.from(r.data.list);
          self.marker(arrar);
        }

        const url = 'wurengongxiangdanche/BikePosition/RetrieveListByParms';
        USER.ajax(url, 'GET', data, ret, 30000, false);
      },
      handleClick(tab, event) {
        if (tab.index === '0') {
          this.$router.push({name: 'employ-dc'});
        }
        if (tab.index === '1') {
          this.$router.push({name: 'employ-wrc'});
        }
      },
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
            name: '行驶轨迹',
            path: list
          }]);
        }
      },
      setAdsMsg(data) {
        this.adsMsg = data;
        gdmap.setCenter(data.location);
      },
      showMap() {
        this.tackForm.mapStatus = true;
      },
      closeMap() {
        this.tackForm.mapStatus = false;
      },
      showCarList() {
        this.carListDialog = true;
      },
      //创建订单
      bike_create() {
        let self = this;
        const url = 'wurengongxiangdanche/Distance/Create';
        let data = {
          "begin_longitude": this.adsMsg.position.lng,
          "begin_latitude": this.adsMsg.position.lat,
          "agree_time": this.computBeginTime.Format('YYYY-MM-dd hh:mm:ss'),
          "begin_position_name": this.currentAddress,
          "bike_id": this.selectCar.bike_id,
          "bike_number": this.selectCar.bike_number,
          "call_mode": this.beginType
        };
        console.log(data);
        const ret = function (ret) {
          if (ret.status === 1) {
            self.getUserStatus();
          } else {
            alert(ret.message)
          }
        };
        USER.ajax(url, 'post', data, ret)
      },
      //获取用户当前状态
      getUserStatus() {
        var self = this;
        const retCallbaak = function (ret) {
          console.log(ret);
          if (ret.status === 1) {
            if (ret.data === null) {
              self.$set(self, 'distance_data', {distance_status: null});
              self.distance_status = null;
            } else {
              self.distance_id = ret.data.distance_id;
              self.getCarInfo(ret.data.bike_id);
              self.$set(self, 'distance_data', ret.data);
              self.distance_status = ret.data.distance_status;
              self.bikePositionRetrieveListByDistanceId = ret.data.bikePositionRetrieveListByDistanceId;
            }
            self.map_init();
          } else {
            alert(ret.message);
          }
        };
        if (this.$route.query.prop_distance_id) {
          const url = 'wurengongxiangdanche/Distance/RetrieveDetailByDistanceId';
          USER.ajax(url, 'get', {distance_id: this.$route.query.prop_distance_id}, retCallbaak, 30000, false);
        } else {
          const url = 'wurengongxiangdanche/Distance/RetrieveDetailOfInProgress';
          USER.ajax(url, 'get', {}, retCallbaak, 30000, false)
        }
      },
      getCarInfo(id) {
        let self = this;
        const url = 'wurengongxiangdanche/Bike/RetrieveDetailByBikeId';
        const retBackCall = (ret) => {
          self.bikeData = ret.data;
        };
        USER.ajax(url, 'get', {bike_id: id}, retBackCall, 30000, false)
      },
      wurenchedaoda() {
        let data = {
          "distance_id": this.distance_data.distance_id,
          "end_position_name": "string"
        };
        console.log(data)
        const url = 'wurengongxiangdanche/Distance/UpdateOfArrive';
        const retBackCall = (ret) => {
          console.log(ret)
          if (ret.status === 1) {
            this.getUserStatus();
          } else {
            this.$alert(ret.message);
          }
        };
        USER.ajax(url, 'post', data, retBackCall, 30000, false)
      },
      upDataStatus(s) {
        //取消订单
        if (s === 0) {
          this.$confirm('此操作将取消订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {
              "distance_id": this.distance_data.distance_id,
              "end_position_name": this.distance_data.end_position_name
            };
            const url = 'wurengongxiangdanche/Distance/UpdateOfCancel';
            const retBackCall = (ret) => {
              if (ret.status === 1) {
                this.$message({
                  type: 'success',
                  message: '订单已取消!'
                });
                setTimeout(function () {
                  window.location.reload();
                }, 1000);
              }
            };
            USER.ajax(url, 'post', data, retBackCall, 30000, false);
          }).catch(() => {
          });
        } else if (s === 1) {
          this.$confirm('无人车会立即前往目的地, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {
              "distance_id": this.distance_data.distance_id
            };
            const url = 'wurengongxiangdanche/Distance/UpdateOfGoToPlace';
            const retBackCall = (ret) => {
              if (ret.status === 1) {
                this.getUserStatus();
                this.$message({
                  type: 'success',
                  message: '无人车已出发!'
                });
              }
            };
            USER.ajax(url, 'post', data, retBackCall, 30000, false);
          }).catch(() => {
          });
        }
        else if (s === 2) {
          this.goEndpPosition.mapStatus = true;
        } else if (s === 3) {
          this.$confirm('确认下车?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const data = {
              "distance_id": this.distance_data.distance_id,
              "end_position_name": this.distance_data.end_position_name
            };
            const url = 'wurengongxiangdanche/Distance/UpdateOfComplete';
            const retBackCall = (ret) => {
              if (ret.status === 1) {
                this.getUserStatus();
                this.$message({
                  type: 'success',
                  message: '您已下车,请及时支付费用,以便下次乘车!'
                });
                this.distance_status = null;
              }
            };
            USER.ajax(url, 'post', data, retBackCall, 30000, false);
          }).catch(() => {
          });
        }
      },
      okEndpPosition(obj) {
        this.$confirm(`无人车即将前往"${obj.name}", 请在上车后确认出发！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            "distance_id": this.distance_data.distance_id,
            "end_position_name": obj.address,
            "begin_longitude": obj.location.lng,
            "begin_latitude": obj.location.lat,
          };
          const url = 'wurengongxiangdanche/Distance/UpdateOfStart';
          const retBackCall = (ret) => {
            if (ret.status === 1) {
              this.getUserStatus();
              this.$message({
                type: 'success',
                message: '请系好安全带，无人车即将出发,祝您乘车愉快!'
              });
            }
          };
          USER.ajax(url, 'post', data, retBackCall, 30000, false);
        });
      },
      payDistanceOrder() {
        const retBackCall = (ret) => {
          if (ret.status === 1) {
            const data = {
              "distance_id": this.distance_data.distance_id,
              "end_position_name": this.distance_data.end_position_name
            };
            const url = 'wurengongxiangdanche/Distance/PayDistanceOrder';
            const retBackCall = (ret) => {
              if (ret.status === 1) {
                this.distance_status = 6;
                this.$message({
                  type: 'success',
                  message: '支付成功'
                });

              }
            };
            USER.ajax(url, 'post', data, retBackCall, 30000, false);
          } else {
            alert(ret.message);
          }
        };
        const url = 'wurengongxiangdanche/Distance/RetrieveDistanceOrderNumber';
        USER.ajax(url, 'get', {distance_id: this.distance_data.distance_id}, retBackCall, 30000, false);
      },
      buy_back() {
        if (this.$route.query.prop_distance_id) {
          this.$router.go(-1);
        } else {
          location.reload();
        }
      }
    },
    mounted() {
      this.getUserStatus();
      if (this.distance_data && this.distance_data.distance_status > 0 && this.distance_data.distance_status < 5) {
        setInterval(() => {
          this.getUserStatus();
        }, 30000);
      }
    },
    watch: {}
  };
</script>
<style scoped lang="less">
  @import '~assets/css/public.less';

  .mr-12 {
    margin-right: 12px
  }

  .mymap {
    width: 100%;
    height: 600px;
    position: relative;
    .right-title {
      position: absolute;
      left: 20px;
      top: 12px;
      z-index: 99;
      background: #ffffff;
      line-height: 42px;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }
    #container {
      width: 100%;
      height: 100%;
    }
  }

  .select-bar {
    display: flex;
    height: 77px;
    line-height: 77px;
    border: @border1px;
    border-top: none;
    padding-left: 12px;
  }

  .car-details-dialog {
    width: 410px;
    position: absolute;
    background: #ffffff;
    left: 20px;
    top: 90px;
    z-index: 1000;
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

  .go-back {
    font-size: 14px;
    position: absolute;
    top: 8px;
    right: 14px;
    color: #ccc;
  }
</style>
