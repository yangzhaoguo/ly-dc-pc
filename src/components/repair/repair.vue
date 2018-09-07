<template>
  <div id="">
    <header-router :rightShow="false"></header-router>
    <div class="content">
      <div>
        <el-radio-group v-model="repair_type_name">
          <el-radio-button v-for="repairType in repairTypes" :label="repairType" :key="repairType">{{repairType}}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div style="margin-top:12px;">
        <div class="car-title">车辆信息</div>
        <div class="form">
          <div style="font-size: 14px;margin-bottom: 12px">拍摄周围环境，以便维修师傅找车</div>
          <div>
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="repair_image_path" alt="">
            </el-dialog>
          </div>
          <el-input
            style="margin-top: 12px;"
            placeholder="车牌号（车牌损坏可以不填）"
            v-model="bike_number"
            clearable>
          </el-input>
          <el-input
            style="margin-top: 12px;"
            type="textarea"
            :rows="3"
            placeholder="备注"
            v-model="repair_description">
          </el-input>
          <el-button @click.native="postRepair" type="primary" style="margin: 30px auto 0; width: 70%;display: block">
            提交
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headerRouter from '../../common/header/header-router';
  import {mapGetters, mapMutations} from 'vuex';
  import * as USER from "assets/js/user";

  export default {
    data() {
      return {
        repairTypes: [
          '轮胎坏了',
          '车锁坏了',
          '违章乱停',
          '密码不对',
          '刹车坏了',
          '其他'
        ],
        dialogVisible: false,
        bike_number: '',
        repair_description: '', //描述
        repair_image_path: '', //图片
        repair_type_name: '轮胎坏了'
      };
    },
    methods: {
      ...mapMutations({
        setRouterName: 'SET_ROUTERNAME'
      }),
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.repair_image_path = file.url;
        this.dialogVisible = true;
      },
      postRepair() {
        let self = this;
        let data = {
          "bike_position_name": this.windowMessage,
          "bike_latitude": this.position[1],
          "bike_longitude": this.position[0],
          "bike_number": this.bike_number,
          "repair_description": this.repair_description,
          "repair_type_name": this.repair_type_name,
          "repair_image_path": 'blob:http://localhost:8080/a552a9ad-98bb-4575-ae08-0babb5601ae6'
        };
        if (data.repair_description === "") {
          this.$alert('请输入备注', '提示');
          return false;
        }
        const ret = function (r) {
          self.$alert('报修成功', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              self.$router.back(-1);
            }
          });
        };
        const url = 'yourengongxiangdanche/RepairTreat/CreateRepair';
        USER.ajax(url, 'POST', data, ret);
      }
    },
    computed: {
      ...mapGetters([
        'position',
        'windowMessage'
      ])
    },
    mounted() {
      this.setRouterName('共享单车→单车报修');
      if (this.windowMessage === "") {
        this.$router.back(-1);
      }
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
    .form {
      padding: 12px;

    }
  }

  .car-title {
    line-height: 42px;
    border-bottom: @border1px;
  }
</style>
