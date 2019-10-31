<template>
  <div class="reports-market">
    <!-- 投放报表查询条件 -->
    <my-row class="selection-box">
      <!-- 时间 -->
      <section class="dateTime">
        <div class="date-box-item">
          <span>激活时间</span>
          <el-date-picker
            size="medium"
            :picker-options="pickerOptions1"
            ref="picker1"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
          ></el-date-picker>
        </div>
        <div class="date-box-item">
          <span>充值时间</span>
          <el-date-picker
            size="medium"
            :picker-options="pickerOptions2"
            ref="picker2"
            v-model="payDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
          ></el-date-picker>
        </div>
      </section>
      <!-- 游戏 -->
      <section style="padding-left:165px">
        <el-button size="medium" class="selection" @click="data.isShow=true">
          <span>已选择：</span>
          <span>{{_rcg}}</span>
        </el-button>
      </section>   
      <!-- 系统 -->
      <div class="date-box-item" v-show="!data.game">
        <span style="min-width:40px">系统</span>
        <el-select class="os" v-model="os" size="medium">
          <el-option v-for="item in options" :key="item.value" :label="item.txt" :value="item.os"></el-option>
        </el-select>
      </div>
      <!-- 查询按钮 -->
      <el-button
         type="info"
        size="medium"
        class="search"
        @click="getData(taging_,false)"
        style="margin-left:95px"
      >查询</el-button>
      <el-button type="info" size="medium" @click="excel()">导出表格</el-button>
      <!-- 邮件 -->
      <div style="position:relative;">
        <el-date-picker
          ref="picker"
          v-model="value2"
          align="right"
          type="date"
          style="position:absolute;z-index:-1;width:200px;left:24px;visibility:hidden;"
          @change="pickerChange"
        ></el-date-picker>
        <el-button type="info" size="medium" style="margin: 0 15px" @click="createMail()">邮件生成</el-button>
      </div>
      <el-button type="info" size="medium" @click="checkMail()">邮件查看</el-button>
    </my-row>
    <!-- 游戏下拉框 -->
    <my-row>
      <tsdp :data="data" v-if="data.isShow"></tsdp>
    </my-row>
    <my-row>
      <el-tabs v-model="taging" @tab-click="tagClick(false)" style="marginTop:35px">
        <el-tab-pane
          v-if="(isSingle && _tagState[tag])"
          v-for="({ label }, tag) in tags"
          :key="tag"
          :label="label"
          :name="tag"
        ></el-tab-pane>
        <!-- 动态组件 -->
        <component :is="main" :data="data" :_config="_config" :_types="$data.types"></component>
      </el-tabs>
    </my-row>
  </div>
</template>

<script>
import tsdp from "src/component/widget/tree-degree-select-box/index.vue";
import api from "src/services/api";
import http from "src/services/http";
// 综合报表
import comprehensive from "./comprehensive.vue";
// 每日报表
import daily from "./daily.vue";
import zone from "./zone.vue";
// 渠道报表
import channel from "./channel.vue";
// 系统对比
import system from "./system.vue";
// 单一游戏
import singleGame from './singleGame.vue'

import MailCreation from "src/views/modules/MailCreation";
export default {
  name: "reports-market",
  components: {
    tsdp,
    comprehensive,
    daily,
    zone,
    channel,
    system,
    MailCreation,
    singleGame
  },
  data() {
    return {
      isSingle: true,
      mailDate: null,
      in_rpt_type: 1,
      in_view_type: 0,
      in_chart_type: 1,
      pickerOptions1: {
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
        }]

      },
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
        }]

      },
      value2: null,
      main: null,
      data: {
        allTxt: "全部",
        isShow: false,
        callback: this.setRcg,
        region: null,           //地区
        regionArr: [],
        game: null,             //游戏名
        gameArr: []
      },
      date: null,
      payDate:null,
      os: null,
      options: [
        {
          os: "0,1",
          txt: "全部"
        },
        {
          os: "0",
          txt: "IOS"
        },
        {
          os: "1",
          txt: "安卓"
        }
      ],
      taging: null,
      tags: {
        comprehensive: {
          label: "综合报表",
          tag: "comprehensive"
        },
        daily: {
          label: "每日报表",
          tag: "daily"
        },
        channel: {
          label: "渠道报表",
          tag: "channel"
        },
        zone: {
          label: "地区报表",
          tag: "zone"
        },
        system: {
          label: "系统对比",
          tag: "system"
        }
      },
      tags_: null,
      taging_: null,
      types: {
        list: 1,
        comprehensive: 2,
        daily: 3,
        channel: 4,
        zone: 5,
        system: 6,
        1: "list",
        2: "comprehensive",
        3: "daily",
        4: "channel",
        5: "zone",
        6: "system",
        os: {
          "0,1": "全部",
          0: "IOS",
          1: "Android"
        }
      }
    };
  },
  computed: {
    _tagState() {
      return this.$store.getters["o_r_delivery/tellTagStatus"];
    },
    _rcg() {
      var str = "";
      var { regionArr, region, gameArr, game } = this.data;
      var arr = [];
      if (regionArr.length) {
        str += region;
        if (gameArr.length) {
          str += " - " + game;
          arr = [
            {
              label: "每日报表",
              tag: "daily"
            },
            {
              label: "渠道报表",
              tag: "channel"
            },
            {
              label: "地区报表",
              tag: "zone"
            },
            {
              label: "系统对比",
              tag: "system"
            }
          ];
          var list1 = this.$store.getters["overseas_common/getList1"];
          var gameId = gameArr[0];
        } else {
          str += " - " + "全部游戏";
          arr = [
            {
              label: "综合报表",
              tag: "comprehensive"
            },
            {
              label: "每日报表",
              tag: "daily"
            }
          ];
        }
        this.$data.tags_ = arr;
        // this.$data.taging_ = arr[0].tag;
        console.log()
        if (Boolean(game)) {
          this.$data.taging_ = arr[1].tag;
        } else {
          this.$data.taging_ = arr[0].tag;
        }
      }
      return str;
    },
    _rcg_() {
      var arr = [];
      var lastQueryParam = this._state.lastQueryParam[this.taging];
      if (lastQueryParam) {
        var { in_os, gameIds, in_install_date1, in_install_date2,in_pay_date1,in_pay_date2, in_rpt_type } = lastQueryParam;
        var str = "";
        if (this.$store.getters["overseas_common/getList1"].hasOwnProperty(gameIds)) {
          if (this._state.region) {
            str += this._state.region;
            if (this._state.game) {
              str += " - " + this._state.game;
            } else {
              str += " - " + "全部游戏";
            }
          }
        }
        arr = [
          "（系统）" + this.types.os[in_os],
          in_install_date1 + " 至 " + in_install_date2,
          in_pay_date1 + " 至 " + in_pay_date2,
          "（国家/地区）" + (str || this.data.allTxt),
          this.tags[this.types[in_rpt_type]].label
        ];
      }
      return arr;
    },
    _state() {
      return this.$store.state.o_r_delivery;
    },
    _config() {
      return this.$store.state.o_r_delivery.configs[this.taging];
    },
    _key() {
      return this.$store.getters["o_r_delivery/getIdStr"];
    }
  },
  watch: {
    date(newData,oldData) {
      var date = newData.map(item => moment(item).format("YYYY-MM-DD"));
      if(new Date(date[0]).getTime()>new Date(this.payDate[1]).getTime()){
        this.date = oldData;
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      }else{
        this.$store.commit("o_r_delivery/setDate", date);
        this.payDate = [date[0],this.payDate[1]]
      }
      
    },
    payDate(data){
      var date = data.map(item => {
        if(typeof item === 'string'){
          return item
        }
        return moment(item).format("YYYY-MM-DD")
      });
      this.$store.commit("o_r_delivery/setPayDate", date);
    },
    os(data) {
      this.$store.commit("o_r_delivery/setOs", data);
    }
  },
  methods: {
    getFilterList() {
      var params = {
        in_install_date1: this._state.date[0],          //激活开始日期
        in_install_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_os: this._state.os,                        //系统                  
        in_area_app_ids: this._key,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: 4,                                //报表类型: 1 查询游戏层级  2 综合报表  3 每日报表   4 渠道(媒体)报表   5 系统对比
        in_country: '',                               //国家
        in_chart_type: 0,                              //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: 1,                               //视图类型：1 渠道 2 时间 3 地区
        in_package_name:""                             //包名
      };
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: 'channelInfo' });
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
    excel() {
      var timestamp = Date.now()
      if (this.main === "comprehensive") {
        var data = this.$store.getters["o_r_delivery/getComprehensive"];
        var len = data.category.length
        for (var i = 0; i < len; i++) {
          var thead = document.querySelectorAll('.el-table__header thead')[i*2].innerHTML
          var tbody = document.querySelectorAll('.el-table__header-wrapper+.el-table__body-wrapper>table:first-child')[i].innerHTML + document.querySelectorAll('.el-table__append-wrapper tbody')[i].innerHTML
          var table = document.createElement('table')
          table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
          Utils.tableToExcel(
            table,
            false,
            (timestamp + i) + '.xls'
          )
        }
      } else {
        if (this.main === "daily") {
          var tbody = document.querySelector('.el-table__body tbody').innerHTML+document.querySelector('.el-table__append-wrapper tbody').innerHTML
        } else {
          var tbody = document.querySelector('.el-table__body tbody').innerHTML+document.querySelector('.el-table__footer tbody').innerHTML
        }
        var thead = document.querySelector('.el-table__header thead').innerHTML
        
        var table = document.createElement('table')
        table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
        Utils.tableToExcel(
          table,
          false,
          timestamp + '.xls'
        )
      }
    },
    getIdStr() {
      if (this.data.gameArr.length) {
        return this.data.gameArr[0];
      }
      if (this.data.regionArr.length) {
        return this.data.regionArr.join(",");
      }
      return "";
    },
    checkMail() {
      if (this._state.mailUrl) {
        window.open(http.host + this._state.mailUrl);
      } else {
        this.$notify({
          type: "warning",
          message: "点击生成邮件"
        });
      }
    },
    pickerChange() {
      var date = moment(this.value2).format("YYYY-MM-DD");
      if (confirm("确定生成" + date + "的邮件吗")) {
        this.$data.mailDate = date

        api.user
          .getMail({
            countDate: date,
            gameIds: '19,33,34,36,38,41,46,47,48,57,58,59,60'
          })
          .then(({ code, state }) => {
            if (code === 303) {
              this._state.mailUrl = state;
            } else {
              this.$notify({
                type: "warning",
                message: "邮件生成出现错误"
              });
            }
          });
      }
    },
    tagClick(flag) {
      console.log(this.taging)
      console.log(flag)
      this.$store.commit("o_r_delivery/set_is2", false);
      var isQuery;
      // 对比查询参数是否一致
      var lastQueryParam = flag ? this._state.lastQueryParam['system'] : this._state.lastQueryParam[this.taging];
      if (lastQueryParam) {
        var same;
        same = [
          lastQueryParam.os === this.os,
          lastQueryParam.begin_date === this._state.date[0],
          lastQueryParam.end_date === this._state.date[1],
          lastQueryParam.gameIds === this.getIdStr()
        ];
        if (same.indexOf(false) !== -1) isQuery = true;
      } else {
        isQuery = true;
      }
      if (flag) {
        isQuery && this.getData('system', this.taging);
      } else {
        this.main = this.taging
        isQuery && this.getData(false, this.taging);
      }
    },
    setRcg([region, regionArr, game, gameArr]) {
      this.data.region = region;
      this.data.regionArr = regionArr;
      this.data.game = game;
      this.data.gameArr = gameArr;
    },
    dataInit() {
      if (this._state.taging) {
        this.main = this.taging = this._state.taging;
      } else {
        this.main = this.taging = "comprehensive";
      }
      if (this._state.os) {
        this.os = this._state.os;
      } else {
        this.os = "0,1";
      }
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = [
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD"),
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD")
        ];
      }
      if (this._state.payDate) {
        this.payDate = this._state.payDate;
      } else {
        this.payDate = [
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD"),
          moment()
            .add(-1, "day")
            .format("YYYY-MM-DD")
        ];
      }
      if (this._state.region) this.data.region = this._state.region;
      if (this._state.regionArr) this.data.regionArr = this._state.regionArr;
      if (this._state.game) this.data.game = this._state.game;
      if (this._state.gameArr) this.data.gameArr = this._state.gameArr;
    },
    getData(taging_, isType) {
      // 修改动态组件
      if (taging_) this.taging = taging_;
      this.main = this.taging;
      // 第一步:判断按下的是否是查询按钮
      if (isType) {
        console.log('tag', '按下的不是查询按钮')
        var arr = ["daily","comprehensive"]
        if (arr.includes(this.taging) && this.data.game) {
        // 第二步:判断是否选择游戏
          this.main = 'channel'
          this.taging = 'channel'
          console.log('tag', '查询单个全部')
          this.isSingle = false;
          this.in_rpt_type = 4
          this.in_view_type = 1
        }else if(this.taging == "system"){
          this.in_rpt_type = 5;
          this.in_chart_type = 0;
          this.in_view_tye = 0;
        }else {
          this.in_chart_type = 0;
          this.in_view_tye = 0;
          if (this.taging == "comprehensive") {
            this.in_rpt_type = 2;
          } else if (this.taging == "daily") {
            this.in_rpt_type = 3;
          } else if (this.taging == "system") {
            this.in_rpt_type = 5;
            this.in_chart_type = 0;
            this.in_view_tye = 0;
          }
        }
      } else {
        //如果是查询按钮,判断是当前查询组件
        // console.log('tag', '按下的是查询按钮')
        if (!this.data.game) {
          this.isSingle = true;
          // console.log('tag', '查询全部')
          this.in_rpt_type = 2;
          this.in_view_type = 0;
        } else {
          // console.log('tag', '查询单个全部')
          if (this.data.game) {
            this.isSingle = false;
            this.in_rpt_type = 4
            this.in_view_type = 1
            // this.in_chart_type = 1
            if (this.$store.state.o_r_delivery.tableIsVisible) {
              // console.log('tag', '查询channel table数据')
              this.in_chart_type = 1
            } else {
              // console.log('tag', '查询channel legend数据')
              this.in_chart_type = 2

            }
          }
        }
      }
      this.$store.commit("o_r_delivery/setTaging", this.taging);
      this.$store.commit("o_r_delivery/setRegion", this.data.region);
      this.$store.commit("o_r_delivery/setRegionArr", this.data.regionArr);
      this.$store.commit("o_r_delivery/setGame", this.data.game);
      this.$store.commit("o_r_delivery/setGameArr", this.data.gameArr);
      var params = {
        in_install_date1: this._state.date[0],          //激活开始日期
        in_install_date2: this._state.date[1],          //激活结束日期
        in_pay_date1:this._state.payDate[0],            //充值开始时间
        in_pay_date2:this._state.payDate[1],            //充值结束时间
        in_os: this._state.os,                        //系统                  
        in_area_app_ids: this._key,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: this.in_rpt_type,                 //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: '',                               //国家
        in_chart_type: this.in_chart_type,             //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.in_view_type,               //视图类型：1 渠道 2 时间 3 地区
        in_package_name:""                             //包名
      };
      this._state.lastQueryParam[this.taging] = params;
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? this.taging : 'legend' }).then(
        () => {
          if (this.taging == 'channel' && 　this.$store.state.o_r_delivery.tableIsVisible) {
            this.getFilterList()
          }
        }
      );
    },
    createMail() {
      this.$refs.picker.showPicker();
    },
    onKeyDown({ keyCode }) {
      switch (keyCode) {
        case 13:
          if (!this.data.isShow) {
            this.getData(this.taging_, false);
          }
          break;
      }
    }
  },
  created() {
    this.dataInit();
    this.$store.dispatch("overseas_common/getList1").then(data => {
      if (!this._state.region || !this._state.regionArr.length) {
        this.data.region = this.data.allTxt;
        this.data.regionArr = this.$store.state.overseas_common.list1All;
      }
      if (!this._state[this.taging][this._key]) this.getData();
    });
  },
  mounted() {
    // 如果加载渠道报表则隐藏报表tab选项
    if (this.data.game) {
      this.isSingle = false;
    }
    this.$refs.picker1.mountPicker();
    this.$refs.picker1.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker1.picker._parentEl = this.$refs.picker1.$el;
    this.$refs.picker2.mountPicker();
    this.$refs.picker2.picker.dateShortcuts = this.dateShortcuts
    this.$refs.picker2.picker._parentEl = this.$refs.picker2.$el;
    window.addEventListener("keydown", this.onKeyDown);
  },
  destroyed() {
    window.removeEventListener("keydown", this.onKeyDown);
  }
};
</script>

<style lang="scss" scoped>
.os {
  width: 100px;
}
.el-select-dropdown__item {
  text-align: center;
}
.el-tabs {
  width: 100%;
}
.selection {
  margin-left: 15px;
}
.selection-box {
  position: relative;
  .dateTime{
    position: absolute;
    top: -60px;
    left: 165px;
    display: flex;
  }
  .tag {
    margin: 15px 0 15px 16px;
  }
  .r-g {
    font-size: 15px;
    padding-left: 15px;
  }
  margin-top: 5px;
  .mail {
    display: flex;
    // justify-content: flex-end;
    flex-grow: 1;
    margin: 0px 10px 0 0;
    button:nth-child(1) {
      margin-left: 50px;
    }
  }
}
.date-box {
  margin-top: 15px;
}
.date-box-item {
  span {
    font-size: 15px;
    padding-right: 10px;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
}
</style>

<style lang="scss">
.el-table__row.total {
  font-weight: 700;
}
.el-tabs__nav-scroll {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.el-tabs__item {
  user-select: none;
  width: 150px;
  text-align: center;
  font-size: 16px;
}
.reports-market {
  .chart-area,
  .table-item {
    background: rgba(208, 196, 214, 0.5);
    margin: 12px;
    padding: 15px;
  }
}

.el-picker-panel__shortcut {
  line-height: 29px !important;
  // font-weight: 700;
  font-size: 1.02em;
}
.el-picker-panel__shortcut:hover {
  color: #fff !important;
  background: #409eff !important;
}
</style>
