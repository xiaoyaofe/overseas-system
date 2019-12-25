import http from 'src/services/http'
import {
    Number
} from 'core-js';

function getObjectByTimestamp() {
    return {
        timestamp: new Date().getTime()
    }
}

export default {
    namespaced: true,
    state: {
        //time
        date:null,
        mailUrl: null,
        // 分成比例
        proportion:0.00,
        //游戏列表
        gameList: [],
        //分成补充数据
        dividedInto:[],
        //游戏列表下标
        gameListIndex:null,
    },
    mutations: {
        setDate(state, data) {
            state.date = data
        },
        setProportion(state,data){
            state.proportion = data
        },
        setGameListIndex(state,data){
            state.gameListIndex = data
        },
        set_gameList(state, data) {
            state.gameList = data
        },
        set_dividedInto(state, data) {
            state.dividedInto = data
        },
    },
    getters: {
        getGameList(state, getters){
            var gameList = [];    //返回的所有数据
            if (state.gameList && state.gameList[0]) { 
                gameList = state.gameList[0]
            }
            console.log('gamelist--------------->>>>>', gameList)
            return gameList
        },
        getTableData(state,getters){
            var arr = []
            if (state.dividedInto && state.dividedInto[0]) { 
                arr = state.dividedInto[0]
            }
            return arr
        }
    },
    actions: {
        getReportInfo(context, {
            params,
            tag,
        }) {
            var {
                commit,
                state,
                dispatch,
                getters,
                rootGetters,
                rootState,
            } = context
            var url = '/query/fn_oas_budget_costs'
            console.log("Params:->", params)

            var promise1 = new Promise((resolve) => {
                http.post(url, params).then(data => {
                    if (data.code == 401) {
                        commit("set_" + tag, data.state);
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
                    this.dispatch('overseas_common_realTime/getRegionMap').then(() => {
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