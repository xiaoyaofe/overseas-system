let obj
if (IS_DEV) {
  obj = {
    7: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    8: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    9: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    101: {
      name: 'five-min-view',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/five-minutes-view'
        ], resolve)
    },
    102: {
      name: 'online-data',
      component: resolve =>
        require(['src/views/modules/operationMonitoring/online-data'], resolve)
    },
    103: {
      name: 'five-force-model',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/five-force-model'
        ], resolve)
    },
    104: {
      name: 'new-server-monitor',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/new-server-monitor'
        ], resolve)
    },
    105:{
      name:'new-user-payout-ratio',
      component:resolve =>
        require([
          'src/views/modules/operationMonitoring/new-user-payout-ratio'
        ],resolve)

    },
    106:{
      name:'big-R-user',
      component:resolve =>
        require([
          'src/views/modules/operationMonitoring/big-R-user'
        ],resolve)
    },
    107:{
      name:'plate-board',
      component:resolve =>
        require([
          'src/views/modules/operationMonitoring/plate-board'
        ],resolve)
    },
    108: {
      name: 'channel-distribution',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/channel-distribution'
        ], resolve)
    },
    201: {
      name: 'five-force',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/fiveForce/'], resolve)
    },
    202: {
      name: 'index-trend',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/indexTrendPlant'], resolve)
    },
    203: {
      name: 'active-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/activeUser'], resolve)
    },
    204: {
      name: 'dish-plate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/dishPlate'], resolve)
    },
    205: {
      name: 'dish-plate-by-game',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/dishPlateByGame'], resolve)
    },
    206: {
      name: 'new-user-reg-income-rate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/newUserRegIncomeRate'], resolve)
    },
    207: {
      name: 'login-rate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/loginRate'], resolve)
    },
    208: {
      name: 'new-user-step-retain',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/newUserStepRetain'
        ], resolve)
    },
    210: {
      name: 'retain-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/retainUser'], resolve)
    },
    211: {
      name: 'lose-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/loseUser'], resolve)
    },
    212: {
      name: 'back-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/backUser'], resolve)
    },
    213: {
      name: 'online-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/onlineUser'], resolve)
    },
    214: {
      name: 'added-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/addedUser'], resolve)
    },
    215: {
      name: 'new-user-retain',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/newUserRetainRate'], resolve)
    },
    216: {
      name: 'tourist-conversion',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/touristConversion'
        ], resolve)
    },
    217: {
      name: 'R-Account',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/R-account'], resolve)
    },
    218: {
      name: 'data-overview',
      component: resolve =>
        require(['src/views/modules/overview/data-overview'], resolve)
    },
    219: {
      name: 'game-overview',
      component: resolve =>
        require(['src/views/modules/overview/game-overview'], resolve)
    },
    // 301: {
    //   name: 'area-analysis',
    //   component: resolve =>
    //     require(['src/views/modules/userBehaviorAnalysis/areaAnalysis'], resolve)
    // },
    301: {
      name: 'fn_report_plate',
      component: resolve =>
        require(['src/views/modules/operationMonitoring/fn_report_plate'], resolve)
    },
    302: {
      name: 'recharge-mode',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/rechargeMode'], resolve)
    },
    303: {
      name: 'firstPay',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/firstPay'], resolve)
    },
    304: {
      name: 'warTypeAnalysis',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/warTypeAnalysis'
        ], resolve)
    },
    305: {
      name: 'copyAnalysis',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/copyAnalysis'], resolve)
    },
    306: {
      name: 'sysParticipation',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/sysParticipation'
        ], resolve)
    },
    307: {
      name: 'sysSaturation',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/sysSaturation'], resolve)
    },
    401: {
      name: 'recharge-hot-plant',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/rechargeHotPlant'], resolve)
    },
    402: {
      name: 'big-customer-trend',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/bigCustomerTrend'], resolve)
    },
    403: {
      name: 'fashionConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/fashionConsum'], resolve)
    },
    404: {
      name: 'hotConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/hotConsum'], resolve)
    },
    405: {
      name: 'timeLimitConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/timeLimitConsum'], resolve)
    },
    406: {
      name: 'payHotPlant',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/payHotPlant'], resolve)
    },
    501: {
      name: 'recharge-order',
      component: resolve =>
        require(['src/views/modules/formData/rechargeOrder'], resolve)
    },
    502: {
      name: 'first-pay-detail',
      component: resolve =>
        require(['src/views/modules/formData/firstPayDetail'], resolve)
    },
    503: {
      name: 'reg-detail',
      component: resolve =>
        require(['src/views/modules/formData/regDetail'], resolve)
    },
    601: {
      name: "market",
      component: resolve =>
        require(['src/views/modules/reports/markets'], resolve)
    },
    1001: {
      name: "market",
      component: resolve =>
        require(['src/views/modules/reports/markets'], resolve)
    },
    1002: {
      name: "real-time",
      component: resolve =>
        require(['src/views/modules/reports/real-time'], resolve)
    },
    1003: {
      name: "sub-channel-reports",
      component: resolve =>
        require(['src/views/modules/subChannel/reports'], resolve)
    },
    1004:{
      name: "reconciliation",
      component: resolve =>
        require(['src/views/modules/reports/reconciliation'], resolve)
    },
    1101: {
      name: "complement",
      component: resolve =>
        require(['src/views/modules/data/complement'], resolve)
    },
    1102: {
      name: "pkg_manager",
      component: resolve =>
        require(['src/views/modules/data/pkg_manager'], resolve)
    },
    1105:{
      name:'divided_into',
      component:resolve => 
        require(['src/views/modules/data/divided_into'],resolve)
    },
    1201: {
      name: "overall_status",
      component: resolve => require(['src/views/modules/operationMonitoring/roi/overall_status'], resolve)
    },
    1202:{
      name: "service_status",
      component: resolve => require(['src/views/modules/operationMonitoring/roi/service_status'], resolve)
    },
    1203:{
      name:"channel_status",
      component: resolve => require(['src/views/modules/operationMonitoring/roi/channel_status'], resolve)
    },
    1204: {
      name: "budget-complement",
      component: resolve => require(['src/views/modules/data/budget'], resolve)
    },
    1301:{
      name:"h5-game-url",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-game-url'], resolve)
    },
    1302:{
      name: "h5-channel-configuration",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-channel-configuration'], resolve)
    },
    1303:{
      name: "h5-game-link",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-game-link'], resolve)
    },
    1304:{
      name: "h5-data-supplement",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-data-supplement'], resolve)
    },
    1305:{
      name: "h5-budget-supplement",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-budget-supplement'], resolve)
    },
    1306:{
      name: "h5-divided-into-supplements",
      component: resolve => require(['src/views/modules/h5_system/h5-common-configuration/h5-divided-into-supplements'], resolve)
    },
    1401:{
      name: "h5-delivery-report",
      component: resolve => require(['src/views/modules/h5_system/h5-report/h5-delivery-report'], resolve)
    },
    1402:{
      name: "h5-detailed-report",
      component: resolve => require(['src/views/modules/h5_system/h5-report/h5-detailed-report'], resolve)
    },
  }


  


} else {
  obj = {
    7: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    8: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    9: {
      name: 'feedback',
      component: resolve =>
        require([
          'src/views/modules/feedback'
        ], resolve)
    },
    101: {
      name: 'five-min-view',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/five-minutes-view'
        ], resolve)
    },
    102: {
      name: 'online-data',
      component: resolve =>
        require(['src/views/modules/operationMonitoring/online-data'], resolve)
    },
    103: {
      name: 'virtual-currency',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/virtual-currency'
        ], resolve)
    },
    104: {
      name: 'new-server-monitor',
      component: resolve =>
        require([
          'src/views/modules/operationMonitoring/new-server-monitor'
        ], resolve)
    },
    201: {
      name: 'five-force',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/fiveForce/'], resolve)
    },
    202: {
      name: 'index-trend',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/indexTrendPlant'], resolve)
    },
    203: {
      name: 'active-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/activeUser'], resolve)
    },
    204: {
      name: 'dish-plate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/dishPlate'], resolve)
    },
    205: {
      name: 'dish-plate-by-game',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/dishPlateByGame'], resolve)
    },
    206: {
      name: 'new-user-reg-income-rate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/newUserRegIncomeRate'], resolve)
    },
    207: {
      name: 'login-rate',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/loginRate'], resolve)
    },
    208: {
      name: 'new-user-step-retain',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/newUserStepRetain'
        ], resolve)
    },
    210: {
      name: 'retain-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/retainUser'], resolve)
    },
    211: {
      name: 'lose-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/loseUser'], resolve)
    },
    212: {
      name: 'back-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/backUser'], resolve)
    },
    213: {
      name: 'online-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/onlineUser'], resolve)
    },
    214: {
      name: 'added-user',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/addedUser'], resolve)
    },
    215: {
      name: 'new-user-retain',
      component: resolve =>
        require(['src/views/modules/indexAnalysis/newUserRetainRate'], resolve)
    },
    216: {
      name: 'tourist-conversion',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/touristConversion'
        ], resolve)
    },
    217: {
      name: 'R-Account',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/R-account'], resolve)
    },
    218: {
      name: 'data-overview',
      component: resolve =>
        require(['src/views/modules/overview/data-overview'], resolve)
    },
    219: {
      name: 'game-overview',
      component: resolve =>
        require(['src/views/modules/overview/game-overview'], resolve)
    },
    301: {
      name: 'area-analysis',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/areaAnalysis'], resolve)
    },
    302: {
      name: 'recharge-mode',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/rechargeMode'], resolve)
    },
    303: {
      name: 'firstPay',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/firstPay'], resolve)
    },
    304: {
      name: 'warTypeAnalysis',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/warTypeAnalysis'
        ], resolve)
    },
    305: {
      name: 'copyAnalysis',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/copyAnalysis'], resolve)
    },
    306: {
      name: 'sysParticipation',
      component: resolve =>
        require([
          'src/views/modules/userBehaviorAnalysis/sysParticipation'
        ], resolve)
    },
    307: {
      name: 'sysSaturation',
      component: resolve =>
        require(['src/views/modules/userBehaviorAnalysis/sysSaturation'], resolve)
    },
    401: {
      name: 'recharge-hot-plant',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/rechargeHotPlant'], resolve)
    },
    402: {
      name: 'big-customer-trend',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/bigCustomerTrend'], resolve)
    },
    403: {
      name: 'fashionConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/fashionConsum'], resolve)
    },
    404: {
      name: 'hotConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/hotConsum'], resolve)
    },
    405: {
      name: 'timeLimitConsum',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/timeLimitConsum'], resolve)
    },
    406: {
      name: 'payHotPlant',
      component: resolve =>
        require(['src/views/modules/marketingAnalysis/payHotPlant'], resolve)
    },
    501: {
      name: 'recharge-order',
      component: resolve =>
        require(['src/views/modules/formData/rechargeOrder'], resolve)
    },
    502: {
      name: 'first-pay-detail',
      component: resolve =>
        require(['src/views/modules/formData/firstPayDetail'], resolve)
    },
    503: {
      name: 'reg-detail',
      component: resolve =>
        require(['src/views/modules/formData/regDetail'], resolve)
    },
    901: {
      name: "market",
      component: resolve =>
        require(['src/views/modules/reports/markets'], resolve)
    },
    902: {
      name: "real-time",
      component: resolve =>
        require(['src/views/modules/reports/real-time'], resolve)
    }
  }
}



export default obj