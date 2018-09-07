import axios from 'axios';
import {Loading} from 'element-ui';

const debug = true;

const baseUrl = 'http://ope.lingyi365.com:5608/cloud/';

//获取用户token
export const GetUserToken = () => {
  if (debug) {
    return "WZ8azGAUy5a-djIY8SxaBlqe*-384BCCqRXD-JFMOriFx-rPcZ5KrQ..";
  } else {
    return browser().GetUserToken();
  }
};
//获取用户ID
export const GetUserID = () => {
  if (debug) {
    return "57a0136259242e1cd867f28e";
  } else {
    return browser().GetUserID();
  }
};
//ajax请求;地址,请求方式,提交数据,回调函数,超时时间（默认30秒）,请求时loading...(默认弹出)
export const ajax = (url = '', type = 'POST', data = {}, retCallback, timeout = 30000, loadingShow = true) => {
  type = type.toUpperCase();
  url = baseUrl + url;
  let opaction = {
    method: type,
    url: url,
    timeout: timeout,
    data: data,
    params: data,
    headers: {
      Authentication: GetUserToken()
    }
  };
  showLoad();
  axios(opaction).then((response) => {
    closeLoad();
    retCallback(response.data);
  }, () => {
    closeLoad();
    alert('请求失败');
  });

  function showLoad() {
    if (loadingShow) {
      Loading.service({lock: true, text: 'Loading...'});
    }
  }

  function closeLoad() {
    if (loadingShow) {
      Loading.service({}).close();
    }
  }
};

/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
};
