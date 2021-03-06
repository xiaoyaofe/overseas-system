// 获取代理商列表并初始化数据存储
import api from 'src/services/api'
import store  from 'src/store'
import { alert } from 'src/main'

class getAreaZones {
  collection = {}
  configs = { // key为systemId
    2: { // 海外分析分析系统
      ply: 3,
      grandid: 'region_id',
      grandname: 'region_name',
      parentid: 'agent_id',
      parentname: 'agent_name',
      id: 'game_zone_id',
      name: 'game_zone_name'
    },
    3: { // efunfun
      ply: 1, // 系统默认层级数
      id: 'zone_id', // 默认的id字段名
      name: 'zone_name', // 默认的name字段名
    },
  }
  config = this.configs[store.state.common.nowsystem]
  constructor(data) {
    api.user.getAreaZones({
      isCache: 1
    }).done(data => {
      if (data.code == 401) {
        if (data.state.length > 0) {
          this.zones = data.state[0]
          this.dataFormat()
        } else {
          Utils.Notification.error({
            message: "无任何代理商权限!"
          })
        }

      } else {
        Utils.Notification.error({
          message: data.message
        })
      }
    })
  }

  /**
   * 代理商数据格式化
   */
  dataFormat() {
    switch (this.config.ply) {
      case 1:
        this.dataSetByOnePly()
        break;
      case 2:
        this.dataSetByTwoPly()
        break;
      case 3:
        this.dataSetByThreePly()
        break;
    }
    store.commit('curPlySetter', this.config.ply)
  }

  /**
   * 单层数据结构构建
   */
  dataSetByOnePly() {
    this.zones.forEach(e => {
      this.collection[e[this.config.id]] = {
        id: e[this.config.id],
        name: e[this.config.name],
        select: 2
      }
    })
    this.collection.selected = this.collection.len = this.zones.length
    store.commit('zoneDataInit', this.collection)
    store.commit('zoneDataConfirm', this.collection)
  }

  /**
   * 三层数据结构构建
   */
  dataSetByThreePly() {
    this.zones.forEach(e => {

      let
        grandid = e[this.config.grandid],
        grandname = e[this.config.grandname].trim(),
        parentid = e[this.config.parentid],
        parentname = e[this.config.parentname].trim(),
        id = e[this.config.id],
        name = e[this.config.name].trim();

      // console.log(grandname, parentname, name)
      // grand
      let grand = this.collection
      if (!grand.hasOwnProperty(grandid)) {
        !grand.hasOwnProperty('ply') && (grand.ply = 'grand');
        !grand.hasOwnProperty('default') && (grand.default = grandid);
        grand[grandid] = {
          grandid: grandid,
          grandname: grandname,
          len: 0,
          selected: 0,
          select: grand.default === grandid ? 2 : 0
        };
      }
      // parent
      let parent = grand[grandid]
      if (!parent.hasOwnProperty(parentid)) {
        !parent.hasOwnProperty('ply') && (parent.ply = 'parent');
        !parent.hasOwnProperty('default') && (parent.default = parentid);
        parent[parentid] = {
          grandid: grandid,
          grandname: grandname,
          parentid: parentid,
          parentname: parentname,
          len: 0,
          selected: 0,
          select: grand.default === grandid ? 2 : 0
        };
      }
      // child
      let child = parent[parentid];
      if (!child.hasOwnProperty(id)) {
        !child.hasOwnProperty('ply') && (child.ply = 'child');
        child[id] = {
          grandid: grandid,
          grandname: grandname,
          parentid: parentid,
          parentname: parentname,
          id: id,
          name: name,
          select: grand.default === grandid ? 2 : 0
        };
        parent.len++;
        if (grand.default === grandid) parent.selected++;
        child.len++;
        if (parent.default = parentid) child.selected++;
      }
    })
    store.commit('zoneDataInit', this.collection)
    store.commit('zoneDataConfirm', this.collection)
  }
}
export default (data) => {
  new getAreaZones(data)
}