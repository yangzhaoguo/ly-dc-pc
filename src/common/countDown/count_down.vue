<template>
  <div id="">
    <svg viewBox="0 0 200 200"
         :width="width" :height="width">
      <circle cx="100" cy="100" :r="100 - border / 2"
              fill="none"
              opacity="0.4"
              :stroke="color"
              :stroke-width="border"/>
      <circle cx="100" cy="100" :r="100 - border / 2"
              fill="none"
              transform="rotate(270,100,100)"
              :stroke="color"
              :stroke-width="border"
              :stroke-dasharray="dashLen"
              :stroke-dashoffset="-dashOffset"
              style="transition: stroke-dashoffset 0.4s"/>
      <text x="100" y="110" text-anchor="middle"
            :font-size="fontSize + 10"
            :fill="color">
        {{ countDown }}
      </text>
      <!--<text x="100" y="150" text-anchor="middle"-->
      <!--:font-size="fontSize"-->
      <!--fill="#d4d4d4">-->
      <!--剩余-->
      <!--</text>-->
    </svg>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        timeLeft: this.yancheTime,
        dashLen: (100 - this.border / 2) * Math.PI * 2
      };
    },
    methods: {},
    props: {
      begin_time: { //开始的时间戳
        type: Number,
        default: 0
      },
      show: {
        type: Boolean,
        default: true
      },
      yancheTime: { // 倒计时多少秒
        type: Number,
        default: 120
      },
      width: { // 计时器宽高
        type: Number,
        default: 50
      },
      border: { // 边框宽度
        type: Number,
        default: 8
      },
      color: { // 颜色
        type: String,
        default: '#fcaa55'
      },
      fontSize: {
        type: Number,
        default: 30
      }
    },
    computed: {
      countDown() {
        let time = this.timeLeft;
        if (time <= 0) {
          return '00:00:00';
        } else {
          let result = [];
          result.push(Math.floor(time / 3.6e+6));
          result.push(Math.floor(time % 3.6e+6 / 60000));
          result.push(Math.floor(time % 60000 / 1000));
          return result.map(x => x < 10 ? '0' + x : x).join(':');
        }
      },
      dashOffset() {
        return this.dashLen - this.timeLeft / 1000 / this.yancheTime * this.dashLen;
      }
    },
    created() {
      this.lastDate = new Date(this.begin_time).getTime() + this.yancheTime * 1000;
      this.interval = setInterval(() => {
        let curDate = Date.now();
        let diff = Math.round((this.lastDate - curDate) / 1000) * 1000;
        this.timeLeft = diff;
        if (this.timeLeft <= 0) {
          clearInterval(this.interval);
          this.$emit('overTime');
        }
      }, 1000);
    },
    destroyed() {
      clearInterval(this.interval);
    }
  };
</script>

<style scoped>
</style>
