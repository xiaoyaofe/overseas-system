<template>

  <div class="sub-channel-reports">
    <my-row class="selection-box">
      <section class="dateTime">
        <div class="time-picker">
          激活时间
          <el-date-picker 
            @change="dateChange" 
            size="medium" 
            :picker-options="pickerOptions" 
            ref="picker" 
            v-model="pickerOptionsDate" 
            type="daterange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期" 
            top="100">
          </el-date-picker>
        </div>
        <div class="time-picker" style="margin-left:8px">
          充值时间
          <el-date-picker 
          @change="payDateChange" 
          size="medium" 
          :picker-options="pickerOptions2" 
          ref="picker2" 
          v-model="pickerOptions2Date" 
          type="daterange" 
          range-separator="至" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期" top="100">
          </el-date-picker>
        </div>
      </section>
      <div class="game-sel" style="padding-left:200px">
        <el-button-group class="group">
          <el-button size="medium">
            <span>游戏</span>
          </el-button>
          <el-button size="medium" class="selection" @click="tsdp.isShow=!tsdp.isShow">
            <span>已选择：</span>
            <span>{{tsdp.game}}</span>
          </el-button>
        </el-button-group>
      </div>
       <div class="system-sel" >
        <el-button-group class="group">
          <el-button size="medium">
            <span>系统</span>
          </el-button>
          <el-select @change="osChange" class="os" v-model="osOptions.os" size="medium" style="width: 100px;">
            <el-option v-for="item in osOptions.list" :key="item.os" :label="item.txt" :value="item.os"></el-option>
          </el-select>
        </el-button-group>
      </div>
      <div class="channel-sel">
        <el-button-group class="group">
          <el-button size="medium">
            <span>渠道</span>
          </el-button>
          <el-select class="channel" filterable v-model="channelOptions.channel" size="medium" @change="channelChange(channelOptions.channel)">
            <el-option v-for="item in _state.subChannelInfoData.channel" :key="item.media_source" :label="item.media_source" :value="item.media_source"></el-option>
          </el-select>
        </el-button-group>
      </div>

      <div class="channel-sel">
        <el-button-group class="group">
          <el-button size="medium">
            <span>标签</span>
          </el-button>
          <el-select class="channel" filterable v-model="channelOptions.in_site_type" size="medium" @change="changeChannelParams(channelOptions.in_site_type)">
            <el-option v-for="item in _state.subChannelInfoData.params[channelIndex]" :key="item.in_site_type" :label="item.in_site_type" :value="item.in_site_type"></el-option>
          </el-select>
        </el-button-group>
      </div>

      <div class="query" style="padding-left:50px">
        <el-button type="info" @click="ckeck() && query()">
          查询
        </el-button>
      </div>
       <div class="excel">
        <el-button type="info" @click="ckeck() && excel()">
          导出表格
        </el-button>
      </div>
    </my-row>
    <my-row>
    <tsdp :data="tsdp" v-if="tsdp.isShow" :auto-confirm="true"></tsdp>
    </my-row>    
      <pagination
        v-if="$$subChannelData.length"
        :total="$$subChannelData.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="cahngePage" 
      />
    <div class="subTable" v-if="__data" style="background: rgba(208,196,214,.5); margin: 12px; padding: 15px;">
      <el-table  :data="subChannelDatas" :cell-class-name="cellClassName"   :width="'2000px'" :cell-style="addStyle">
        <el-table-column v-for="(item, i) in _config.tableKey" :key="i" :prop="item.key"  
         :label="item.key" :formatter="formatter" :width="item.width" :min-width="item['min-width']" :sortable="item.sortable" v-if="!item.hide"
         :fixed="i<=2?true:false"></el-table-column>
        <div slot="append">
          <totalFloat :updateHook="updateHook" :params="{
            total: __data.total,
            tableKey: _config.tableKey
            }" />
        </div>
      </el-table>
    </div>
  </div>
</template>

<script>
import tsdp from "src/component/widget/tree-degree-select-box/index.vue";
import totalFloat from "src/component/widget/total-float/index.vue";
import Pagination from 'src/components/Pagination/index.vue'
// import { valid } from 'semver';
import api from 'src/services/api'

import { log } from 'util';
export default {
  name: 'sub-channel-reports',
  components: {
    tsdp, totalFloat,Pagination
  },
  data() {
    return {
      SMN: 'o_s_c_reports',
      updateHook: 0,
      channelIndex:-1,
      tableOptions: {
        siteId: null
      },
      pickerOptionsDate:null,
      pickerOptions2Date:null,
      // 日期选择
      pickerOptions: {
        onPick({ minDate, maxDate }) {
          if (!maxDate) {
            this._parentEl.querySelector("input").value = moment(
              minDate
            ).format("YYYY-MM-DD");
          }
        },
         shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.dateShortcuts('今天', picker)
            }
          }, {
            text: '昨天',
            onClick(picker) {
              picker.dateShortcuts('昨天', picker)
            }
          }, {
            text: '近7天',
            onClick(picker) {
              picker.dateShortcuts('近7天', picker)
            }
          }, {
            text: '近15天',
            onClick(picker) {
              picker.dateShortcuts('近15天', picker)
            }
          }, {
            text: '近30天',
            onClick(picker) {
              picker.dateShortcuts('近30天', picker)
            }
          }, {
            text: '近30-60天',
            onClick(picker) {
              picker.dateShortcuts('近30-60天', picker)
            }
          }, {
            text: '本月',
            onClick(picker) {
              picker.dateShortcuts('本月', picker)
            }
          }, {
            text: '上月',
            onClick(picker) {
              picker.dateShortcuts('上月', picker)
            }
          }, {
            text: '今年',
            onClick(picker) {
              picker.dateShortcuts('今年', picker)
            }
          }, {
            text: '去年',
            onClick(picker) {
              picker.dateShortcuts('去年', picker)
            }
          }],
        date: null
      },
       // 日期选择
      pickerOptions2: {
        onPick({ minDate, maxDate }) {
          if (!maxDate) {
            this._parentEl.querySelector("input").value = moment(
              minDate
            ).format("YYYY-MM-DD");
          }
        },
         shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.dateShortcuts('今天', picker)
            }
          }, {
            text: '昨天',
            onClick(picker) {
              picker.dateShortcuts('昨天', picker)
            }
          }, {
            text: '近7天',
            onClick(picker) {
              picker.dateShortcuts('近7天', picker)
            }
          }, {
            text: '近15天',
            onClick(picker) {
              picker.dateShortcuts('近15天', picker)
            }
          }, {
            text: '近30天',
            onClick(picker) {
              picker.dateShortcuts('近30天', picker)
            }
          }, {
            text: '近30-60天',
            onClick(picker) {
              picker.dateShortcuts('近30-60天', picker)
            }
          }, {
            text: '本月',
            onClick(picker) {
              picker.dateShortcuts('本月', picker)
            }
          }, {
            text: '上月',
            onClick(picker) {
              picker.dateShortcuts('上月', picker)
            }
          }, {
            text: '今年',
            onClick(picker) {
              picker.dateShortcuts('今年', picker)
            }
          }, {
            text: '去年',
            onClick(picker) {
              picker.dateShortcuts('去年', picker)
            }
          }],
        date: null
      },

      // 系统选择

      osOptions: {
        os: null,
        list: [{
          os: "0",
          txt: "IOS"
        }, {
          os: "1",
          txt: "安卓"
        }]
      },

      tsdp: {
        allTxt: "全部（国家/地区）",
        isShow: false,
        region: null,
        game: null,
        regionArr: [],
        gameArr: [],
        callback: this.tsdpCb
      },

      // level query
      levelOptions: {
        level: null
      },

      channelOptions: {
        in_site_type:null,
        channel: null,
        list: []
      },

      subChannelDatas:[],
      listQuery: {
        page: 1,
        limit: 10
      },

    }
  },
  computed: {
    _state() {
      return this.$store.state[this.SMN];
    },
    $$subChannelData(){
      if (this.$store.state[this.SMN].subChannelData) {
        this.subChannelDatas = this.$store.state[this.SMN].subChannelData.slice(0,this.listQuery.limit)
        return this.$store.state[this.SMN].subChannelData
      }else{
        return []        
      }
    },
    __data() {
      this.updateHook += 1
      if (this.tableOptions.siteId) {
        return this.$store.getters[this.SMN + '/subChannelRegionData'];
      }
      return this.$store.getters[this.SMN + '/subChannelData'];
    },
    _config() {
      if (this.tableOptions.siteId) {
        return this._state.subChannelRegionConfig
      }
      return this._state.subChannelConfig
    },
    watchGame() {
      return this.osOptions.os;
    }
  },
  watch: {
    pickerOptionsDate(newValue,oldValue){
      var date = newValue.map(item => moment(item).format("YYYY-MM-DD"));
      if(new Date(date[0]).getTime()>new Date(this.pickerOptions2Date[1]).getTime()){
        this.pickerOptionsDate = oldValue;
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      }else{
        this.$store.commit(this.SMN + '/setDate', date)
        this.pickerOptions2Date = [date[0],this.pickerOptions2Date[1]]
        this.channelQuery()
      }
    },
    pickerOptions2Date(newValue,oldValue){
       var date = newValue.map(item => {
        if(typeof item === 'string'){
          return item
        }
        return moment(item).format("YYYY-MM-DD")
      });
      this.$store.commit(this.SMN + '/setPayDate', date)
    },
    watchGame(newValue,oldValue){
      this.channelOptions.channel = null
      this.channelOptions.in_site_type = null
      this.channelQuery();
    }
  },
  methods: {
    cahngePage(data){
        this.subChannelDatas = this.$$subChannelData.slice((data.page-1)*this.listQuery.limit,this.listQuery.limit*data.page)
    },
    excel() {
      var thead = document.querySelector('.el-table__header thead').innerHTML
      var tbody = document.querySelector('.el-table__body tbody').innerHTML+document.querySelector('.el-table__append-wrapper tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        new Date().getTime() + '.xls'
      )
      // var params = {
      //   in_install_date1:this._state.date[0],
      //   in_install_date2:this._state.date[1],
      //   in_pay_date1: this._state.payDate[0],
      //   in_pay_date2: this._state.payDate[1],
      //   in_os: this._state.os,
      //   in_area_app_ids: this._state.gameArr[0],
      //   in_media_source: this._state.channel,
      //   dataview: 'fn_report_media_source_site',
      // }
      // api.user.exportData(params)
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (!columnIndex) {
        if (!this.tableOptions.siteId)
          return 'ellipsis sub-channel'
      }
    },
    tsdpCb([region, regionArr, game, gameArr]) {
      this.tsdp.region = region;
      this.tsdp.regionArr = regionArr;
      this.tsdp.game = game;
      this.tsdp.gameArr = gameArr;
      this.channelOptions.channel = null
      this.channelOptions.in_site_type = null
      this.channelQuery();
    },
    dateChange(value) {
      // var arr = []
      // value.forEach(date => {
      //   arr.push(moment(date).format("YYYY-MM-DD"))
      // })
      // this.$store.commit(this.SMN + '/setDate', arr)
    },
    payDateChange(value){
      // var arr = []
      // value.forEach(date => {
      //   arr.push(moment(date).format("YYYY-MM-DD"))
      // })
      // this.$store.commit(this.SMN + '/setPayDate', arr)
    },
    osChange(value) {
      this.$store.commit(this.SMN + '/setOs', value)
    },
    channelChange(value) {
      this.channelOptions.in_site_type = null;
      this.channelIndex = this._state.subChannelInfoData.channel.filter((val)=> val.media_source == value)[0].index;
    },
    changeChannelParams(value){
    },
    levelChange(value) {
      var number = parseInt(value)
      this.levelOptions.level = isNaN(number) ? null : number
      this.$store.commit(this.SMN + '/setLevel', this.levelOptions.level * 1)
    },
    formatter(row, column, value) {
      var {
        index, keys
      } = this._config
      var {
        label
      } = column
      if (
        label === keys[index.registerRateIndex]
        || label === keys[index.createRateIndex]
        || label === keys[index.roiIndex]
        || label === keys[index.minuteIndex]   
        || label === keys[index.keep1Index]
        || label === keys[index.keep2Index]
        || label === keys[index.keep3Index]     
      ) {
        value += '%'
      } 
      return value
    },
    cellClick(row, column, cell, event) {
      if (cell.classList.contains('sub-channel') && !this.tableOptions.siteId) {
        var param = {
          begin_date: this._state.date[0],
          end_date: this._state.date[1],
          os: this._state.os,
          game_id: this._state.gameArr[0],
          media_source: this._state.channel,
          site_id: row[column.label],
          level: this._state.level,
        }
        this.$store.dispatch(this.SMN + '/subChannelRegionData', param).then(data => {
          this.tableOptions.siteId = param.site_id
        })
      }
    },
    channelQuery() {
      if (!this.osOptions.os) {
        this.$notify({
          type: "warning",
          message: "请选择操作系统"
        });
        return;
      }
      if (!this.tsdp.gameArr[0]) {
        this.$notify({
          type: "warning",
          message: "请选择游戏",
          offset: 50
        });
        return;
      }

      this.$store.commit(this.SMN + "/setRegion", this.tsdp.region);
      this.$store.commit(this.SMN + "/setRegionArr", this.tsdp.regionArr);
      this.$store.commit(this.SMN + "/setGame", this.tsdp.game);
      this.$store.commit(this.SMN + "/setGameArr", this.tsdp.gameArr);
      var param = {
        in_install_date1:this._state.date[0],
        in_install_date2:this._state.date[1],
        in_pay_date1: this._state.payDate[0],
        in_pay_date2: this._state.payDate[1],
        in_os: this._state.os,
        in_area_app_ids: this._state.gameArr[0],
        in_media_source: this._state.channel,
        in_site_type:this.channelOptions.in_site_type,
        in_query_type:1
      }
      this.$store.dispatch(this.SMN + '/subChannelInfo', param)
    },
    ckeck() {
      if (!this._state.gameArr.length) {
        this.$notify({
          type: "warning",
          message: "请选择游戏"
        })
        return false
      }
      if (!this.channelOptions.channel) {
        this.$notify({
          type: "warning",
          message: "请选择渠道"
        })
        return false
      }
      return true
    },
    query() {
      var param = {
        in_install_date1:this._state.date[0],
        in_install_date2:this._state.date[1],
        in_pay_date1: this._state.payDate[0],
        in_pay_date2: this._state.payDate[1],
        in_os: this._state.os,
        in_area_app_ids: this._state.gameArr[0],
        in_media_source: this.channelOptions.channel,
        in_site_type:this.channelOptions.in_site_type,
        in_query_type:2
      }
      this.$store.commit(this.SMN + '/setChannel', this.channelOptions.channel)
      this.$store.commit(this.SMN + '/setChannelParams', this.channelOptions.in_site_type)
      this.$store.dispatch(this.SMN + '/subChannelData', param)

    },
    getWidth(str) {
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
    },
    addStyle({ row, column, rowIndex, columnIndex }) {
      function r2g(value, avg) {
        var percent = value;
        if (percent < 30)
          return '#f9686a'
        else if (percent <= 50)
          return '#ffc0cb'
        else if (percent <= 70)
          return '#ffeb85'
        else if (percent <= 90)
          return '#98fb98'
        else
          return '#228b22'
      }
      function g2r(value, avg) {
        var middle = avg / 0.5;
        var percent = value / middle;
        if (percent <= 0.2)
          return '#228b22'
        else if (percent <= 0.4)
          return '#98fb98'
        else if (percent <= 0.6)
          return '#ffeb85'
        else if (percent <= 0.8)
          return '#ffc0cb'
        else
          return '#f9686a'
      }
      function retColor(mmaObj, data) {
        var avg = mmaObj.avg;
        var isReversal = mmaObj.isReversal;
        var style = {
          fontWeight: 700,
          color: '#000'
        }
        // if (avg === 0) return;
        if (isReversal == true) {
          style['background'] = g2r(data, avg);
        } else {
          style['background'] = r2g(data, avg);
        }
        return style
      }
      var { keys, index } = this._config
      var { label } = column
      var mmaObj = this.__data.mmas[label]
      switch (label) {
        case keys[index.registerRateIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.createRateIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.activeCostIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.registerCostIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.createCostIndex]:
          return retColor(mmaObj, row[label])
          break;
      }
    },
    dateShortcuts(txt, picker) {
      var date
      switch (txt) {
        case '今天':
          var date_ = new Date
          date = [date_, date_]
          break
        case '昨天':
          var date_ = new Date
          date_.setTime(Date.now() - 3600 * 1000 * 24);
          date = [date_, date_]
          break
        case '近7天':
          var dateBegin = new Date
          var dataEnd = new Date
          dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 7);
          dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
          date = [dateBegin, dataEnd]
          break
        case '近15天':
          var dateBegin = new Date
          var dataEnd = new Date
          dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 15);
          dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
          date = [dateBegin, dataEnd]
          break
        case '近30天':
          var dateBegin = new Date
          var dataEnd = new Date
          dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 30);
          dataEnd.setTime(Date.now() - 3600 * 1000 * 24);
          date = [dateBegin, dataEnd]
          break
        case '近30-60天':
          var dateBegin = new Date
          var dataEnd = new Date
          dateBegin.setTime(Date.now() - 3600 * 1000 * 24 * 60);
          dataEnd.setTime(Date.now() - 3600 * 1000 * 24 * 30);
          date = [dateBegin, dataEnd]
          break
        case '本月':
          var dataEnd = new Date
          var curyear = dataEnd.getFullYear()
          var curmonth = dataEnd.getMonth()
          dateBegin = new Date(curyear, curmonth, 1)
          date = [dateBegin, dataEnd]
          break
        case '上月':
          var dataEnd = new Date
          var curyear = dataEnd.getFullYear()
          var curmonth = dataEnd.getMonth()
          dateBegin = new Date(curyear, curmonth - 1, 1)
          dataEnd = new Date(curyear, curmonth, 0)
          date = [dateBegin, dataEnd]
          break
        case '今年':
          var dataEnd = new Date
          var curyear = dataEnd.getFullYear()
          dateBegin = new Date(curyear, 0, 1)
          date = [dateBegin, dataEnd]
          break
        case '去年':
          var dataEnd = new Date
          var curyear = dataEnd.getFullYear()
          var curmonth = dataEnd.getMonth()
          dateBegin = new Date(curyear - 1, 0, 1)
          dataEnd = new Date(curyear, 0, 0)
          date = [dateBegin, dataEnd]
          break
      }
      picker.$emit('pick', date);
    },
  },
  mounted() {
    var picker = this.$refs.picker
    picker.mountPicker();
    picker.picker._parentEl = picker.$el;
    picker.picker.dateShortcuts = this.dateShortcuts

    var picker2 = this.$refs.picker2
    picker2.mountPicker();
    picker2.picker._parentEl = picker2.$el;
    picker2.picker.dateShortcuts = this.dateShortcuts
  },
  created() {
    this.pickerOptionsDate = this._state.date
    this.pickerOptions2Date = this._state.payDate
    this.osOptions.os = this._state.os
    this.levelOptions.level = this._state.level
    if (this._state.region) this.tsdp.region = this._state.region
    if (this._state.regionArr) this.tsdp.regionArr = this._state.regionArr
    if (this._state.game) this.tsdp.game = this._state.game
    if (this._state.gameArr) this.tsdp.gameArr = this._state.gameArr
    if (this._state.channel) this.channelOptions.channel = this._state.channel
    if (this._state.channelList) {this.channelOptions.list = this._state.channelList;}
    if(!this.channelOptions.in_site_type){this.channelOptions.in_site_type = this._state.setChannelParamsName }
    this.$store.dispatch("overseas_common/getList1").then(item => {
      if (!this._state.region || !this._state.regionArr.length) {
        this.$store.commit(this.SMN + "/setRegion", this.tsdp.allTxt);
        this.$store.commit(
          this.SMN + "/setRegionArr",
          this.$store.state.overseas_common.list1All
        );
        this.tsdp.region = this.tsdp.allTxt;
        this.tsdp.regionArr = this.$store.state.overseas_common.list1All;
      }
    })


  }
}
</script>

<style  lang="scss">
.sub-channel-reports {
  .ellipsis {
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .sub-channel {
    // cursor: pointer;
    // &:hover {
    //   background: #5b5691 !important;
    //   color: #fff;
    // }
  }
  .time-picker,
  .system-sel,
  .game-sel,
  .channel-sel,
  .query,
  .excel {
    margin-left: 10px;
  }

  .back-row {
    margin-top: 16px;
    justify-content: center;
    align-items: center;
    .back {
      margin-left: -16px;
    }
  }
.selection-box {
    position: relative;
    .dateTime{
      position: absolute;
      top: -55px;
      left: 200px;
      display: flex;
    }
  }
  .channel {
    min-width: 160px;
    max-width: 160px;
  }

  .system-sel,
  .game-sel,
  .channel-sel {
    .group {
      display: flex;
      flex-wrap: nowrap;
    }
  }
}
.el-table {
  th,td{
    padding-left: 0;
    padding-right: 0

  }
  tr:first-child {
    th {
      .region {
        font-family: "黑体";
        color: #5b5691;
        font-size: 16px;
      }
    }
  }
}
</style>

