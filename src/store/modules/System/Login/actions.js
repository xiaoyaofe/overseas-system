import api from 'src/services/api'
import store from 'src/store'
import websocket from 'src/services/websocket'
import commonMethod from 'src/utils/commonMethod'
import { log } from 'util';


// function gamesDataset({ userGame }) {
//   var systems = {}, defaultSystemId = null;
//   userGame.forEach(game => {
//     let systemId = game.systemId
//     if (!systems[systemId]) {
//       if (!systems.systemId && !defaultSystemId) {
//         systems.systemId = systemId
//       } else if (!systems.systemId && defaultSystemId) {
//         systems.systemId = defaultSystemId
//       }
//       systems[systemId] = {
//         id: game.systemId,
//         name: game.systemName,
//         children: []
//       }
//       systems[systemId].children.push({
//         id: game.gameId,
//         name: game.GameName
//       })
//     } else {
//       systems[systemId].children.push({
//         id: game.gameId,
//         name: game.GameName
//       })
//     }
//   })
//   store.commit('setSystems', systems)
//   commonMethod.changeGame()
// }

export default {
  data(state, { userName, password, language }) {
    api.user.loginSystem({
      userName,
      password,
      language
    }).then((data) => {
      if (data.code === 301) {
        // console.log(Utils)
        Utils.Notification.success({
          message: data.message
        })
        // console.log('websocket')
        websocket.initConnect();
        // console.log('websocket')
        // 登录成功>>>设置系统
        var systemsID = data.state.systems.filter((todo)=>todo.type == "oas_menu")
        var systemsObj = {}
        var systemParams = []
        systemsID.map((todo)=>systemParams.push({id:todo.systemId,name:todo.systemName,children:[]}))
        systemParams.map((todo)=>systemsObj[todo.id]=todo)
        systemsObj.systemId = systemParams[0].id;
        store.commit('selectGame', 0)
        store.commit('setSystems', systemsObj)     
        switch (data.state.systems[0].systemId) {
          case 2:
            commonMethod.getSystemGames();
            break;
          case 4:
            commonMethod.changeGame("switch language");
            break;
          case 5:
            commonMethod.changeGame("switch language");
            break;
          default:
            break;
        }
        // var hash = {};
        // var systems = {};
        // let systemsData = data.state.systems.reduce(function (item, next) {
        //   hash[next.systemId] ? '' : hash[next.systemId] = true && item.push(next);
        //   return item
        // }, [])
        // for (let index = 0; index < systemsData.length; index++) {
        //   systems[systemsData[index].systemId] = {
        //     id: systemsData[index].systemId,
        //     name: systemsData[index].systemName,
        //     children: []
        //   }
        // }
        // //默认系统ID为发行系统
        // systems.systemId = Config.DistributionSystemId;
        // store.commit('setSystems', systems)
        
        // if (systems.systemId == 2) {
        //   // 查询游戏>>>
        //   commonMethod.getSystemGames();

        // }
        store.commit('initUserInfo', {
          userName,
          nickName: data.state.userName || userName
        })
        // if (data.state.userGame.length > 0) {
        //   gamesDataset({
        //     userGame: data.state.userGame
        //   })
        // } else {
        //   Utils.Notification.error({
        //     message: '无任何游戏权限'
        //   })
        // }
      } else {
        Utils.Notification.error({
          message: data.message
        })
      }
    })
  }
}