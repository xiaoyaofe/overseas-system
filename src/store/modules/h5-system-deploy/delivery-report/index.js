import http from 'src/services/http'
import { Number } from 'core-js';

function getObjectByTimestamp() {
  return {
    timestamp: new Date().getTime()
  }
}

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
    // channel
    tableIsVisible:true,
    lastQueryParam: {
      comprehensive: null,
      daily: null,
      zone: null,
      channel: null,
      system: null,
    },
    channelSelectData:null,
    date: [
      moment()
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      moment()
        .add(-1, "day")
        .format("YYYY-MM-DD")
    ],
    payDate:[
      moment()
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      moment()
        .add(-1, "day")
        .format("YYYY-MM-DD")
    ],
    os: null,

    region: null,
    regionArr: [],
    game: null,
    gameArr: [],
    mailUrl: null,
    taging: null,

    comprehensive: [],
    daily: [],
    channel: [],
    zone: {},
    system: {},
    zone2: {},
    channel2: {},
    is2: false,
    channelInfo:{},
    legend:[],

    configs: {
      comprehensive: {},
      daily: {},
      system: {},
      zone: {
        zones: []
      },
      channel: {
        channels: []
      },
    },
    // 
    viewIndex:null,
    systemIndex:null,
    channelIndex:null,
    areaIndex:null,
    games:[],
    allGameId:null,
    in_app_ids:null,
    games_value:0,

  },
  mutations: {
    set_games(state,data){
      data.unshift({app_id: 0, app_name: "全部游戏"})
      state.games = data;
    },
    setGameId(state,data){
      state.allGameId = data
    },
    setAppId(state,data){
      state.in_app_ids = data;
    },
    setTaging(state, data) {
      state.taging = data
    },
    setDate(state, data) {
      state.date = data
    },
    setPayDate(state,data){
      state.payDate = data
    },
    setOs(state, data) {
      state.os = data
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
    setViewIndex(state,data){
      state.viewIndex = data
    },
    setSystemIndex(state,data){
      state.systemIndex = data
    },
    setChannelIndex(state,data){
      state.channelIndex = data
    },
    setAreaIndex(state,data){
      state.areaIndex = data
    },
    set_comprehensive(state, data) {
      state.comprehensive = data
    },
    set_daily(state,data) {
      state.daily = data
    },
    set_system(state, [key, data]) {
      var _ = getObjectByTimestamp()
      _[key] = data
      state.system = _
    },
    set_zone(state, [key, data]) {
      var _ = getObjectByTimestamp()
      _[key] = data
      state.zone = _
    },
    set_channel(state,  data) {
      state.channel = data
    },
    set_legend(state, data){
      state.legend = data
    },
    set_channelInfo(state,data) {
      state.channelInfo = data
    },

    set_zone2(state, [key, data]) {
      var _ = getObjectByTimestamp()
      _[key] = data
      state.zone2 = _
    },
    set_channel2(state, [key, data]) {
      var _ = getObjectByTimestamp()
      _[key] = data
      state.channel2 = _
    },
    set_is2(state, data) {
      state.is2 = data
    },
    set_channels(state, data) {
      state.configs.channel.channels = data
    },
    set_zones(state, data) {
      state.configs.zone.zones = data
    },
  },
  getters: {
    tellTagStatus(state, getters, state_, getters_) {
      var _ = {
        comprehensive: false,
        daily: false,
        zone: false,
        channel: false,
        system: false,
      }
      var gameId = state.gameArr[0]
      var regionId = state.regionArr[0]
      var hasGame = gameId ? true : false
      var hasRegion = regionId ? true : false
      var list1 = state_.overseas_common.list1
      var getList1 = getters_['overseas_common/getList1']
      if (list1 && list1.length) {
        _.comprehensive = !hasGame
        _.daily = true
        _.zone = hasGame
        _.channel = hasGame
        _.system = hasGame
      }
      return _
    },
    getIdStr(state) {
      if (state.gameArr.length) {
        return state.gameArr[0]
      }
      if (state.regionArr.length) {
        return state.regionArr.join(',')
      }
      return ''
    },
    getComprehensive(state, getters) {
      var field = 'Comprehensive'
      var data, total = {}
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
      function assignment(item, mma, isLast) {
        colorKey.forEach(key => {
          var val = item[key]
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
            mma[key].avg = mma[key].count ? mma[key].total / mma[key].count : 0
          }
        })
      }
      function init(arr, config) {
        if (!config.keys) {
          config.keys = Object.keys(arr[0]).map(item => item);
          // config.keys.push('LTV')
        }
        if (!config.index) {
          config.index = {
            appIdIndex:1,        //appid
            gameIndex:2,         //游戏
            registerIndex: 3,    //注册
            createIndex: 4,      //创角
            createRateIndex: 5,   //创角率
            registerCostIndex: 6,//注册成本
            createCostIndex: 7,  //创角成本
            costIndex:8,         //花费
            rechargeIndex: 9,     //充值
            roiIndex: 10,         //roi
            minuteRechargeIndex: 11,//分成充值 
            minuteIndex:12,        //分成roi
            ltv1Index: 13,         //ltv
            ltv2Index: 14,         //ltv
            ltv3Index: 15,         //ltv
            keep1Index: 16,       //次留
            keep2Index: 17,       //3日次留
            keep3Index: 18,       //7日次留
            // newCreateIndex: 12,   //
            // newCreateCostIndex: 13,
            // rechargeIndex: 17,
            // ltvIndex: 21,
            // keep1Index: 14,
            // keep2Index: 15,
            // keep3Index: 16,
            // mounthChargeIndex: 19,
            // mounthActiveIndex: 20
          }
        }
        if (!config.colorKey) {
          config.colorKey = [
            config.keys[config.index.createRateIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex]
          ]
        }
        if (!config.tableKey) {
          config.tableKey = [{
            key: config.keys[config.index.appIdIndex],
            sortable: true,
            width: 150
          }, {
            key: config.keys[config.index.gameIndex],
            sortable: true
          }, {
            key: config.keys[config.index.registerIndex],
            sortable: true
          }, {
            key: config.keys[config.index.createIndex],
            sortable: true
          }, {
            key: config.keys[config.index.createRateIndex],
            sortable: true
          }, {
            key: config.keys[config.index.registerRateIndex],
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
            key: config.keys[config.index.roiIndex],
            sortable: true
          }, {
            key: config.keys[config.index.minuteRechargeIndex],
            sortable: true
          }, {
            key: config.keys[config.index.minuteIndex],
            sortable: true,
            width: 200
          }, {
            key: config.keys[config.index.ltv1Index],
            sortable: true
          }, {
            key: config.keys[config.index.ltv2Index],
            sortable: true,
            hide: true
          }, {
            key: config.keys[config.index.ltv3Index],
            sortable: true,
            hide: true
          }, {
            key: config.keys[config.index.ltvIndex],
            sortable: true
          }, {
            key: config.keys[config.index.keep1Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep2Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep3Index],
            sortable: true
          }]
          config.tableKey.map(item => {
            if (!item.width && !item.hide)
              return item.width = getWidth(item.key)
          })

        }
        if (!config.chartKey) {
          config.chartKey = [
            config.keys[config.index.createRateIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex]
          ]
        }
      }
      if (state.comprehensive.length) {
        var arr = state.comprehensive;
        var arr_ = arr
        if (!arr.length) return null
        var config = state.configs['channel'];
        init(arr, config)
        if (state.configs.channel.channels.length) {
          arr_ = []
          arr.forEach(item => {
            var channelName = config.keys[config.index.channelIndex]
            var channel = item[channelName]
            if (state.configs.channel.channels.includes(channel)) arr_.push(item)
          })
        }
        data = {
          list: arr_,
          channel: []
        }
        var {
          keys,
          index,
          colorKey,
          tableKey
        } = config
        data.mmas = initMma()
        var isLast
        arr.forEach((item, i) => {
          keys.forEach(key => {
            var _ = item[key] * 1
            if (!isNaN(_)) {
              item[key] = _
            }
          })
          isLast = i === arr.length - 1
          assignment(item, data.mmas, isLast)
          data.channel.push(item[keys[index.channelIndex]])
          /**
           * ltv handler
           */
          // var mounthChargeKey = keys[index.mounthChargeIndex]
          // var mounthActiveKey = keys[index.mounthActiveIndex]
          // item.LTV = !item[mounthChargeKey] || !item[mounthActiveKey] ? 0 : (item[mounthChargeKey] / item[mounthActiveKey]).format(2);
        })

        arr_.forEach((item, i) => {
          isLast = i + 1 === arr_.length
          tableKey.forEach(({ key }) => {
            switch (key) {
              case keys[index.appIdIndex]:
                if (!total.hasOwnProperty(key)) {
                  total[key] = "全部"
                }
                break
              case keys[index.gameIndex]:
                if (!total.hasOwnProperty(key)) {
                  total[key] = item[key]
                }
                break
              default:
                if (!total.hasOwnProperty(key)) {
                  total[key] = item[key]
                } else {
                  total[key] = (item[key] + total[key]).format(2)
                }
                break
            }
          })
        })

       // 创角率
        var register = total[keys[index.registerIndex]]
        var create = total[keys[index.createIndex]]
        total[keys[index.createRateIndex]] = ((create / register) * 100).format(2) + '%'

       // 注册成本
        var register = total[keys[index.registerIndex]]
        var cost = total[keys[index.costIndex]]
        total[keys[index.registerCostIndex]] = (cost / register).format(2)
        // 创角成本
        var create = total[keys[index.createIndex]]
        var cost = total[keys[index.costIndex]]
        total[keys[index.createCostIndex]] = (cost / create).format(2)
        // roi
        var cost = total[keys[index.costIndex]]
        var recharge = total[keys[index.rechargeIndex]]
        total[keys[index.roiIndex]] = ((recharge / cost) * 100).format(2) + '%'
        // 分成roi
        var cost = total[keys[index.costIndex]]
        var minuteRecharge = total[keys[index.minuteRechargeIndex]]
        total[keys[index.roiIndex]] = ((minuteRecharge / cost) * 100).format(2) + '%'
        //7日Ltv
        var ltv1 = total[keys[index.ltv1Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.ltv1Index]] = ((ltv1 / register) * 100).format(2) + '%'
        //14日Ltv
        var ltv2 = total[keys[index.ltv2Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.ltv2Index]] = ((ltv2 / register) * 100).format(2) + '%'
        //30日Ltv
        var ltv3 = total[keys[index.ltv3Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.ltv3Index]] = ((ltv3 / register) * 100).format(2) + '%'
        //次日留存
        var keep1 = total[keys[index.keep1Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.keep1Index]] = ((keep1 / register) * 100).format(2) + '%'
        //3日留存
        var keep2 = total[keys[index.keep2Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.keep2Index]] = ((keep2 / register) * 100).format(2) + '%'
        //7日留存
        var keep3 = total[keys[index.keep3Index]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.keep3Index]] = ((keep3 / register) * 100).format(2) + '%'
        data.total = total
      } else {
        data = null
      }
      console.log(field + 'Data:->', data)
      return data
    },
    getDaily(state, getters) {
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
          config.keys.push('LTV');
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
            width: 150
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
            key: config.keys[config.index.roiIndex],
            sortable: true
          },{
            key: config.keys[config.index.minuteRechargeIndex],
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
            config.keys[config.index.activeCostIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex],
            config.keys[config.index.newCreateIndex],
          ]
        }
      }
      var dailyData

      if (state.daily[getters.getIdStr]) {
        var arr = state.daily[getters.getIdStr][0];
        var config = state.configs.daily;
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
            case keys[index.registerRateIndex]://注册率
              var active = dailyData.total[keys[index.activeIndex]]
              var register = dailyData.total[keys[index.registerIndex]]
              dailyData.total[key] = ((register / active) * 100).format(2) + '%'
              break;
            case keys[index.createRateIndex]://创角率
              var active = dailyData.total[keys[index.activeIndex]]
              var create = dailyData.total[keys[index.createIndex]]
              dailyData.total[key] = ((create / active) * 100).format(2) + '%'
              break;
            case keys[index.activeCostIndex]://激活成本
              var active = dailyData.total[keys[index.activeIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / active).format(2)
              break;
            case keys[index.registerCostIndex]://注册成本
              var register = dailyData.total[keys[index.registerIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / register).format(2)
              break;
            case keys[index.createCostIndex]://创角成本
              var create = dailyData.total[keys[index.createIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = (cost / create).format(2)
              break;
            case keys[index.roiIndex]://ROI
              var roi = dailyData.total[keys[index.rechargeIndex]]
              var cost = dailyData.total[keys[index.costIndex]]
              dailyData.total[key] = ((roi / cost)*100).format(2) + '%'
              break;
            case keys[index.minuteIndex]://分成ROI
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
            default://留存
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
      
      console.log('dailyData:->', dailyData)
      return dailyData
    },
    //
    getAllChannel(state, getters){
      var arr
      if (state.channel && state.channel.length) {
        arr = state.channel;
        console.log(">>>>>>>>>>>>>>>>>>>>new",arr);
        for (let index = 0; index < arr.length; index++) {
          Object.keys(arr[index]).forEach((key, flag) => {
            if (flag>=2) {
              arr[index][key] = +arr[index][key];
            }
          })
        }
        
       
      }
      return arr
    },
    getChannelInfo(state,getters){
      var channelName = []
      var channelNameData = []
      var allData = []
      if (state.channelInfo && state.channelInfo.length) {
        allData = state.channelInfo;
        //获取筛选框联动数据
        for (let index = 0; index < allData.length; index++) {
          if (allData[index].media_source && channelName.indexOf(allData[index].media_source)<0) {
            channelName.push(allData[index].media_source)
          }
        }
        for (let index = 0; index < channelName.length; index++) {          
          channelName[index] = {lable:channelName[index],value:''+(index+1)}
          channelNameData.push(allData.filter(todo => todo.media_source == channelName[index]['lable']))
          for (let msg = 0; msg < channelNameData[index].length; msg++) {
              channelNameData[index][msg].label = channelNameData[index][msg].country_name;
              channelNameData[index][msg].value = channelNameData[index][msg]["国家"];
              channelNameData[index][msg].key = Math.random();
            }
          channelNameData[index].unshift({"label": '全部', "value": 'all', "key": Math.random() })
        }
        channelName.unshift({lable: "全部", value: 'all'})
        channelNameData.unshift(allData)
        channelNameData[0].unshift({"label": '全部', "value": 'all', "key": Math.random()})
      }
      // console.log('getChannelInfogetChannelInfo',{'channelName':channelName,'channelNameData':channelNameData,})
      state.channelSelectData =  {'channelName':channelName,'channelNameData':channelNameData,};
      return {'channelName':channelName,'channelNameData':channelNameData,}
    },
    getDailyList(state,getters){
      var mmas = {}
      var allData = []
      if (state.comprehensive && state.comprehensive.length) {
        allData = state.comprehensive;
        // 获取mmas
        var titleArr = {};
        Object.keys(allData[0]).forEach((key, index) => {
            //预期数据结构
            if (index>=4 && index<=6) {
              titleArr[key] = {avg:0,count:0,isReversal:false,max:0,min:0,total:0}
            }
        })
        Object.assign(mmas,titleArr)
        Object.keys(mmas).forEach((key,index)=>{
          allData.filter(todo => todo[key])
          var total = 0;
          var count = 0;
          var dataArr = [];
          for (let msg = 0; msg < allData.filter(todo => todo[key]).length; msg++) {
            total += +allData.filter(todo => todo[key])[msg][key];
            dataArr.push(+allData.filter(todo => todo[key])[msg][key]) 
            if (+allData.filter(todo => todo[key])[msg][key]) {
              count++
            }
            
          }
          if (key == '创角成本' || key == '注册成本') {
            mmas[key].isReversal = true;
          }
          mmas[key].total = total;
          mmas[key].count = count;
          mmas[key].avg = count ? (total/count).format(2) : 0;
          mmas[key].max = eval("Math.max(" + dataArr + ")");
          mmas[key].min = eval("Math.min(" + dataArr + ")");
        })
        // console.log('mmasmmasmmasmmasmmasmmasmmasmmasmmas————————————————————————',mmas)
      }
      return {'data':allData,'mmas':mmas}
    },
    getChannelList(state,getters){
      var mmas = {}
      var allData = []
      if (state['channel'][getters.getIdStr] && state['channel'][getters.getIdStr][0].length) {
        allData = state['channel'][getters.getIdStr][0];
        // 获取mmas
        var titleArr = {};
        Object.keys(allData[0]).forEach((key, index) => {
            //预期数据结构
            if (index>=5 && index<=9) {
              titleArr[key] = {avg:0,count:0,isReversal:false,max:0,min:0,total:0}
            }
        })
        Object.assign(mmas,titleArr)
        Object.keys(mmas).forEach((key,index)=>{
          allData.filter(todo => todo[key])
          var total = 0;
          var count = 0;
          var dataArr = [];
          for (let msg = 0; msg < allData.filter(todo => todo[key]).length; msg++) {
            total += +allData.filter(todo => todo[key])[msg][key];
            dataArr.push(+allData.filter(todo => todo[key])[msg][key]) 
            if (+allData.filter(todo => todo[key])[msg][key]) {
              count++
            }
            
          }
          if (key == '创角成本' || key == '注册成本' || key == '激活成本') {
            mmas[key].isReversal = true;
          }
          mmas[key].total = total;
          mmas[key].count = count;
          mmas[key].avg = count ? (total/count).format(2) : 0;
          mmas[key].max = eval("Math.max(" + dataArr + ")");
          mmas[key].min = eval("Math.min(" + dataArr + ")");
        })
        // console.log('mmasmmasmmasmmasmmasmmasmmasmmasmmas————————————————————————',mmas)
      }
      return {'data':allData,'mmas':mmas}
    },
    getComprehensiveList(state,getters){
      var mmas = {}
      var allData = []
      if (state.comprehensive && state.comprehensive.length) {
        allData = state.comprehensive;
        // 获取mmas
        var titleArr = {};
        Object.keys(allData[0]).forEach((key, index) => {
            //预期数据结构
            if (index>=4 && index<=6) {
              titleArr[key] = {avg:0,count:0,isReversal:false,max:0,min:0,total:0}
            }
        })
        Object.assign(mmas,titleArr)
        Object.keys(mmas).forEach((key,index)=>{
          allData.filter(todo => todo[key])
          var total = 0;
          var count = 0;
          var dataArr = [];
          for (let msg = 0; msg < allData.filter(todo => todo[key]).length; msg++) {
            total += +allData.filter(todo => todo[key])[msg][key];
            dataArr.push(+allData.filter(todo => todo[key])[msg][key]) 
            if (+allData.filter(todo => todo[key])[msg][key]) {
              count++
            }
            
          }
          if (key == '创角成本' || key == '注册成本') {
            mmas[key].isReversal = true;
          }
          mmas[key].total = total;
          mmas[key].count = count;
          mmas[key].avg = count ? (total/count).format(2) : 0;
          mmas[key].max = eval("Math.max(" + dataArr + ")");
          mmas[key].min = eval("Math.min(" + dataArr + ")");
        })
        // console.log('mmasmmasmmasmmasmmasmmasmmasmmasmmas————————————————————————',mmas)
      }
      return {'data':allData,'mmas':mmas}
    },
    getLengendData(state,getters){
      var arr
      var leftlistArr = [];//左边列表
      var rightListArr = [];//右边列表
      var lineData = [];//折线图数据
      var lineSelect = [];//折线图数据选择列表
      var xList = [];//横坐标
      var channelList = [];//渠道列表
      var channelArr = [];//渠道数据
      var totalArr = [];//每日总计数据
      var restaurants = [];//搜索框数据
      if (state.legend && state.legend.length) {
        arr = state.legend;
        // 获取横坐标
        arr.filter(function(item, index){
            if(xList.indexOf(item['注册时间'])<0){
              xList.push(item['注册时间'])
            }
        })
        // console.log('xListxListxList',xList)_________________________________________________
        // 获取lineSelect
        Object.keys(arr[0]).forEach((key, index) => {
          if (index>=2) {
            lineSelect.push({value:index-2,label:key})
          }
        })
        // console.log('lineSelectlineSelect',lineSelect)________________________________________
        // 获取每天各渠道参数的total
        var everyDate = []
        var everyDataTotal = []
        for (let index = 0; index < xList.length; index++) {
          everyDate.push(arr.filter(todo => todo['注册时间'] == xList[index]))
          everyDataTotal.push([])
            for (let fil = 0; fil < lineSelect.length; fil++) {
              var total = 0;
              for (let msg = 0; msg < everyDate[index].length; msg++) {
                var next = everyDate[index][msg][lineSelect[fil].label]
                total += +next
              }
              // console.log(lineSelect[fil].label, total)
              everyDataTotal[index].push(total.format(2))
            }
          // console.log('_________________________第'+index+'日的数据', arr.filter(todo => todo.install_date == xList[index]))
        }
        
        // console.log('everyDate',everyDate)____________________________________________________
        for (let evr = 0; evr < everyDataTotal.length; evr++) {
          everyDataTotal[evr][2] = ((everyDataTotal[evr][1]/everyDataTotal[evr][0])*100).format(2)//注册率
          everyDataTotal[evr][3] = ((everyDataTotal[evr][5]/everyDataTotal[evr][0])).format(2); //注册成本
          everyDataTotal[evr][4] = ((everyDataTotal[evr][5]/everyDataTotal[evr][1])).format(2);//创角成本
        }
        // console.log('everyDataTotal',everyDataTotal)
        // 获取渠道列表
        for (let index = 0; index < everyDate[0].length; index++) {
            channelList.push(everyDate[0][index].view_type)
            channelArr.push(arr.filter(todo => todo.view_type == channelList[index]))
            leftlistArr.push({ 'name': everyDate[0][index].view_type, 'visible': true })
            rightListArr.push({ 'name': everyDate[0][index].view_type, 'visible': false })
            restaurants.push({value:everyDate[0][index].view_type,address:index+1})
        }
        leftlistArr.unshift({ 'name': 'total', 'visible': false })
        rightListArr.unshift({ 'name': 'total', 'visible': true })
        restaurants.unshift({value:'total',address:0})
        // console.log('channelArr',channelArr)___________________________________________________
        for (let index = 0; index < everyDataTotal[0].length; index++) {
          totalArr.push([])
          for (let msg = 0; msg < everyDataTotal.length; msg++) {
            totalArr[index].push(everyDataTotal[msg][index])
          }
        }
        // console.log('totalArr', totalArr)_______________________________________________________
        // 15个下拉选项
        for (let msg = 0; msg < lineSelect.length; msg++) {
          lineData.push([])
          //每个选项4条渠道数据
          for (let flag = 0; flag < channelList.length; flag++) {
            lineData[msg].push({name:channelList[flag],data:[],visible:false})
            // 筛选获得各渠道每天的数据
            for (let page = 0; page < channelArr[flag].length; page++) {
              lineData[msg][flag].data.push(+channelArr[flag][page][lineSelect[msg].label])
            }
          }
        }
        for (let index = 0; index < lineData.length; index++) {
            lineData[index].unshift({name:'total',data:totalArr[index],visible:true})
        }
      }
      console.log('getLengendData---->', {'leftlistArr':leftlistArr,
      'rightListArr':rightListArr,
      'lineData':lineData,
      'lineSelect':lineSelect,
      'xList':xList,
      'channelList':channelList,
      'restaurants':restaurants})
      return {'leftlistArr':leftlistArr,
              'rightListArr':rightListArr,
              'lineData':lineData,
              'lineSelect':lineSelect,
              'xList':xList,
              'channelList':channelList,
              'restaurants':restaurants}

    },
    
    getZone(state, getters) {
      var field = state.is2 ? 'zone2' : 'zone'
      var data, total = {}
      function initMma() {
        var mma = {}
        colorKey.forEach(key => {
          mma[key] = {
            min: Infinity,
            max: 0,
            avg: 0,
            isReversal: [keys[index.createCostIndex], keys[index.activeCostIndex], keys[index.registerCostIndex]].indexOf(key) === -1 ? false : true,
            total: 0,
            count: 0
          }
        })
        return mma
      }

      function assignment(item, mma, isLast) {
        colorKey.forEach(key => {
          var val = item[key]
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
            mma[key].avg = mma[key].count ? mma[key].total / mma[key].count : 0
          }
        })
      }

      function init(arr, config) {
        if (!config.keys) {
          config.keys = Object.keys(arr[0]).map(item => item);
          config.keys.push('LTV')
          config.keys.push('激活成本')
          console.log(config.keys)
        }
        if (!config.index) {
          config.index = {
            countryIndex: 0,
            osIndex: 1,
            activeIndex: 2,
            registerIndex: 3,
            createIndex: 4,
            registerRateIndex: 5,
            createRateIndex: 6,
            registerCostIndex: 7,
            createCostIndex: 8,
            rechargeIndex: 9,
            costIndex: 10,
            keep1Index: 11,
            keep2Index: 12,
            keep3Index: 13,
            roiIndex: 14,
            mounthChargeIndex: 15,
            mounthActiveIndex: 16,
            ltvIndex: 17,
            activeCostIndex: 18
          }
        }
        if (!config.colorKey) {
          config.colorKey = [
            config.keys[config.index.registerRateIndex],
            config.keys[config.index.createRateIndex],
            config.keys[config.index.registerCostIndex],
            config.keys[config.index.createCostIndex],
            config.keys[config.index.activeCostIndex]
          ]
        }
        if (!config.tableKey) {
          config.tableKey = [{
            key: config.keys[config.index.countryIndex],
            sortable: true,
            width: 150
          },
          {
            key: config.keys[config.index.osIndex],
            sortable: false
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
            sortable: true,
            width: 200
          }, {
            key: config.keys[config.index.roiIndex],
            sortable: true
          }, {
            key: config.keys[config.index.mounthChargeIndex],
            hide: true
          }, {
            key: config.keys[config.index.mounthActiveIndex],
            hide: true
          }, {
            key: config.keys[config.index.ltvIndex],
            sortable: true
          }, {
            key: config.keys[config.index.keep1Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep2Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep3Index],
            sortable: true
          }]

          config.tableKey.map(item => {
            if (!item.hasOwnProperty('width'))
              return item.width = getWidth(item.key)
          })
        }
        if (!config.chartKey) {
          config.chartKey = [
            config.keys[config.index.activeIndex],
            config.keys[config.index.registerIndex],
            config.keys[config.index.createIndex],
          ]
        }
      }
      if (state[field][getters.getIdStr]) {
        var arr = state[field][getters.getIdStr][0];
        var arr_ = arr
        if (!arr.length) return null
        var config = state.configs['zone'];
        init(arr, config)
        if (state.configs.zone.zones.length) {
          arr_ = []
          arr.forEach(item => {
            var zoneName = config.keys[config.index.countryIndex]
            var zone = item[zoneName]
            zone = arguments[2].overseas_common.regionMap[zone] || zone
            if (state.configs.zone.zones.includes(zone)) arr_.push(item)
          })
        }

        data = {
          list: arr_,
          zone: [],
          zones: []
        }

        var {
          keys,
          index,
          colorKey,
          tableKey,
          chartKey
        } = config

        data.mmas = initMma()
        var isLast
        arr.forEach((item, i) => {
          keys.forEach(key => {
            var _ = item[key] * 1
            if (!isNaN(_)) {
              item[key] = _
            }
          })

          /**
          * ltv handler
          */
          var mounthChargeKey = keys[index.mounthChargeIndex]
          var mounthActiveKey = keys[index.mounthActiveIndex]
          item.LTV = !item[mounthChargeKey] || !item[mounthActiveKey] ? 0 : (item[mounthChargeKey] / item[mounthActiveKey]).format(2);

          /**
          * activeCost handler
          */
          var recharge = item[keys[index.rechargeIndex]]
          var _cost = item[keys[index.costIndex]]
          var active = item[keys[index.activeIndex]]
          item[keys[index.activeCostIndex]] = !_cost || !active ? 0 : (_cost / active).format(2);

          if (i < 5) {
            data.zone.push(arr[i][keys[index.countryIndex]])
          }
          data.zones.push(arr[i][keys[index.countryIndex]])
          isLast = i + 1 === arr.length
          assignment(item, data.mmas, isLast)



        })

        arr_.forEach((item, i) => {
          isLast = i + 1 === arr_.length
          tableKey.forEach(({ key }) => {
            switch (key) {
              case keys[index.countryIndex]:
                if (!total.hasOwnProperty(key)) {
                  total[key] = "全部"
                }
                break
              case keys[index.osIndex]:
                if (!total.hasOwnProperty(key)) {
                  total[key] = item[key]
                }
                break
              default:
                if (!total.hasOwnProperty(key)) {
                  total[key] = item[key]
                } else {
                  total[key] = (item[key] + total[key]).format(2)
                }
                break
            }
          })
        })


        var active = total[keys[index.activeIndex]]
        var register = total[keys[index.registerIndex]]
        total[keys[index.registerRateIndex]] = ((register / active) * 100).format(2) + '%'

        var active = total[keys[index.activeIndex]]
        var create = total[keys[index.createIndex]]
        total[keys[index.createRateIndex]] = ((create / active) * 100).format(2) + '%'

        var active = total[keys[index.activeIndex]]
        var cost = total[keys[index.costIndex]]
        total[keys[index.activeCostIndex]] = (cost / active).format(2)

        var register = total[keys[index.registerIndex]]
        var cost = total[keys[index.costIndex]]
        total[keys[index.registerCostIndex]] = (cost / register).format(2)

        var create = total[keys[index.createIndex]]
        var cost = total[keys[index.costIndex]]
        total[keys[index.createCostIndex]] = (cost / create).format(2)

        var cost = total[keys[index.costIndex]]
        var recharge = total[keys[index.rechargeIndex]]
        total[keys[index.roiIndex]] = ((recharge / cost) * 100).format(2) + '%'

        var mounthChargeKey = keys[index.mounthChargeIndex]
        var mounthActiveKey = keys[index.mounthActiveIndex]
        total[keys[index.ltvIndex]] = !total[mounthChargeKey] || !total[mounthActiveKey] ? 0 : (total[mounthChargeKey] / total[mounthActiveKey]).format(2);

        [keys[index.keep1Index], keys[index.keep2Index], keys[index.keep3Index]].forEach(key => {
          var keyValue = total[key]
          var active = total[keys[index.activeIndex]]
          total[key] = ((keyValue / active) * 100).format(2) + '%'
        })

        data.total = total
      } else {
        data = null
      }
      console.log(field + 'Data:->', data)
      return data
    },

    getSystem(state, getters) {
      var field = 'system'
      class Data {
        constructor() {
          this.channelData = {}
          this.regionData = {}
        }
      }

      function init(arr, config) {
        if (!config.keys) {
          config.keys = Object.keys(arr[0]).map(item => item);
          config.keys.push('LTV')
          console.log(config.keys)
        }
        if (!config.index) {

          config.index = {
            appidIndex: 0,
            regionIndex: 1,
            channelIndex: 2,
            osIndex: 3,
            activeIndex: 4,
            registerIndex: 5,
            createIndex: 6,
            costIndex: 7,
            activeCostIndex: 8,
            registerRateIndex: 9,
            createRateIndex: 10,
            registerCostIndex: 11,
            createCostIndex: 12,
            newCreateIndex: 13,
            newCreateCostIndex: 14,
            keep1Index: 15,
            keep2Index: 16,
            keep3Index: 17,
            rechargeIndex: 18,
            roiIndex: 19,
            mounthChargeIndex: 20,
            mounthActiveIndex: 21,
            sortIndex: 22,
            ltvIndex: 23,
          }
        }
        if (!config.colorKey) {
          config.colorKey = []
        }
        if (!config.tableKey) {
          config.tableKey = [{
            key: config.keys[config.index.osIndex],
            sortable: false
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
            key: config.keys[config.index.roiIndex],
            sortable: true
          }, {
            key: config.keys[config.index.ltvIndex],
            sortable: true
          }, {
            key: config.keys[config.index.keep1Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep2Index],
            sortable: true
          }, {
            key: config.keys[config.index.keep3Index],
            sortable: true
          }]

          config.tableKey.map(item => {
            if (!item.hasOwnProperty('width'))
              return item.width = getWidth(item.key)
          })
        }
        if (!config.chartKey) {
          config.chartKey = [
            '安卓',
            'IOS',
          ]
        }
        if (!config.chartList) {
          config.chartList = [
            config.keys[config.index.activeIndex],
            config.keys[config.index.costIndex],
            config.keys[config.index.registerIndex],
            config.keys[config.index.registerRateIndex],
          ];
        }
        if (!config.curChartKey) {
          config.curChartKey = config.chartList[0]
        }
        if (!config.tag) {
          config.tag = "channelData"
        }
        if (!config.category) {
          config.category = null
        }
      }
      var data = null
      if (state[field][getters.getIdStr]) {
        var arr = state[field][getters.getIdStr][0];
        if (!arr.length) return null

        var config = state.configs[field];
        init(arr, config)
        var {
          keys,
          index,
          colorKey,
          tableKey,
          chartKey
        } = config
        var channelKey = keys[index.channelIndex]
        var osKey = keys[index.osIndex]
        var regionKey = keys[index.regionIndex]
        var isNaNList = []
        var totalList = []
        data = new Data()
        arr.forEach((item, i) => {
          keys.forEach(key => {
            var _ = item[key] * 1
            if (!isNaN(_)) {
              item[key] = _
            } else {
              !i && isNaNList.push(key)
            }
          })

          var channel = item[channelKey]
          var os = item[osKey]
          var region = item[regionKey]

          /**channel 1 */
          if (!data.channelData.hasOwnProperty(channel)) {
            data.channelData[channel] = {
              system: {},
              category: {},
              total: Object.assign({}, item)
            }
            data.channelData[channel].total[osKey] = "全部"
            totalList.push(data.channelData[channel].total)
          } else {
            var total = data.channelData[channel].total
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }
          /**region 1 */
          if (!data.regionData.hasOwnProperty(region)) {
            data.regionData[region] = {
              system: {},
              category: {},
              total: Object.assign({}, item)
            }
            data.regionData[region].total[osKey] = "全部"
            totalList.push(data.regionData[region].total)
          } else {
            var total = data.regionData[region].total
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }

          /**channel 2 */
          if (!data.channelData[channel].system.hasOwnProperty(os)) {
            data.channelData[channel].system[os] = Object.assign({}, item)
            totalList.push(data.channelData[channel].system[os])
          } else {
            var total = data.channelData[channel].system[os]
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }
          /**region 2 */
          if (!data.regionData[region].system.hasOwnProperty(os)) {
            data.regionData[region].system[os] = Object.assign({}, item)
            totalList.push(data.regionData[region].system[os])
          } else {
            var total = data.regionData[region].system[os]
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }

          /**channel 3 */
          if (!data.channelData[channel].category.hasOwnProperty(region)) {
            data.channelData[channel].category[region] = {
              system: {},
              total: Object.assign({}, item)
            }
            data.channelData[channel].category[region].total[osKey] = "全部"
            totalList.push(data.channelData[channel].category[region].total)
          } else {
            var total = data.channelData[channel].category[region].total
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }
          /**region 3 */
          if (!data.regionData[region].category.hasOwnProperty(channel)) {
            data.regionData[region].category[channel] = {
              system: {},
              total: Object.assign({}, item)
            }
            data.regionData[region].category[channel].total[osKey] = "全部"
            totalList.push(data.regionData[region].category[channel].total)
          } else {
            var total = data.regionData[region].category[channel].total
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }

          /**channel 4 */
          if (!data.channelData[channel].category[region].system.hasOwnProperty(os)) {
            data.channelData[channel].category[region].system[os] = Object.assign({}, item)
            totalList.push(data.channelData[channel].category[region].system[os])
          } else {
            var total = data.channelData[channel].category[region].system[os]
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }
          /**region 4 */
          if (!data.regionData[region].category[channel].system.hasOwnProperty(os)) {
            data.regionData[region].category[channel].system[os] = Object.assign({}, item)
            totalList.push(data.regionData[region].category[channel].system[os])
          } else {
            var total = data.regionData[region].category[channel].system[os]
            for (var key in item) {
              if (isNaNList.indexOf(key) === -1) {
                total[key] = (total[key] + item[key]).format(2)
              }
            }
          }
        })
        handler()

        function handler() {
          totalList.forEach(total => {

            var charge = total[keys[index.mounthChargeIndex]]
            var active = total[keys[index.mounthActiveIndex]]
            total.LTV = !charge || !active ? 0 : (charge / active).format(2)

            var keeps = [
              keys[index.keep1Index],
              keys[index.keep2Index],
              keys[index.keep3Index]
            ]
            keeps.forEach(keep => {
              total[keep] = (total[keep] / total[keys[index.activeIndex]] * 100).format(2) + '%'
            })

            for (var key in total) {
              switch (key) {
                case keys[index.registerRateIndex]:
                  var active = total[keys[index.activeIndex]]
                  var register = total[keys[index.registerIndex]]
                  total[key] = ((register / active) * 100).format(2) + '%'
                  break;
                case keys[index.createRateIndex]:
                  var active = total[keys[index.activeIndex]]
                  var create = total[keys[index.createIndex]]
                  total[key] = ((create / active) * 100).format(2) + '%'
                  break;
                case keys[index.activeCostIndex]:
                  var active = total[keys[index.activeIndex]]
                  var cost = total[keys[index.costIndex]]
                  total[key] = (cost / active).format(2)
                  break;
                case keys[index.registerCostIndex]:
                  var register = total[keys[index.registerIndex]]
                  var cost = total[keys[index.costIndex]]
                  total[key] = (cost / register).format(2)
                  break;
                case keys[index.createCostIndex]:
                  var create = total[keys[index.createIndex]]
                  var cost = total[keys[index.costIndex]]
                  total[key] = (cost / create).format(2)
                  break;
                case keys[index.roiIndex]:
                  var cost = total[keys[index.costIndex]]
                  var recharge = total[keys[index.rechargeIndex]]
                  total[key] = ((recharge / cost) * 100).format(2) + '%'
                  break;
              }
            }
          })
        }
      }
      console.log(field + 'Data:->', data)
      return data
    },

  },
  actions: {
    getReportInfo(context, {
      params,
      tag,
      is2
    }) {
      var {
        commit,
        state,
        dispatch,
        getters,
        rootGetters,
        rootState,
      } = context

      if (is2) {
        commit('set_is2', true)
      } else {
        commit('set_is2', false)
      }
      var url = '/query/' + rootGetters.getMenu[Config.H5DeliveryReportId].dataView[0]
      console.log("Params:->", params)

      var promise1 = new Promise((resolve) => {
        http.post(url, params).then(data => {
          if (data.code == 401 ) {
              if (tag=='games') {
                state.in_app_ids = data.state[0].map(x => x.app_id).join(",")
                state.allGameId = data.state[0].map(x => x.app_id).join(",")
              }
              commit("set_" + tag, data.state[0]);
              resolve(data.state)  
          } else {
            this.$notify.warning({
              message: data.message
            })
            consoel.error(message)
          }
        })
      })
      if (tag.indexOf('zone') !== -1 || tag === 'system') {
        var promise2 = new Promise(resolve => {
          this.dispatch('overseas_common/getRegionMap').then(() => {
            resolve()
          })
        })
        return Promise.all([
          promise1,
          promise2
        ])
      } else {
        return promise1
      }


    }
  }
}