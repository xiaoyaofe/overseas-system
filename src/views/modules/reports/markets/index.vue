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
            :picker-options="dateOptions"
            ref="picker1"
            v-model="activationTime"
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
            :picker-options="dateOptions"
            ref="picker2"
            v-model="rechargeTime"
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
        <el-button size="medium" class="selection" @click="tsdp.isShow=true">
          <span>已选择：</span>
          <span>{{_rcg}}</span>
        </el-button>
      </section>
      <!-- 系统 -->
      <div class="date-box-item" v-show="!tsdp.game">
        <span style="min-width:40px">系统</span>
        <el-select class="os" v-model="os" size="medium">
          <el-option
            v-for="item in systemOptions"
            :key="item.value"
            :label="item.txt"
            :value="item.os"
          ></el-option>
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
          v-model="emailParams"
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
      <tsdp :data="tsdp" v-if="tsdp.isShow"></tsdp>
    </my-row>
    <my-row>
      <el-tabs v-model="tagComponentName" @tab-click="tagClick(false)" style="marginTop:35px">
        <el-tab-pane
          v-if="(isSingle && _tagState[tag])"
          v-for="({ label }, tag) in tags"
          :key="tag"
          :label="label"
          :name="tag"
        ></el-tab-pane>
        <!-- 动态组件 -->
        <component :is="main" :data="tsdp" :_config="_config" :_types="types"></component>
      </el-tabs>
    </my-row>
  </div>
</template>

<script>
import api from "src/services/api";
import http from "src/services/http";
// 每日报表
import daily from "./daily.vue";
// 渠道报表
import channel from "./channel.vue";
// 综合报表
import comprehensive from "./comprehensive.vue";
// 选择游戏
import tsdp from "src/component/widget/tree-degree-select-box/index.vue";
export default {
  name: "reports-market",
  components: {
    tsdp,
    comprehensive,
    daily,
    channel,
  },
  data() {
    return {
      os: "0,1",
      main: "comprehensive",
      tags_: null,
      taging_: null,
      isSingle: true,
      mailDate: null,
      in_rpt_type: 1,
      in_view_type: 0,
      in_chart_type: 1,
      emailParams: null,
      rechargeTime: null,
      activationTime: null,
      tagComponentName: "comprehensive",
      tsdp: {
        allTxt: "全部",
        isShow: false,
        callback: this.setRcg,
        region: null,           //地区
        regionArr: [],
        game: null,             //游戏名
        gameArr: []
      },
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
        }]

      },
      systemOptions: [
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

      },
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
      var { regionArr, region, gameArr, game } = this.tsdp;
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
      var lastQueryParam = this._state.lastQueryParam[this.tagComponentName];
      if (lastQueryParam) {
        var { in_os, gameIds, in_install_date1, in_install_date2, in_pay_date1, in_pay_date2, in_rpt_type } = lastQueryParam;
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
          "（国家/地区）" + (str || this.tsdp.allTxt),
          this.tags[this.types[in_rpt_type]].label
        ];
      }
      return arr;
    },
    _state() {
      return this.$store.state.o_r_delivery;
    },
    _config() {
      return this.$store.state.o_r_delivery.configs[this.tagComponentName];
    },
  },
  watch: {
    activationTime(newData, oldData) {
      var date = newData.map(item => moment(item).format("YYYY-MM-DD"));
      if (new Date(date[0]).getTime() > new Date(this.dateFormat(this.rechargeTime)[1]).getTime()) {
        this.date = oldData;
        return Utils.Notification.error({ message: '激活开始时间大于充值结束时间,请重新选择' });
      } else {
        this.rechargeTime = [date[0], this.dateFormat(this.rechargeTime)[1]]
      }

    },
    
  },
  methods: {
    getFilterList() {
      var params = {
        in_install_date1: this.dateFormat(this.activationTime)[0],          //激活开始日期
        in_install_date2: this.dateFormat(this.activationTime)[1],          //激活结束日期
        in_pay_date1: this.dateFormat(this.rechargeTime)[0],            //充值开始时间
        in_pay_date2: this.dateFormat(this.rechargeTime)[1],            //充值结束时间
        in_os: this.os,                        //系统                  
        in_area_app_ids: this.getIdStr(),                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: 4,                                //报表类型: 1 查询游戏层级  2 综合报表  3 每日报表   4 渠道(媒体)报表   5 系统对比
        in_country: '',                               //国家
        in_chart_type: 0,                              //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: 1,                               //视图类型：1 渠道 2 时间 3 地区
        in_package_name: ""                             //包名
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
          var thead = document.querySelectorAll('.el-table__header thead')[i * 2].innerHTML
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
          var tbody = document.querySelector('.el-table__body tbody').innerHTML + document.querySelector('.el-table__append-wrapper tbody').innerHTML
        } else {
          var tbody = document.querySelector('.el-table__body tbody').innerHTML + document.querySelector('.el-table__footer tbody').innerHTML
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
      if (this.tsdp.gameArr.length) {
        return this.tsdp.gameArr[0];
      }
      if (this.tsdp.regionArr.length) {
        return this.tsdp.regionArr.join(",");
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
      var date = moment(this.emailParams).format("YYYY-MM-DD");
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
      this.$store.commit("o_r_delivery/set_is2", false);
      var isQuery;
      // 对比查询参数是否一致
      var lastQueryParam = flag ? this._state.lastQueryParam['system'] : this._state.lastQueryParam[this.tagComponentName];
      if (lastQueryParam) {
        var same;
        same = [
          lastQueryParam.os === this.os,
          lastQueryParam.begin_date === this._state.activationTime[0],
          lastQueryParam.end_date === this._state.activationTime[1],
          lastQueryParam.gameIds === this.getIdStr()
        ];
        if (same.indexOf(false) !== -1) isQuery = true;
      } else {
        isQuery = true;
      }
      if (flag) {
        isQuery && this.getData('system', this.tagComponentName);
      } else {
        this.main = this.tagComponentName
        isQuery && this.getData(false, this.tagComponentName);
      }
    },
    setRcg([region, regionArr, game, gameArr]) {
      this.tsdp.region = region;
      this.tsdp.regionArr = regionArr;
      this.tsdp.game = game;
      this.tsdp.gameArr = gameArr;
    },
    dateFormat(val) {
      var date = val.map(item => {
        if (typeof item === 'string') {
          return item
        }
        return moment(item).format("YYYY-MM-DD")
      });
      return date
    },
    dataInit() {
       // 如果加载渠道报表则隐藏报表tab选项
      this.isSingle = this.tsdp.game?true:false;
      this.$refs.picker1.mountPicker();
      this.$refs.picker1.picker.dateShortcuts = this.dateShortcuts
      this.$refs.picker1.picker._parentEl = this.$refs.picker1.$el;
      this.$refs.picker2.mountPicker();
      this.$refs.picker2.picker.dateShortcuts = this.dateShortcuts
      this.$refs.picker2.picker._parentEl = this.$refs.picker2.$el;
      window.addEventListener("keydown", this.onKeyDown);
      if (this._state.reportQueryParams) {
        this.main = this.tagComponentName = this._state.reportQueryParams.tagComponentName;
        this.activationTime = this._state.reportQueryParams.activationTime;
        this.rechargeTime = this._state.reportQueryParams.rechargeTime;
        this.os = this._state.reportQueryParams.os;

        this.tsdp.region = this._state.region;
        this.tsdp.regionArr = this._state.regionArr;
        this.tsdp.game = this._state.game;
        this.tsdp.gameArr = this._state.gameArr;
      } else {
        this.os = "0,1";
        this.main = this.tagComponentName = "comprehensive";
        this.rechargeTime = [moment().add(-1, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")];
        this.activationTime = [moment().add(-1, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")];
      }
    },
    getData(taging_, isType) {
      // 修改动态组件
      if (taging_) this.tagComponentName = taging_;
      this.main = this.tagComponentName;
      // 第一步:判断按下的是否是查询按钮
      if (isType) {
        var arr = ["daily", "comprehensive"]
        if (arr.includes(this.tagComponentName) && this.tsdp.game) {
          // 第二步:判断是否选择游戏
          this.main = 'channel'
          this.tagComponentName = 'channel'
          this.isSingle = false;
          this.in_rpt_type = 4
          this.in_view_type = 1
        } else if (this.tagComponentName == "system") {
          this.in_rpt_type = 5;
          this.in_chart_type = 0;
          this.in_view_tye = 0;
        } else {
          this.in_chart_type = 0;
          this.in_view_tye = 0;
          if (this.tagComponentName == "comprehensive") {
            this.in_rpt_type = 2;
          } else if (this.tagComponentName == "daily") {
            this.in_rpt_type = 3;
          } else if (this.tagComponentName == "system") {
            this.in_rpt_type = 5;
            this.in_chart_type = 0;
            this.in_view_tye = 0;
          }
        }
      } else {
        //如果是查询按钮,判断是当前查询组件
        if (!this.tsdp.game) {
          this.isSingle = true;
          this.in_rpt_type = 2;
          this.in_view_type = 0;
        } else {
          if (this.tsdp.game) {
            this.isSingle = false;
            this.in_rpt_type = 4
            this.in_view_type = 1
            // this.in_chart_type = 1
            if (this.$store.state.o_r_delivery.tableIsVisible) {
              this.in_chart_type = 1
            } else {
              this.in_chart_type = 2
            }
          }
        }
      }
      
      var params = {
        in_install_date1: this.dateFormat(this.activationTime)[0],          //激活开始日期
        in_install_date2: this.dateFormat(this.activationTime)[1],          //激活结束日期
        in_pay_date1: this.dateFormat(this.rechargeTime)[0],            //充值开始时间
        in_pay_date2: this.dateFormat(this.rechargeTime)[1],            //充值结束时间
        in_os: this.os,                        //系统                  
        in_area_app_ids: this.getIdStr(),                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: this.in_rpt_type,                 //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: '',                               //国家
        in_chart_type: this.in_chart_type,             //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.in_view_type,               //视图类型：1 渠道 2 时间 3 地区
        in_package_name: ""                             //包名
      };
      this._state.lastQueryParam[this.tagComponentName] = params;
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? this.tagComponentName : 'legend' }).then(
        () => {
          let reportQueryParams = {
            os: this.os,
            rechargeTime: this.dateFormat(this.rechargeTime),
            activationTime: this.dateFormat(this.activationTime),
            tagComponentName:this.tagComponentName
          }

          this.$store.commit("o_r_delivery/setReportQueryParams", reportQueryParams);
          this.$store.commit("o_r_delivery/setRegionArr", this.tsdp.regionArr);
          this.$store.commit("o_r_delivery/setGameArr", this.tsdp.gameArr);
          this.$store.commit("o_r_delivery/setRegion", this.tsdp.region);
          this.$store.commit("o_r_delivery/setGame", this.tsdp.game);
          if (this.tagComponentName == 'channel' && this.$store.state.o_r_delivery.tableIsVisible) {
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
          if (!this.tsdp.isShow) {
            this.getData(this.taging_, false);
          }
          break;
      }
    }
  },
  created() {
    this.$store.dispatch("overseas_common/getList1").then(data => {
      if (!this._state.region || !this._state.regionArr.length) {
        this.tsdp.region = this.tsdp.allTxt;
        this.tsdp.regionArr = this.$store.state.overseas_common.list1All;
      }
      if (!this._state[this.tagComponentName][this.getIdStr()]) this.getData();
    });
  },
  mounted() {
    this.dataInit();
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
  .dateTime {
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
