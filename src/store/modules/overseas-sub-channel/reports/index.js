import http from 'src/services/http'
import { log } from 'util';
function getWidth(str) {
  var len = str ? str.length:0;
  if (len <= 2) {
    return 80
  }
  if (len <= 3) {
    return 90
  }
  if (len <= 4) {
    return 100
  }
  if (len <= 6) {
    return 110
  }
  if (len <= 9) {
    return 120
  }
}
export default {
  namespaced: true,
  state: {
    activationTime: [moment().add(-1, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")],
    rechargeTime: [moment().add(-1, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")],
    // date: [
    //   moment()
    //     .add(-1, "day")
    //     .format("YYYY-MM-DD"),
    //   moment()
    //     .add(-1, "day")
    //     .format("YYYY-MM-DD")
    // ],
    // payDate:[
    //   moment()
    //     .add(-1, "day")
    //     .format("YYYY-MM-DD"),
    //   moment()
    //     .add(-1, "day")
    //     .format("YYYY-MM-DD")
    // ],
    os: '1',
    region: null,
    regionArr: [],
    game: null,
    gameArr: [],
    channel: null,
    channelList: null,
    level: 3,
    subChannelData: [],
    subChannelInfoData:{channel:[],params:[]},
    subChannelParams:null,
    subChannelRegionData: null,
    subChannelConfig: {},
    subChannelRegionConfig: {}
  },
  mutations: {
    setOs(state, data) {
      state.os = data
    },
    setActivationTime(state, data) {
      state.activationTime = data
    },
    setRechargeTime(state, data) {
      state.rechargeTime = data
    },
    setRegion(state, data) {
      state.region = data
    },
    setRegionArr(state, data) {
      state.regionArr = data
    },
    setGame(state, data) {
      state.game = data
    },
    setGameArr(state, data) {
      state.gameArr = data
    },
    setChannel(state, data) {
      state.channel = data
    },
    setChannelParams(state,data){
      state.subChannelParams = data
    },
    setChannelList(state, data) {
      state.channelList = data
    },
    setLevel(state, data) {
      state.level = data
    },
    set(state, { key, value }) {
      state[key] = value
    },
    setSubChannelInfo(state,data){
      state.subChannelInfoData = data
    }
  },
  getters: {
    subChannelData(state) {
      let field = 'daily'
      function initMma() {
        var mma = {}
        colorKey.forEach(key => {
          mma[key] = {
            min: Infinity,
            max: 0,
            avg: 0,
            isReversal: [keys[index.createCostIndex], keys[index.activeCostIndex], keys[index.registerCostIndex]].includes(key) ? true : false,
            total: 0,
            count: 0
          }
        })
        return mma
      }
      function assignment(data, mma, isLast) {
        colorKey.forEach(key => {
          var val = data[key]
          if (val !== 0) {
            mma[key].count++;
            mma[key].total += val
          }
          if (val > mma[key].max) {
            mma[key].max = val
          }
          if (val < mma[key].min) {
            mma[key].min = val
          }
          if (isLast) {
            mma[key].avg = mma[key].count ? (mma[key].total / mma[key].count).format(2) : 0
          }
        })
      }

      function init(arr, config) {
        if (!config.keys) {
          config.keys = Object.keys(arr[0]).map(item => item);
          // config.keys.push('LTV');
        }
        if (!config.index) {
          config.index = {
            dateIndex: 0,         //统计时间
            systemIndex: 1,       //系统
            activeIndex: 2,       //激活
            registerIndex: 3,     //注册
            createIndex: 4,       //创角
            registerRateIndex: 5,//注册率
            createRateIndex: 6,  //创角率
            activeCostIndex: 7,  //激活成本
            registerCostIndex: 8,//注册成本
            createCostIndex: 9,  //创角成本
            costIndex: 10,         //花费
            rechargeIndex: 11,     //充值
            roiIndex: 12,          //roi
            minuteRechargeIndex: 13,//分成充值            
            minuteIndex:14,        //分成roi
            ltv1Index: 15,         //ltv
            ltv2Index: 16,         //ltv
            ltv3Index: 17,         //ltv
            keep1Index: 18,       //次留
            keep2Index: 19,       //3日次留
            keep3Index: 20,       //7日次留
            // newCreateIndex: 7,    
            // newCreateCostIndex: 8,
            // mounthChargeIndex: 18,
            // mounthActiveIndex: 19,
          }
        }
        if (!config.colorKey) {
          config.colorKey = [
            config.keys[config.index.registerRateIndex],
            config.keys[config.index.createRateIndex],
            config.keys[config.index.activeCostIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex]
          ]
        }
        if (!config.tableKey) {
          config.tableKey = [{
            key: config.keys[config.index.dateIndex],
            sortable: true,
            width: 350
          }, {
            key: config.keys[config.index.systemIndex],
            sortable: true
          }, {
            key: config.keys[config.index.activeIndex],
            sortable: true
          }, {
            key: config.keys[config.index.registerIndex],
            sortable: true
          }, {
            key: config.keys[config.index.createIndex],
            sortable: true
          }, {
            key: config.keys[config.index.registerRateIndex],
            sortable: true
          }, {
            key: config.keys[config.index.createRateIndex],
            sortable: true
          }, {
            key: config.keys[config.index.activeCostIndex],
            sortable: true
          }, {
            key: config.keys[config.index.registerCostIndex],
            sortable: true
          }, {
            key: config.keys[config.index.createCostIndex],
            sortable: true
          }, {
            key: config.keys[config.index.costIndex],
            sortable: true
          }, {
            key: config.keys[config.index.rechargeIndex],
            sortable: true
          }, {
            key: config.keys[config.index.minuteRechargeIndex],
            sortable: true
          }, {
            key: config.keys[config.index.roiIndex],
            sortable: true
          },{
            key: config.keys[config.index.minuteIndex],
            sortable: true
          }, {
            key: config.keys[config.index.mounthActiveIndex],
            sortable: true,
            hide: true
          }, {
            key: config.keys[config.index.mounthChargeIndex],
            sortable: true,
            hide: true
          }, {
            key: config.keys[config.index.ltv1Index],
            sortable: true
          }, {
            key: config.keys[config.index.ltv2Index],
            sortable: true
          }, {
            key: config.keys[config.index.ltv3Index],
            sortable: true
          },{
            key: config.keys[config.index.keep1Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep2Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep3Index],
            sortable: true
          }, {
            key: config.keys[config.index.newCreateIndex],
            sortable: true,
            hide: true
          }, {
            key: config.keys[config.index.newCreateCostIndex],
            sortable: true,
            hide: true
          }]

          config.tableKey.map(item => {
            if (!item.width && !item.hide)
              return item.width = getWidth(item.key)
          })
        }
        if (!config.chartKey) {
          config.chartKey = [
            config.keys[config.index.activeIndex],
            config.keys[config.index.registerIndex],
            config.keys[config.index.createIndex],
            config.keys[config.index.costIndex],
            config.keys[config.index.rechargeIndex],
            // config.keys[config.index.minuteRechargeIndex],
            config.keys[config.index.activeCostIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex],
            config.keys[config.index.newCreateIndex],
          ]
        }
      }
      var dailyData
      if (state.subChannelData && state.subChannelData.length) {
        // var arr = state.daily[getters.getIdStr][0];
        // var config = state.configs.daily;
        var config = state.subChannelConfig
        var arr = state.subChannelData
        dailyData = {
          list: arr,
          date: [],
          total: {},
          mmas: null
        }
        init(arr, config)
        var {
          keys,
          index,
          colorKey,
          tableKey,
          chartKey
        } = config
        dailyData.mmas = initMma()
        var isLast
        arr.forEach((item, i) => {
          keys.forEach(key => {
            var _ = item[key] * 1
            if (!isNaN(_)) {
              item[key] = _
            }
          })
          isLast = i + 1 === arr.length
          assignment(item, dailyData.mmas, isLast)
          dailyData.date.push(item[keys[index.dateIndex]])


          /**
           * ltv handler
           */
          var mounthChargeKey = keys[index.mounthChargeIndex]
          var mounthActiveKey = keys[index.mounthActiveIndex]
          item.LTV = !item[mounthChargeKey] || !item[mounthActiveKey] ? 0 : (item[mounthChargeKey] / item[mounthActiveKey]).format(2);

          tableKey.forEach(({ key }) => {
            switch (key) {
              case keys[index.dateIndex]:
                if (!dailyData.total.hasOwnProperty(key)) {
                  dailyData.total[key] = "全部"
                }
                break
              case keys[index.systemIndex]:
                if (!dailyData.total.hasOwnProperty(key)) {
                  dailyData.total[key] = item[key]
                }
                break
              default:
                const titleArr = ['7日LTV','14日LTV','30日LTV','次日留存','3日留存','7日留存'];
                if (!dailyData.total.hasOwnProperty(key)) {
                  if (titleArr.includes(key)) {
                    dailyData.total[key] =  ((item[key])*item['激活']).format(2)
                  }else{
                    dailyData.total[key] = item[key]
                  }
                } else {
                  if (titleArr.includes(key)) {
                    dailyData.total[key] = ((item[key]*item['激活']) + dailyData.total[key]).format(2)
                  }else{
                    dailyData.total[key] = (item[key] + dailyData.total[key]).format(2);
                  }
                }
                break
            }
            if (isLast) {

            }
          })
        })

        tableKey.forEach(({ key }) => {
          var total = dailyData.total
          switch (key) {
            case keys[index.registerRateIndex]:
              var active = dailyData.total[keys[index.activeIndex]]
              var register = dailyData.total[keys[index.registerIndex]]
              dailyData.total[key] = ((register / active) * 100).format(2) + '%'
              break;
            case keys[index.createRateIndex]:
              var active = dailyData.total[keys[index.activeIndex]]
              var create = dailyData.total[keys[index.createIndex]]
              dailyData.total[key] = ((create / active) * 100).format(2) + '%'
              break;
            case keys[index.activeCostIndex]:
              var active = dailyData.total[keys[index.activeIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / active).format(2)
              break;
            case keys[index.registerCostIndex]:
              var register = dailyData.total[keys[index.registerIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / register).format(2)
              break;
            case keys[index.createCostIndex]:
              var create = dailyData.total[keys[index.createIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / create).format(2)
              break;
            case keys[index.roiIndex]:
              var roi = dailyData.total[keys[index.roiIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = ((roi / cost)).format(2) + '%'
              break;
            case keys[index.roiIndex]:
              var roi = dailyData.total[keys[index.rechargeIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = ((roi / cost)*100).format(2) + '%'
              break;
            case keys[index.minuteIndex]:
                var cost = dailyData.total[keys[index.minuteRechargeIndex]]
                var allCost = dailyData.total[keys[index.costIndex]]
                dailyData.total[key] = ((cost/allCost)*100).format(2) + '%'
                break;
            case keys[index.ltv1Index]://7日LTV
              var cost = dailyData.total[keys[index.ltv1Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = (cost/active).format(2)
              break;
            case keys[index.ltv2Index]://14日LTV
              var cost = dailyData.total[keys[index.ltv2Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = (cost/active).format(2)
              break;
            case keys[index.ltv3Index]://30日LTV
              var cost = dailyData.total[keys[index.ltv3Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = (cost/active).format(2)
              break;
            case keys[index.keep1Index]://次日留存
              var cost = dailyData.total[keys[index.keep1Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = ((cost/active)).format(2) + '%';
              break;
            case keys[index.keep2Index]://3日留存
              var cost = dailyData.total[keys[index.keep2Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = ((cost/active)).format(2) + '%';
              
              break;
            case keys[index.keep3Index]://7日留存
              var cost = dailyData.total[keys[index.keep3Index]]
              var active = dailyData.total[keys[index.activeIndex]]
              dailyData.total[key] = ((cost/active)).format(2) + '%';
              break;
          default:
            // var keyValue = dailyData.total[key]
            // var active = dailyData.total[keys[index.activeIndex]]
            // if (key === keys[index.keep1Index] || key === keys[index.keep2Index] || key === keys[index.keep3Index]) {
            //   dailyData.total[key] = ((keyValue / active) * 100).format(2) + '%'
            // }
            break;
          }
        })

      } else {
        dailyData = null
      }
      
      console.log('dailyData:->>>>>>>>>>>>', dailyData)
      return dailyData


      // if (state.subChannelData && state.subChannelData.length) {
      //   var config = state.subChannelConfig
      //   var firstData = state.subChannelData[0]
      //   if (!config.keys) {
      //     config.keys = Object.keys(firstData)
      //     // config.keys.push('等级到达率')
      //   }
      //   if (!config.index) {
      //     config.index = {
      //       dateIndex: 0,         //统计时间
      //       systemIndex: 1,       //系统
      //       activeIndex: 2,       //激活
      //       registerIndex: 3,     //注册
      //       createIndex: 4,       //创角
      //       registerRateIndex: 5,//注册率
      //       createRateIndex: 6,  //创角率
      //       activeCostIndex: 7,  //激活成本
      //       registerCostIndex: 8,//注册成本
      //       createCostIndex: 9,  //创角成本
      //       costIndex: 10,         //花费
      //       rechargeIndex: 11,     //充值
      //       roiIndex: 12,          //roi
      //       minuteIndex:13,        //分成roi
      //       ltv1Index: 14,         //ltv
      //       ltv2Index: 15,         //ltv
      //       ltv3Index: 16,         //ltv
      //       keep1Index: 17,       //次留
      //       keep2Index: 18,       //3日次留
      //       keep3Index: 19,       //7日次留

      //     }
      //   }
      //   if (!config.tableKey) {
      //     var keys = config.keys
      //     var index = config.index
      //     config.tableKey = [{
      //       key: config.keys[config.index.dateIndex],
      //       sortable: true,
      //       width: 150
      //     }, {
      //       key: config.keys[config.index.systemIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.activeIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.registerIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.createIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.registerRateIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.createRateIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.activeCostIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.registerCostIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.createCostIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.costIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.rechargeIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.roiIndex],
      //       sortable: true
      //     },{
      //       key: config.keys[config.index.minuteIndex],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.ltv1Index],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.ltv2Index],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.ltv3Index],
      //       sortable: true
      //     },{
      //       key: config.keys[config.index.keep1Index],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.keep2Index],
      //       sortable: true
      //     }, {
      //       key: config.keys[config.index.keep3Index],
      //       sortable: true
      //     }, ]
      //     config.tableKey.map(item => {
      //       if (!item.width && !item.hide)
      //         return item.width = 100
      //     })
      //   }
      //   var { keys, index } = config
      //   var data = {}
      //   var total
      //   var numbers = []
      //   var NaNs = []
      //   var isLast
      //   state.subChannelData.forEach((item, i) => {

      //     { // 数据处理 number 化
      //       var itemVal
      //       if (!i) {
      //         keys.forEach(key => {
      //           itemVal = item[key] * 1
      //           if (!isNaN(itemVal)) {
      //             numbers.push(key)
      //             item[key] = itemVal
      //           } else {
      //             NaNs.push(key)
      //           }
      //         })
      //         total = Object.assign({}, firstData)
      //       } else {
      //         numbers.forEach(key => {
      //           itemVal = item[key] * 1
      //           item[key] = itemVal
      //           total[key] += itemVal
      //         })
      //       }
      //     }

      //     var levelAfRateKey = keys[index.levelAfRateIndex]
      //     var activeKey = keys[index.activeIndex]
      //     var levelAfKey = keys[index.levelAfIndex]
      //     item[levelAfRateKey] = (item[levelAfKey] / item[activeKey] * 100).format(2)

      //     var activeKey = keys[index.activeIndex]
      //     var registerKey = keys[index.registerIndex]
      //     var createKey = keys[index.createIndex]
      //     var registerRateKey = keys[index.registerRateIndex]
      //     var createRateKey = keys[index.createRateIndex]

      //     isLast = state.subChannelData.length === i + 1
      //     if (isLast) { // handler calculate
      //       NaNs.forEach(key => {
      //         if (key !== keys[index.osIndex])
      //           total[key] = '全部'
      //       })


      //       total[registerRateKey] = (total[registerKey] / total[activeKey] * 100).format(2) + '%'
      //       total[createRateKey] = (total[createKey] / total[activeKey] * 100).format(2) + '%'
      //       // total[keep1Index] = (total[levelAfKey] / total[activeKey] * 100).format(2) + '%'
      //     }
      //   })


      //   data.list = state.subChannelData
      //   data.total = total

      //   console.log(
      //     'subChannelData', data
      //   )
      //   return data
      // } else {
      //   return null
      // }
    },
    subChannelRegionData(state) {
      if (state.subChannelRegionData && state.subChannelRegionData.length) {
        var config = state.subChannelRegionConfig
        var firstData = state.subChannelRegionData[0]
        if (!config.keys) {
          config.keys = Object.keys(firstData)
          config.keys.push('等级到达率')
        }
        if (!config.index) {
          config.index = {
            appidIndex: 0,
            regionIndex: 1,
            osIndex: 2,
            activeIndex: 3,
            registerIndex: 4,
            createIndex: 5,
            levelBfIndex: 6,
            levelAfIndex: 7,
            registerRateIndex: 8,
            createRateIndex: 9,
            levelAfRateIndex: 10
          }
        }
        if (!config.tableKey) {
          var keys = config.keys
          var index = config.index
          config.tableKey = [{
            // 国家
            key: keys[index.regionIndex],
            width: 150,
            sortable: true
          }, {
            // 维度
            key: keys[index.osIndex],
            sortable: true
          }, {
            // 激活
            key: keys[index.activeIndex],
            sortable: true
          }, {
            // 注册
            key: keys[index.registerIndex],
            sortable: true
          }, {
            // 创角
            key: keys[index.createIndex],
            sortable: true
          }, {
            // 注册率
            key: keys[index.registerRateIndex],
            sortable: true
          }, {
            // 创角率
            key: keys[index.createRateIndex],
            sortable: true
          }, {
            // 等级前
            key: keys[index.levelBfIndex],
            sortable: true
          }, {
            // 等级后
            key: keys[index.levelAfIndex],
            sortable: true
          }, {
            // 等级到达率
            key: keys[index.levelAfRateIndex],
            sortable: true,
            width: 140
          }]

          config.tableKey.forEach(item => {
            if (!item.width) item.width = 110
          })
        }

        var { keys, index } = config
        var data = {}
        var total
        var numbers = []
        var NaNs = []
        var isLast

        state.subChannelRegionData.forEach((item, i) => {
          { // 数据处理 number 化
            var itemVal
            if (!i) {
              keys.forEach(key => {
                itemVal = item[key] * 1
                if (!isNaN(itemVal)) {
                  numbers.push(key)
                  item[key] = itemVal
                } else {
                  NaNs.push(key)
                }
              })
              total = Object.assign({}, firstData)
            } else {
              numbers.forEach(key => {
                itemVal = item[key] * 1
                item[key] = itemVal
                total[key] += itemVal
              })
            }
          }

          var levelAfRateKey = keys[index.levelAfRateIndex]
          var activeKey = keys[index.activeIndex]
          var levelAfKey = keys[index.levelAfIndex]
          item[levelAfRateKey] = (item[levelAfKey] / item[activeKey] * 100).format(2)

          var activeKey = keys[index.activeIndex]
          var registerKey = keys[index.registerIndex]
          var createKey = keys[index.createIndex]
          var registerRateKey = keys[index.registerRateIndex]
          var createRateKey = keys[index.createRateIndex]

          isLast = state.subChannelRegionData.length === i + 1
          if (isLast) { // handler calculate
            NaNs.forEach(key => {
              if (key !== keys[index.osIndex])
                total[key] = '全部'
            })

            total[registerRateKey] = (total[registerKey] / total[activeKey] * 100).format(2) + '%'
            total[createRateKey] = (total[createKey] / total[activeKey] * 100).format(2) + '%'
            total[levelAfRateKey] = (total[levelAfKey] / total[activeKey] * 100).format(2) + '%'
          }
        })
         
        data.list = state.subChannelRegionData
        data.total = total
        return data
      } else {
        return null
      }
    }
  },
  actions: {
    subChannelData(context, params) {
      var {
        commit,
        state,
        dispatch,
        getters,
        rootGetters,
        rootState,
      } = context

      var url = '/query/' + 'fn_report_media_source_site'
      return new Promise((resolve) => {
        http.post(url, params).then(data => {
          if (data.code === 401 && params.in_query_type ===2) {
            var kv = {
              key: 'subChannelData',
              value: data.state[0]
            }
            commit('set', kv)
            resolve(state.subChannelData);
          }else if(data.code === 401 && params.in_query_type ===1){
            var channelData = {channel:[],params:[]}
            for (let index = 0; index < data.state[0].length; index++) {
              channelData.channel.push({index:index,media_source:data.state[0][index].media_source})
              channelData.params.push(data.state[0][index].in_site_type.split(',').map((val)=>({in_site_type:val})))
            }            
            commit('setSubChannelInfo', channelData)
            resolve();
          }
        })
      })

    },
    subChannelRegionData(context, params) {
      var {
        commit,
        state,
        dispatch,
        getters,
        rootGetters,
        rootState,
      } = context

      var regionPromise = new Promise(resolve => {
        this.dispatch('overseas_common/getRegionMap').then(() => {
          resolve()
        })
      })

      var url = '/query/' + 'foreign_sub_site_country_query'
      return new Promise((resolve) => {
        http.post(url, params).then(data => {
          if (data.code === 401) {
            var kv = {
              key: 'subChannelRegionData',
              value: data.state[0]
            }
            regionPromise.then(data => {
              resolve()
              commit('set', kv)
            })
          }
        })
      })
    }
  }
}