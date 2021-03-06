import http from 'src/services/http'
export default {
    namespaced: true,
    state: {
        list1: null,
        list1All: null,
        list2: null,
        list2Config: {
            keys: null,
            index: {
                idIndex: 0,
                nameIndex: 1
            }
        },
        regionMap: null
    },
    mutations: {
        setList1(state, data) {
            state.list1 = data
        },
        setList2(state, data) {
            state.list2 = data
        },
        setRegionMap(state, data) {
            state.regionMap = data
        }
    },
    getters: {
        getList1(state) {
            var arr = []
            var err = []
            if (state.list1) {
                function GetList1() { }
                GetList1.prototype.parent = []
                GetList1.prototype.child = []
                arr = new GetList1()
                var list = state.list1[0]
                list.sort(function (a, b) {
                    return a.unite_type - b.unite_type
                })
                list.forEach(item => {
                    var id = item.unite_id
                    arr[id] = item
                    if (item.unite_type === 0) {
                        item.children = []
                        arr.parent.push(item)
                    } else {
                        var parent = arr[item.unite_parent_id ]
                        if (parent.hasOwnProperty('children')) {
                            parent.children.push(item)
                            arr.child.push(item)
                        } else {
                            err.push(id)
                        }
                    }
                })
                state.list1All = arr.parent.map(item => {
                    return item.unite_id
                })
                err.length && console.error('没有父节点的子项：', err);
            }
            return arr
        },
        getList2(state) {
            var arr = null
            if (state.list2) {
                arr = []
                var all = state.list2[0]
                if (!state.list2Config.keys) {
                    state.list2Config.keys = Object.keys(all[0])
                }
                var {
                    keys,
                    index
                } = state.list2Config
                all.forEach(item => {
                    arr.push({
                        id: item[keys[index.idIndex]],
                        name: String.prototype.trim.call(item[keys[index.nameIndex]]),
                    })
                })
            }
            return arr
        }
    },
    actions: {
        getList1(context) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context
            return new Promise((resolve, reject) => {
                if (!state.list1) {
                    var param = {
                        // querytype: 1,
                        in_install_date1: moment().format('YYYY-MM-DD'), //激活开始日期
                        in_install_date2: moment().format('YYYY-MM-DD'),   //激活结束日期
                        in_pay_date1: moment().format('YYYY-MM-DD'),
                        in_pay_date2: moment().format('YYYY-MM-DD'),
                        in_os: '0,1',                                 //系统                  
                        in_area_app_ids:'1',                          //游戏层级 
                        in_media_source:"",                           //渠道
                        in_rpt_type:1,                                //报表类型
                                                                        // 1 查询游戏层级  2 综合报表  3 每日报表  
                                                                        // 4 渠道(媒体)报表   5 系统对比
                        in_country: '',                                //国家
                        in_chart_type:0,                               //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
                        in_view_type:0,                                  //视图类型：1 渠道 2 时间 3 地区
                        in_package_name:""                             //包名


                    }
                    var url = '/query/' + rootGetters.getMenu[Config.deliveryMenuId].dataView[0]
                    http.post(url, param).then(({
                        state,
                        code
                    }) => {
                        // console.log('tag444',code)
                        if (code === 401) {
                            commit('setList1', state)
                            getters.getList1
                            resolve()
                        }
                    })
                } else {
                    resolve()
                }
            })
        },
        getList2(context) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context
            return new Promise((resolve, reject) => {
                if (!state.list2) {
                    var url = '/query/' + rootGetters.getMenu[Config.PackageManagerId].dataView[2]
                    http.post(url).then(({
                        state,
                        code
                    }) => {
                        if (code === 401) {
                            commit('setList2', state)
                            getters.getList2
                            resolve()
                        }
                    })
                } else {
                    resolve()
                }
            })
        },
        getRegionMap(context) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context

            return new Promise((resolve, reject) => {
                if (!state.regionMap) {

                    System.import("src/utils/regionMap").then(({
                        regionMap
                    }) => {
                        commit('setRegionMap', regionMap)
                        resolve()
                    })

                } else {
                    resolve()
                }

            })


        },
        getChannels1(context, param) {
            var {
                state,
                getters,
                rootGetters,
                commit
            } = context

            var url = '/query/' + 'query_app_mediasource'
            return new Promise((resolve, reject) => {
                http.post(url, param).then(data => {
                    resolve(data)
                }).fail(err => {
                    reject(err)
                })
            })
        },
    }
}