<!--地图使用-->
<!--多个地图调用父子间传入地图id （:mapId="toChildMapA"）
    地图接受的默认城市 父组件传入 （默认地址 和默认经纬度）
    地图返回值的值发送父组件  （this.setName）
    点击地图收藏添加的缓存 cacheName
    获取地理位置发送主组件 setName-->
<template>
  <div>
    <div class='panel'>
      <div class="map-wrapper">
        <div class="head-wrapper">选择地址<span @click="onClose"><i style="color: #ffffff;"
                                                                  class="el-dialog__close el-icon el-icon-close"></i></span>
        </div>
        <div class="map-center">
          <!--<div class="map-title"><span>送车范围：</span>地图蓝色边界范围内，请提前4个工作小时下单，即可<span style="color: #EBB563">免费</span>尊享送车上门服务。如距离取/还车时间不足4小时，可以选择<span-->
            <!--class="easySty">到店取还</span>-->
          <!--</div>-->
          <div class="my-map">
            <div class="map-serch">
              <div class="search-con">
                <div class="search-input">
                  <el-input
                    id='input'
                    size="small"
                    :value=this.setName
                    placeholder="点击地图显示地址/输入地址显示位置"
                    prefix-icon="el-icon-search"
                    style="width:270px">
                  </el-input>
                  <div id='message'></div>
                </div>
                <div class="selAds" @click="onCommon" :class="{isCommon:isCommon==false}">
                  <span class="el-dropdown-link">常用地址
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                </div>
              </div>
              <div class="mapPoi">
                <ul v-show="isCommon==true">
                  <li v-for="(item,index) in poiList" :class="{activeAds:tap==index}" :key="index">
                    <i class="el-icon-location"></i>
                    <div class="ads-text" @click="setAds(item,index)">
                      <div class="title">
                        <span ref="adsName">{{item.name}}</span>
                        <p>{{item.address}}</p>
                      </div>
                      <div @click="localSis(item,index)" class="start">
                        <i class="el-rate__icon el-icon-star-on" :class="{starActive:item.starActive}"></i>
                      </div>
                    </div>
                    <div v-show="tap==index" class="ads-btn" @click="adsBtn(item)">
                      <el-button type="warning" size="mini">确认地址</el-button>
                    </div>
                  </li>
                </ul>
                <ul v-show="isCommon==false">
                  <li v-for="(item,index) in mapssig" :class="{activeAds:tap==index}" :key="index">
                    <i class="el-icon-location"></i>
                    <div class="ads-text" @click="setAds(item,index)">
                      <div class="title">
                        <span ref="adsName">{{item.name}}</span>
                      </div>
                    </div>
                    <div v-show="tap==index" class="ads-btn" @click="adsBtn(item)">
                      <el-button type="warning" size="mini">确认地址</el-button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="map">
              <div id="myMap" tabindex="0" style="width:100%;height: 100%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
  .panel {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    .map-wrapper {
      width: 860px;
      height: 580px;
      background: #fff;
      position: relative;
      margin: 200px auto;
      overflow: hidden;
      .head-wrapper {
        height: 50px;
        line-height: 50px;
        background: #00a0e9;
        color: #ffffff;
        padding: 0 20px;
        font-weight: bold;
        span {
          float: right;
          cursor: pointer;
          i {
            font-size: 20px;
          }
        }
      }
      .map-center {

        padding: 20px;
        .map-title {
          font-size: 12px;
          color: #939a9f;
          line-height: 20px;
          span {
            font-weight: bold;
            font-size: 13px;
            color: #000;
          }
          .easySty {
            color: #169BD5;
            margin-left: 2px;
            cursor: pointer;
          }
        }
        .my-map {
          width: 100%;
          height: 100%;
          margin-top: 10px;
          .map-serch {
            float: left;
            width: 378px;
            height: 438px;
            border: 1px solid #e4e6e9;
            .search-con {
              width: 98%;
              padding: 4px;
              border-bottom: 1px solid #e4e6e9;
              position: relative;
              background: #F3F4F7;
              overflow: hidden;
            }
            .search-input {
              width: 275px;
              float: left;
            }
            .selAds {
              float: left;
              margin-left: 5px;
              line-height: 30px;
              font-size: 13px;
            }
            .isCommon {
              color: #E6A23C;
            }
            .mapPoi {
              height: 375px;
              overflow: hidden;
              overflow-y: scroll;
              position: relative;
              padding: 10px;
              li {
                padding: 10px 0;
                border-bottom: 1px solid #e4e6e9;
                clear: both;
                cursor: pointer;
                position: relative;
                text-align: left;
                .ads-btn {
                  display: inline-block;
                  margin-left: 30px;
                  margin-top: 10px;
                }
                i {
                  float: left;
                  display: block;
                  width: 15px;
                  height: 20px;
                  color: #ccc;
                }
                .starActive {
                  color: #FABE00;
                }
                .ads-text {
                  margin-left: 30px;
                  width: 310px;
                  .title {
                    color: #000;
                    font-size: 15px;
                    p {
                      color: #939a9f;
                      font-size: 12px;
                      line-height: 20px;
                      width: 90%;
                      overflow: hidden;
                    }
                  }
                  .start {
                    padding: 10px;
                    position: absolute;
                    right: 0;
                    top: 10px;
                  }
                }
              }
              .activeAds {
                background: #f7f4f0;
              }
            }
          }
          .map {
            float: left;
            width: 438px;
            height: 438px;
            border: 1px solid #e4e6e9;
          }
        }
      }
    }
  }
</style>
<script>
  var map;
  var marker;
  var geocoder;
  var geolocation;
  export default {
    props: {
      info: {
        type: Object
      }
    },
    data() {
      return {
        isCommon: true,
        isColor: false,
        tap: 0,
        poiList: [],
        setName: "北京",
        cacheName: [],
        mapssig: []
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init: function () {
        let input = document.getElementById('input');
        let message = document.getElementById('message');
        let that = this;
        map = new AMap.Map('myMap', {
          resizeEnable: true,
          zoom: 16,
          city: that.info.city
        });
        map.plugin('AMap.Geolocation', () => {
          geolocation = new AMap.Geolocation({
            //是否使用高精度定位，默认:true
            enableHighAccuracy: true,
            //超过10秒后停止定位，默认：无穷大
            timeout: 10000,
            buttonPosition: 'RB',
            zoomToAccuracy: true,
            showMarker: false
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            geocoder = new AMap.Geocoder({
              city: ""//城市，默认：“全国”
            });
            geocoder.getAddress([data.position.lng, data.position.lat], function (status, result) {
              //在当前选择的城市点击
              if (that.info.city.toString() === result.regeocode.addressComponent.province) {
                if (status === 'complete') {
                  placeSearch(result.regeocode.formattedAddress);
                  that.setName = result.regeocode.formattedAddress;
                  message.innerHTML = '';
                  marker = new AMap.Marker({
                    map: map,
                    bubble: true,
                    icon: new AMap.Icon({
                      size: new AMap.Size(40, 50),
                      image: require('./icon_point_song.png')
                    })
                  });
                } else {
                  message.innerHTML = '无法获取地址';
                }
              } else {
                alert("请选择当前城市地址");
              }
            });
          });
          AMap.event.addListener(geolocation, 'error', () => {
            alert('地图加载失败，请重新打开地图');
          });
        });
        // 点击地图/输入地址
        AMap.plugin('AMap.Geocoder', function () {
          //地图点击获取位置
          map.on('click', function (e) {
            geocoder.getAddress(e.lnglat, function (status, result) {
              //在当前选择的城市点击
              if (that.info.city.toString() === result.regeocode.addressComponent.province) {
                if (status === 'complete') {
                  marker.setPosition(e.lnglat);
                  placeSearch(result.regeocode.formattedAddress);
                  that.setName = result.regeocode.formattedAddress;
                  message.innerHTML = '';
                } else {
                  message.innerHTML = '无法获取地址';
                }
              } else {
                alert("请选择当前城市地址");
              }
            });
          });
          //输入地理位置
          input.oninput = function () {
            let address = input.value;
            that.setName = address;
            placeSearch(address);
            geocoder.getLocation(that.setName, function (status, result) {
              if (status === 'complete' && result.geocodes.length) {
                marker.setPosition(result.geocodes[0].location);
                map.setCenter(marker.getPosition());
                message.innerHTML = '';
              } else {
                message.innerHTML = '无法获取位置';
              }
            });
          };
        });
        // --------------------------------------------------------------
        //基本地图加载  周围opi加载
        function placeSearch(ads) {
          AMap.service(["AMap.PlaceSearch"], function (PlaceSearch) {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
              type: "",
              setcity: that.info.city //城市
            });
            //关键字查询
            placeSearch.search(ads, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                map.setCenter(marker.getPosition());
                that.poiList = result.poiList.pois;
                that.poiList.forEach(v => {
                  v.starActive = false;
                  that.mapssig.forEach(m => {
                    if (v.name === m.name) {
                      v.starActive = true;
                    }
                  });
                });
              }
            });
          });
        }
      },
      // 点击opi列表
      setAds(item, index) {
        this.setName = item.name;
        this.tap = index;
//        根据经纬度获取地图坐标
        marker.setPosition(item.location);
        map.setCenter(marker.getPosition());
      },
      //点击地图位置发送给主组件 编译成经纬度
      adsBtn(data) {
        let that = this;
        that.$emit("adsMsg", data);
        that.$emit('closeMap');
      },
      // 添加缓存
      localSis(item, index) {
        this.$set(this.poiList[index], 'starActive', !item.starActive);
        this.cacheName = this.mapssig;
        if (item.starActive === true) {
          this.cacheName.push(item);
        } else {
          for (var i = 0; i < this.cacheName.length; i++) {
            if (this.cacheName[i].name === item.name) {
              this.cacheName.splice(i, 1);
              break;
            }
          }
        }
        localStorage.setItem("V_K", JSON.stringify(this.cacheName));
      },
      onCommon() {
        this.isCommon = !this.isCommon;
      },
      onClose() {
        this.$emit("closeMap");
      }
    },
    created() {
      if (localStorage.getItem("V_K")) {
        var that = this;
        var ssta = JSON.parse(localStorage.getItem("V_K"));
        if (ssta.length > 0) {
          that.mapssig = ssta;
        } else {
          return false;
        }
      } else {
        this.mapssig = [];
      }
      this.setName = this.info.city;
    }
  };

</script>
