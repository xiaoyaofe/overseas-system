import menuConfig from 'src/config/menuConfig.js'
import api from 'src/services/api'
import store from 'src/store'
import router from 'src/router'
import { OverseasReleaseSysId } from '../../config/dev.config';
import { log } from 'util';
const getSystemGames = () => {
  
  api.user.getSystemGames({}).done(data => {
    if (data.code == 401) {
      // 设置优先展示拥有权限的系统
      Config.OverseasReleaseSysId = data.state[0].systemId
      if (data.state.length == 0) {
        Utils.Notification.error({
          message: '无系统游戏权限'
        })
      }
      formatSystemGame(data.state)
    } else {
      Utils.Notification({
        message: data.message
      })
    } 
  })
}
const formatSystemGame = (userGame) => {
  var systems = {},
    defaultSystemId = Config.OverseasReleaseSysId;
  userGame.forEach(game => {
    let systemId = game.systemId
    if (!systems[systemId]) {
      if (!systems.systemId && !defaultSystemId) {
        systems.systemId = systemId
      } else if (!systems.systemId && defaultSystemId) {
        systems.systemId = defaultSystemId
      }
      systems[systemId] = {
        id: game.systemId,
        name: game.systemName,
        children: []
      }
      systems[systemId].children.push({
        id: game.gameId,
        name: game.GameName,
        mainGameId: game.mainGameId
      })
    } else {
      systems[systemId].children.push({
        id: game.gameId,
        name: game.GameName,
        mainGameId: game.mainGameId
      })
    }
  })
  let system = store.state.common.systems;
  system[systems.systemId].children = systems[systems.systemId].children
  store.commit('setSystems', system)
  //切换游戏>>>
  changeGame("getMenus");
}
/**
 * 选择游戏
 */
const changeGame = (flag) => {
  store.dispatch('clearSystemInfo')
  store.commit('OS/initOS')
  api.user.changeGame({
    systemId: store.state.common.systems.systemId,
    gameId: store.state.common.nowgame
  }).then(data => {
    if (data.code == 303) {
      Promise.all([
        // 获取代理
        new Promise((resolve, reject) => {
          if (store.state.common.systems.systemId == 4 || store.state.common.systems.systemId == 5 || store.state.common.nowgame === 70001) {
            resolve();
          } else {
            store.dispatch('Agent/data').then(() => {
              resolve()
            }).catch((e) => {
              reject(e)
            });
          }
        }),
        // 注册渠道
        new Promise((resolve, reject) => {
          if (store.state.common.systems.systemId == 4 || store.state.common.systems.systemId == 5 || store.state.common.nowgame===70001) {
            resolve();
          } else {
            store.dispatch('RegChannel/data').then(() => {
              resolve()
            }).catch((e) => {
              reject(e)
            });
          }
        }),
        // 付费渠道
        new Promise((resolve, reject) => {
          if (store.state.common.systems.systemId == 1) {
            store.dispatch('PayChannel/data').then(() => {
              resolve()
            }).catch((e) => {
              reject(e)
            });
          } else {
            resolve()
          }
        })
      ]).then(() => {
        if (flag) {
          getMenus()                    
        }else{
          store.commit("SET_QUERY_DATA",Math.random()*10)
        }
      }).catch(e => {
        console.error(e);
      });

    } else {
      Utils.Notification.error({
        message: data.message
      })
    }
  })
};
/**
 * 获取菜单列表
 */
const getMenus = () => {
  api.user.getMenus({}).done(data => {
    store.state.Common.couldQuery = true
    if (data.code == 401) {
      if (data.state.length == 0) {
        Utils.Notification.error({
          message: '无任何菜单权限'
        })
        return;
      }
      var menus = formatMenus(data.state)
      store.commit("initMenus", menus)
      store.getters['getMenu']
      store.commit("selectMenu", getNowMenu(menus))
      if (store.state.common.userInfo != null) {
        router.replace('callPage')
        setTimeout(() => {
          router.replace(store.state.common.nowmenu.menuUrl)
        })
      } else {
        router.replace('login')
      }
    } else {
      Utils.Notification.error({
        message: data.message
      })
    }
  })
}
/**
 * 获取默认菜单  当有五力模型权限时跳转五力模型，无五力模型权限时跳转第一个菜单
 */
const getNowMenu = (menus) => {
  var ret

  // menus = fake(menus)

  menus.forEach(parent => {
    parent.childrenMenu.forEach(child => {
      if (child.menuId == Config.defaultMenu) ret = child
    })

  })
  return ret ? ret : menus[0].childrenMenu[0]
}

function fake(menus) {
  var fake = Object.assign({}, menus[0].childrenMenu[0])
  fake.menuId = '1003'
  fake.menuName = "自渠道报表"
  fake.menuUrl = 'sub-channel-reports'
  menus[0].childrenMenu.push(fake)
  return menus
}
/**
 * 格式化菜单
 * @param {*} menus
 */

const formatMenus = (menus) => {
  // var map1 = {}
  // var map2 = {}
  // var map3 = {}

  // menus.forEach(item => {
  //   var _1id = item.menuId
  //   var _1name = item.menuName
  //   map1[_1name] = _1id

  //   map3[_1name] = item
  //   item.childrenMenu.forEach(item => {
  //     var _2id = item.menuId
  //     var _2name = item.menuName
  //     map2[_2name] = _2id
  //   })
  // })

  // var menus = []
  // menus.push(map1[''])
  var index = -1
  menus.forEach(({ childrenMenu, menuId }, i) => {
    if (menuId === 11) {
      index = i
    }
    childrenMenu.forEach(sec => {
      sec.menuApi = sec.dataView[0];
      sec.menuUrl = menuConfig[sec.menuId] ? menuConfig[sec.menuId].name : '';
      sec.parentId = menuId
    })
  })

  if (index !== -1) {
    var tmp = menus.splice(index, 1)
    menus.sort(function (a, b) {
      return a.menuId - b.menuId
    })

    menus = tmp.concat(menus)
  }


  return menus;
}
export default {
  getSystemGames,
  changeGame,
  getMenus
}