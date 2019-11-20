import api from 'src/services/api'
import store from 'src/store'
import websocket from 'src/services/websocket'
import commonMethod from 'src/utils/commonMethod'


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
      // console.log(data)
      if (data.code === 301) {
        // console.log(Utils)
        Utils.Notification.success({
          message: data.message
        })
        // console.log('websocket')
        websocket.initConnect();
        // console.log('websocket')
        commonMethod.getSystemGames();
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