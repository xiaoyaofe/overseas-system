import Loader from 'src/views/system/loader/loader.js'
import router from 'src/router'

let requrl
let port
//内网
// requrl = "http://172.16.3.144"
// port = 7011

// requrl = "http://172.16.10.132"
// port = 7011

// requrl = "http://172.16.3.171"
// port = 7011

// requrl = "http://113.107.160.59"
// port = 7011
// var baseUrl = requrl + ':' + port + '/api/v2.0'


// 外网
requrl = "http://oas.changic.net.cn"
port = ''
var baseUrl = requrl + '/api/v2.0'

export {
  baseUrl
}
export default {
  // 内网
  host: requrl + ':' + port,
  // 外网
  // host: requrl,
  jsonp(url, data, close) {
    let ajax = $.ajax({
      url: url ? baseUrl + url : baseUrl + data.url,
      dataType: 'jsonp',
      data: data,
      jsonp: 'callback',
      beforeSend() {
        !close && Loader.load()
      },
      error(err, txt, sta) {
        console.error('error:%s', txt)
        Utils.Notification.error({
          message: txt
        });
        !close && Loader.loadend()
      },
      success(data) {
        if (data.code == 101) {
          Utils.Notification.error({
            message: '用户信息已过期，请重新登录!'
          })
          setTimeout(() => {
            router.go({
              path: 'login'
            })
          }, 1000)
          
        };
        !close && Loader.loadend();
      }
    })
    return ajax
  },
  post(url, data, close) {
    return $.ajax({
      url: url ? baseUrl + url : baseUrl + data.url,
      data: data,
      dataType: 'json',
      method: 'post',
      xhrFields: {
        withCredentials: true
      },
      beforeSend() {
        !close && Loader.load()
      },
      error(err, txt) {
        console.error('error:%s', txt)
        Utils.Notification.error({
          message: txt
        });
        !close && Loader.loadend()
      },
      success(data) {
        if (data.code === 101) {
          Utils.Notification.error({
            message: '用户信息已过期，请重新登录!'
          })
          setTimeout(() => {
            router.go({
              path: 'login'
            })
          }, 1000)
        };
        !close && Loader.loadend()
      }
    })
  },
  exportData(url, data) {
    console.log({'url':url,'data':data});
    
    window.open(baseUrl + url + '?' + $.param(data))
  }
}



