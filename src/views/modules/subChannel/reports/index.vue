<template>
  <div class="sub-channel-reports">
    <section class="selection-box">
      <!-- 日期 -->
      <div class="dateTime">
        <div class="time-picker">
          激活时间
          <el-date-picker
            size="medium"
            :picker-options="dateOptions"
            ref="picker"
            v-model="activationTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
            :clearable="false"
          ></el-date-picker>
        </div>
        <div class="time-picker">
          充值时间
          <el-date-picker
            size="medium"
            :picker-options="dateOptions"
            ref="picker2"
            v-model="rechargeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
            :clearable="false"
          ></el-date-picker>
        </div>
      </div>
      <div class="game-sel">
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
      <!-- 系统 -->
      <div class="system-sel">
        <el-button-group class="group">
          <el-button size="medium">
            <span>系统</span>
          </el-button>
          <el-select
            @change="osChange"
            class="os"
            v-model="osOptions.os"
            size="medium"
            style="width: 100px;"
          >
            <el-option
              v-for="item in osOptions.list"
              :key="item.os"
              :label="item.txt"
              :value="item.os"
            ></el-option>
          </el-select>
        </el-button-group>
      </div>
      <!-- 渠道 -->
      <div class="channel-sel">
        <el-button-group class="group">
          <el-button size="medium">
            <span>渠道</span>
          </el-button>
          <el-select
            class="channel"
            filterable
            v-model="channelOptions.channel"
            size="medium"
            @change="channelChange(channelOptions.channel)"
          >
            <el-option
              v-for="item in _state.subChannelInfoData.channel"
              :key="item.media_source"
              :label="item.media_source"
              :value="item.media_source"
            ></el-option>
          </el-select>
        </el-button-group>
      </div>
      <!-- 标签 -->
      <div class="tag-sel">
        <el-button-group class="group">
          <el-button size="medium">
            <span>标签</span>
          </el-button>
          <el-select class="channel" filterable v-model="channelOptions.in_site_type" size="medium">
            <el-option
              v-for="item in _state.subChannelInfoData.params[channelIndex]"
              :key="item.in_site_type"
              :label="item.in_site_type"
              :value="item.in_site_type"
            ></el-option>
          </el-select>
        </el-button-group>
      </div>
      <div class="query" >
        <el-button type="info" @click="channelQuery(2)">查询</el-button>
      </div>
      <div class="excel">
        <el-button type="info" @click="excel()">导出表格</el-button>
      </div>
    </section>
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
    <div class="subTable" style="background: rgba(208,196,214,.5); margin: 12px; padding: 15px;">
      <el-table :data="subChannelDatas" :width="'2000px'" :cell-style="addStyle">
        <el-table-column
          v-for="(item, i) in _config.tableKey"
          :key="i"
          :prop="item.key"
          :label="item.key"
          :formatter="formatter"
          :width="item.width"
          :min-width="item['min-width']"
          :sortable="item.sortable"
          v-if="!item.hide"
          :fixed="i<=2?true:false"
        ></el-table-column>
        <div slot="append">
          <totalFloat
            v-if="__data"
            :updateHook="updateHook"
            :params="{
            total: __data.total,
            tableKey: _config.tableKey
            }"
          />
        </div>
      </el-table>
    </div>
  </div>
</template>

<script>
import tsdp from "src/component/widget/tree-degree-select-box/index.vue";
import totalFloat from "src/component/widget/total-float/index.vue";
import Pagination from 'src/components/Pagination/index.vue'
export default {
  name: 'sub-channel-reports',
  components: {
    tsdp, totalFloat, Pagination
  },
  data() {
    return {
      SMN: 'o_s_c_reports',
      updateHook: 0,
      channelIndex: -1,
      tableOptions: {
        siteId: null
      },
      // 报表数据
      subChannelDatas: [],
      activationTime: [],
      rechargeTime: [],
      // 日期选择
      dateOptions: {
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
        os: "0",
        list: [{
          os: "0",
          txt: "IOS"
        }, {
          os: "1",
          txt: "安卓"
        }]
      },
      // 游戏选择
      tsdp: {
        allTxt: "全部（国家/地区）",
        isShow: false,
        region: null,
        game: null,
        regionArr: [],
        gameArr: [],
        callback: this.tsdpCb
      },
      // 渠道选择
      channelOptions: {
        in_site_type: null,
        channel: null,
        list: []
      },
      // 分页参数
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
    $$subChannelData() {
      return this.$store.state[this.SMN].subChannelData
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
  },
  watch: {
    activationTime(newValue, oldValue) {
      var date = newValue.map(item => moment(item).format("YYYY-MM-DD"));
      if (new Date(date[0]).getTime() > new Date(this.rechargeTime[1]).getTime()) {
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      }else{
        this.$store.commit(this.SMN + '/setActivationTime', date)
        this.rechargeTime = [date[0],this.rechargeTime[1]]
      }
    },
    rechargeTime(newValue, oldValue) {
      var date = newValue.map(item => {
      if (typeof item === 'string') {
          return item
        }
        return moment(item).format("YYYY-MM-DD")
      });
      this.$store.commit(this.SMN + '/setRechargeTime', date)
    },
  },
  methods: {
    //修改分页表格下标
    cahngePage(data) {
      this.subChannelDatas = this.$$subChannelData.slice((data.page - 1) * this.listQuery.limit, this.listQuery.limit * data.page)
    },
    // 导出表格
    excel() {
      var thead = document.querySelector('.el-table__header thead').innerHTML
      var tbody = document.querySelector('.el-table__body tbody').innerHTML + document.querySelector('.el-table__append-wrapper tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        new Date().getTime() + '.xls'
      )
    },
    // 切换游戏回调事件
    tsdpCb([region, regionArr, game, gameArr]) {
      this.tsdp.isShow = !this.tsdp.isShow
      this.tsdp.region = region;
      this.tsdp.regionArr = regionArr;
      this.tsdp.game = game;
      this.tsdp.gameArr = gameArr;
      // 
      this.channelOptions.channel = null
      this.channelOptions.in_site_type = null

      this.channelQuery(1);
    },
    // 切换系统回调事件
    osChange() {
      this.channelOptions.channel = null
      this.channelOptions.in_site_type = null
      this.channelQuery(1);
    },
    // 切换渠道回调事件
    channelChange(value) {
      this.channelOptions.in_site_type = null;
      this.channelIndex = this._state.subChannelInfoData.channel.filter((val) => val.media_source == value)[0].index;
    },
    // 渠道查询函数
    channelQuery(queryType) {
      if (this.ckeck(queryType)) {
        var param = {
          in_install_date1: this._state.activationTime[0],
          in_install_date2: this._state.activationTime[1],
          in_pay_date1: this._state.rechargeTime[0],
          in_pay_date2: this._state.rechargeTime[1],
          in_os: this.osOptions.os,
          in_area_app_ids: this.tsdp.gameArr[0],
          in_media_source: this.channelOptions.channel,
          in_site_type: this.channelOptions.in_site_type,
          in_query_type: queryType, //queryType:1查询渠道  2:查询表格data 
        }
        this.$store.dispatch(this.SMN + '/subChannelData', param).then((newValue) => {
          if (queryType == 2) {
            var subChannelParams = {
              systemIndex: this.osOptions.os,
              channelIndex: this.channelOptions.channel,
              tagIndex: this.channelOptions.in_site_type,
              tsdp: this.tsdp,
            }
            this.subChannelDatas = newValue.slice(0, this.listQuery.limit)
            this.$store.commit(this.SMN + '/setChannelParams', subChannelParams)
          }
        });
      }
    },
    // 查询参数验证事件
    ckeck(queryType) {
      if (!this.osOptions.os) {
        this.$notify({
          type: "warning",
          message: "请选择操作系统"
        });
        return false;
      }
      if (!this.tsdp.gameArr[0]) {
        this.$notify({
          type: "warning",
          message: "请选择游戏",
          offset: 50
        });
        return false;
      }
      if (!this.channelOptions.channel && queryType == 2) {
        this.$notify({
          type: "warning",
          message: "请选择渠道",
          offset: 50
        });
        return false;
      }
      if (!this.channelOptions.in_site_type && queryType == 2) {
        this.$notify({
          type: "warning",
          message: "请选择标签",
          offset: 50
        });
        return false;
      }
      return true
    },
    // 表格宽度初始化
    getWidth(str) {
      var len = str ? str.length : 0;
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
    // 表格样式格式化
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
    // 表格行内样式
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
    // 日期方法
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
    // 参数初始化
    dataInit() {
      var picker = this.$refs.picker
      picker.mountPicker();
      picker.picker._parentEl = picker.$el;
      picker.picker.dateShortcuts = this.dateShortcuts
      var picker2 = this.$refs.picker2
      picker2.mountPicker();
      picker2.picker._parentEl = picker2.$el;
      picker2.picker.dateShortcuts = this.dateShortcuts
      this.rechargeTime = this._state.rechargeTime;
      this.activationTime = this._state.activationTime;
      if (this._state.subChannelParams) {
        this.osOptions.os = this._state.subChannelParams.systemIndex;
        this.channelOptions.channel = this._state.subChannelParams.channelIndex;
        this.channelOptions.in_site_type = this._state.subChannelParams.tagIndex;
        this.tsdp.region = this._state.subChannelParams.tsdp.region;
        this.tsdp.regionArr = this._state.subChannelParams.tsdp.regionArr;
        this.tsdp.game = this._state.subChannelParams.tsdp.game;
        this.tsdp.gameArr = this._state.subChannelParams.tsdp.gameArr;
        this.subChannelDatas = this._state.subChannelData.slice(0, this.listQuery.limit)
      }
    }
  },
  mounted() {
    this.dataInit()
  },
  created() {
    // 获取游戏列表
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
  .time-picker,
  .system-sel,
  .game-sel,
  .channel-sel,
  .tag-sel
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
    padding-left: 200px;
    width: 99%;
    height: auto;
    margin-top: -55px;
    .dateTime {
      width: 100%;
      height: auto;
      display: inline-block;
      .time-picker{
        float: left;
        margin: 5px 5px 5px 5px;
      }
    }
  }
  .channel {
    min-width: 160px;
    max-width: 160px;
  }

  .system-sel,
  .game-sel,
  .channel-sel,
  .tag-sel,
  .query,
  .excel {
    float: left;
    margin: 5px 5px 5px 5px;
  }
  .query,
  .excel{
    button{
      padding: 10px 20px;
    }
  }
}
.el-table {
  th,
  td {
    padding-left: 0;
    padding-right: 0;
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

