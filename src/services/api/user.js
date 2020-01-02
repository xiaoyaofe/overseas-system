// import http from '../http'
import https from '../http'

export default {

  /**
   * 系统登录
   */
  loginSystem(params) {
    return https.jsonp('/user/login', params)
  },

  /**
   * 系统登出
   */
  logoutSystem(params) {
    return https.jsonp('/user/logout', params)
  },

  /**
   * 语言切换
   */
  changeLanguage(params) {
    return https.jsonp('/user/changeLanguage', params)
  },
  /**
   * 获取系统游戏
   */
  getSystemGames(params) {
    return https.jsonp('/user/games', params)
  },
  /**
   * 游戏切换
   * @param params {Object} Object
   */
  changeGame(params) {   
    return https.jsonp('/user/change', params)
  },

  /**
   * 获取菜单列表
   */
  getMenus(params) {
    return https.jsonp('/user/menus', params)
  },

  /**
   * 获取区服列表
   */
  getAreaZones(params) {
    return https.jsonp('/user/zones', params)
  },

  /**
   * 获取渠道列表
   */
  getChannels(params) {
    return https.jsonp('/user/channels', params)
  },
  /**
   * 获取付费渠道
   */
  getPayChannels(params) {
    return https.jsonp('/user/paychannels', params)
  },
  /**
   * 组件
   */
  getTemplate(params) {
    return https.jsonp('/chart/template/' + params.dataview, params)
  },

  /**
   * 组件输出
   */
  getTemplateOutput(params) {
    return https.jsonp('/chart/' + params.dataview, params)
  },

  /**
   * 模块查询
   */
  getQuery(params) {
    return https.post('/query/' + params.dataview, params)
  },

  /**
   * 模块导出
   */
  exportData(params) {
    return https.exportData('/export/' + params.dataview, params)
  },
  /**
   * 获取指标数据
   * @param {*} params 
   */
  getIndicators(params) {
    return https.jsonp('/user/indicators', params)
  },

  getMail(params) {
    return https.jsonp('/utils/mail/adReport', params)
  }

}