<template>
  <div>
    <div v-if="$data.$_curChannel">
      <el-button size="medium" @click="back()">
        <span>
          当前渠道:
          <span style="color:#5b5691;font-weight:700">{{$data.$_curChannel}}</span>
          —— 返回
        </span>
      </el-button>
    </div>
    <div class="centerBox">
      <!-- 筛选行 -->
      <section class="btns">
        <!-- 表格/图例 -->
        <el-radio-group class="view" v-model="valueName" size="medium">
          <el-radio-button label="表格"></el-radio-button>
          <el-radio-button label="图例"></el-radio-button>
        </el-radio-group>
        <el-button style="marginRight:15px;height:36px" size="medium" @click="slide(300)">筛选</el-button>
      </section>
      <!-- 图例 -->
      <div class="legendBox" v-show="!$store.state.o_r_delivery.tableIsVisible">
        <div style="text-align: center;">
          <el-select class="os" v-model="lineValue">
            <el-option
              v-for="item in $$legend.lineSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- left -->
        <section class="left">
          <div style="width: 90%;margin: 10px 10%;">
            <el-autocomplete
              class="inline-input"
              v-model="inputTxt"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-autocomplete>
          </div>

          <div class="leftList">
            <section
              class="list_"
              v-for="(item,index) in this.leftlistArr"
              :key="index"
              @click="changLeftList(index)"
            >
              <span>{{item.name}}</span>
              <i class="el-icon-circle-plus-outline" v-show="item.visible"></i>
              <i class="el-icon-remove-outline" v-show="!item.visible"></i>
            </section>
          </div>
        </section>
        <!-- right -->
        <section class="right">
          <div class="chartBox">
            <section
              class="list_"
              v-for="(item,index) in this.rightListArr"
              :key="index"
              v-show="item.visible"
              @click="changLeftList(index)"
            >
              <span>{{item.name}}</span>
              <i class="el-icon-remove-outline"></i>
            </section>
          </div>
          <div class="chart-area" ref="chart"></div>
        </section>
      </div>
      <!-- 筛选框 -->
      <select-box :style="{width:'300px',right:`${width}px`}"></select-box>
      <!-- 表格 -->
      <div v-show="$store.state.o_r_delivery.tableIsVisible" class="table-item">
        <!-- 标题 -->
        <div style="marginBottom:15px">
          <span>标题</span>
          <el-select
            filterable
            collapse-tags
            multiple
            @change="titleSelectAll"
            v-model="titleValue"
            size="medium"
          >
            <el-option
              v-for="(item,i) in titleOptions"
              :key="i"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <el-table
          :data="$store.getters['o_r_delivery/getAllChannel']"
          :cell-style="addStyle"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_r_delivery/getAllChannel']?$store.getters['o_r_delivery/getAllChannel'][0]:[]))"
            :key="i"
            v-if="show[i].label"
            :prop="item"
            :label="item"
            :formatter="formatter"
            :fixed="i<=2?true:false"
            :width="getWidth(item)"
            :sortable="i>1?true:false"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import selectBox from './filter-box.vue'
import http from 'src/services/http';
import { log } from 'util';
export default {
  props: ['data', '_config', '_types'],
  components: { selectBox },
  data: () => {
    return {
      $_chartIsReady: 0,
      $_curChannel: null,
      channels: [],
      inputTxt: "",
      valueName: "表格",
      width: -300,
      lineValue: 0,
      titleValue: [],     //标题下标
      chart: null,
      restaurants: [],
      rightListArr: [],
      leftlistArr: [],
      titleOptions: [],
      titleOptionsCopy: [],
      titleOldOptions: [[]],
      lineArr: [],
      lineData: [],
      show: [],
    };
  },
  computed: {
    $$getChannelInfo() {
      var getChannelInfo = this.$store.getters["o_r_delivery/getChannelInfo"];
      return getChannelInfo
    },
    // 筛选条件
    $$channellist() {
      var allData = this.$store.getters["o_r_delivery/getChannelList"];
      return allData
    },
    // 图例
    $$legend() {
      var allData = this.$store.getters["o_r_delivery/getLengendData"];
      if (allData && allData.leftlistArr) {
        this.leftlistArr = allData.leftlistArr
        this.rightListArr = allData.rightListArr
        this.lineData = allData.lineData
        this.$nextTick(() => {
          this.createChart();
        });
      }
      return allData
    },
    _state() {
      return this.$store.state.o_r_delivery;
    },
    _key() {
      return this.$store.getters["o_r_delivery/getIdStr"];
    }
  },
  created() {
    this.dataInit()

  },
  watch: {
    $$getChannelInfo(newValue, oldValue) {
      this.title_init()
    },
    channels(channels) {
      this.$store.commit("o_r_delivery/set_channels", channels);
    },
    //切换linevalue 恢复默认显示
    lineValue(newValue, oldValue) {
      localStorage.setItem("lineValue", newValue)
      for (let index = 0; index < this.$$legend.leftlistArr.length; index++) {
        if (index == 0) {
          this.$$legend.leftlistArr[index].visible = false
          this.$$legend.rightListArr[index].visible = true
        } else {
          this.$$legend.leftlistArr[index].visible = true
          this.$$legend.rightListArr[index].visible = false
        }

      }
      this.createChart();
    },
    // 切换图利表格视图
    valueName(newValue, oldValue) {
      this.slide(0)
      this.$store.state.o_r_delivery.tableIsVisible = !this.$store.state.o_r_delivery.tableIsVisible;
      // 恢复默认筛选条件
      this.title_init()
      this.lineValue = 0;
      var params = {
        in_install_date1: this._state.date[0],          //激活开始日期
        in_install_date2: this._state.date[1],          //激活结束日期
        in_pay_date1: this._state.payDate[0],            //充值开始时间
        in_pay_date2: this._state.payDate[1],            //充值结束时间
        in_os: this._state.os,                         //系统                  
        in_area_app_ids: this._key,                    //游戏层级 
        in_media_source: "",                           //渠道
        in_rpt_type: 4,                                //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_country: '',                                //国家
        in_chart_type: this.$store.state.o_r_delivery.tableIsVisible ? 1 : 2,           //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: 1,                                 //视图类型：1 渠道 2 时间 3 地区
        in_package_name: ""                             //包名
      };
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? 'channel' : 'legend' });
    },
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      var activeData = [];
      var constData = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '全部';
          return;
        }
        if (index === 1) {
          sums[index] = '全部';
          return;
        }
        var values = data.map((item) => Number(item[column.property]));
        if (index === 2) {
          activeData = values
        }

        if (index > 13) {
          var arr = [];
          for (let index = 0; index < values.length; index++) {
            arr.push(values[index] * (activeData[index]))
          }
          values = arr
        }
        if (!values.every(value => isNaN(value))) {

          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev + curr).format(2);
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = 'N/A';
        }
        if (column.property == '注册率') {
          sums[index] = (sums[3] / sums[2] * 100).format(2) + '%';
        }
        if (column.property == '创角率') {
          sums[index] = (sums[4] / sums[2] * 100).format(2) + '%';
        }
      });
      sums[7] = (sums[10] / sums[2]).format(2); //激活成本
      sums[8] = (sums[10] / sums[3]).format(2); //注册成本
      sums[9] = (sums[10] / sums[4]).format(2); //创角成本
      sums[12] = ((sums[11] / sums[10]) * 100).format(2) + '%'; //ROI
      sums[14] = ((sums[13] / sums[10]) * 100).format(2) + '%'; //分成ROI
      sums[15] = ((sums[15] / sums[2])).format(2); //7日LTV
      sums[16] = ((sums[16] / sums[2])).format(2); //14日LTV
      sums[17] = ((sums[17] / sums[2])).format(2); //30日LTV
      sums[18] = ((sums[18] / sums[2])).format(2) + '%';
      sums[19] = ((sums[19] / sums[2])).format(2) + '%';
      sums[20] = ((sums[20] / sums[2])).format(2) + '%';
      return sums;
    },
    back() {
      this.$data.$_curChannel = null
      this.$store.commit("o_r_delivery/set_is2", false);
    },
    formatter(row, column, value) {
      var {
        label
      } = column
      if (
        label === '注册率'
        || label === '创角率'

      ) {
        // value += '%'
        value = +value ? value.format(2) + '%' : value.format(0) + '%';
      } else if (label === 'ROI' || label === '分成ROI') {
        value = (value).format(2) + '%';
      } else if (
        label === '次日留存'
        || label === '3日留存'
        || label === '7日留存'
      ) {
        value = value.format(2) + '%';
      } else if (label === '激活成本'
        || label === '注册成本'
        || label === '创角成本'
        || label == '7日LTV'
        || label == '14日LTV'
        || label == '30日LTV'
        || label == '充值') {
        value = +value ? value.format(2) : value.format(0);
      }
      return value
    },
    addStyle({ row, column, rowIndex, columnIndex }) {
      function r2g(value, avg) {
        var percent = value;
        if (percent < 30) return "#f9686a";
        else if (percent <= 50) return "#ffc0cb";
        else if (percent <= 70) return "#ffeb85";
        else if (percent <= 90) return "#98fb98";
        else return "#228b22";
      }
      function g2r(value, avg) {
        var middle = avg / 0.5;
        var percent = value / middle;
        if (percent <= 0.2) return "#228b22";
        else if (percent <= 0.4) return "#98fb98";
        else if (percent <= 0.6) return "#ffeb85";
        else if (percent <= 0.8) return "#ffc0cb";
        else return "#f9686a";
      }
      function retColor(mmaObj, data) {
        var avg = mmaObj ? mmaObj.avg : 0;
        var isReversal = mmaObj ? mmaObj.isReversal : true;
        var style = {
          fontWeight: 700,
          color: "#000"
        };
        if (isReversal == true) {
          style["background"] = g2r(data, avg);
        } else {
          style["background"] = r2g(data, avg);
        }
        return style;
      }

      var { label } = column;
      switch (label) {
        case '注册率':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '创角率':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '激活成本':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '注册成本':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
        case '创角成本':
          return retColor(this.$$channellist.mmas[label], row[label]);
          break;
      }

    },
    createChart() {
      var chart = Highcharts.chart(this.$refs.chart, {
        colors: ['#7cb5ec', '#C106EB', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: this.$$legend.xList,
          crosshair: {
            width: 1,
            color: '#747474'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {
            // format: '{value:.0f}'//设置y轴显示格式
            formatter: function (index) {
              var indexArr = [3, 4, 10, 11, 15, 16, 17]
              if (indexArr.includes(+localStorage.getItem("lineValue"))) {
                return this.value + '%';//y轴加上%
              } else {
                return this.value
              }
            }
          },
          crosshair: {
            width: 1,
            color: '#747474'
          }
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          line: {
            dataLabels: {
              // 开启数据标签
              enabled: false
            },
            // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            enableMouseTracking: true
          },
          series: {
            events: {
              legendItemClick: function () {
                // return false 即可禁止图例点击响应
                return false;
              }
            }
          }
        },
        credits: {
          enabled: false　　　　　　//去除highcharts的链接
        },

        series: this.lineData[this.lineValue]
      });
      this.$data.$_chartIsReady = Math.random()
      this.chart = chart;
    },
    slide(width) {
      if (width == 0) {
        this.width = -300
        this.isShow = !this.isShow
        return
      }
      if (this.width == 0) {
        let timer = setInterval(() => {
          this.width -= 20;
          if (this.width == -width) {
            clearInterval(timer);
            this.isShow = !this.isShow
          }
        }, 10);
      } else if (this.width == -width) {
        let timer = setInterval(() => {
          this.width += 20;
          if (this.width == 0) {
            clearInterval(timer);
            this.isShow = !this.isShow
          }
        }, 10);
      }
    },
    changLeftList(index) {
      // true 添加 false 删除
      var series = this.chart.series[index];
      if (this.$$legend.leftlistArr[index].visible) {
        if ((!this.$$legend.leftlistArr[0].visible && index != 0)) {
          Utils.Notification.warning({
            message: '选择了总计，无法选中其他'
          })
          return
        } else if (index == 0 && this.$$legend.leftlistArr.filter(data => !data.visible && data.name != this.$$legend.leftlistArr.name).length) {
          Utils.Notification.warning({
            message: '选择了其他，无法选中总计'
          })
          return
        }
        if (series.visible) {
          series.hide();
        } else {
          series.show();
        }
        this.$$legend.leftlistArr[index].visible = !this.$$legend.leftlistArr[index].visible
        this.$$legend.rightListArr[index].visible = !this.$$legend.rightListArr[index].visible
      } else {
        if (series.visible) {
          series.hide();
        } else {
          series.show();
        }
        this.$$legend.leftlistArr[index].visible = !this.$$legend.leftlistArr[index].visible
        this.$$legend.rightListArr[index].visible = !this.$$legend.rightListArr[index].visible
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.$$legend.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      for (let index = 0; index < this.leftlistArr.length; index++) {
        var series = this.chart.series[index];
        if (this.leftlistArr[index].name == item.value) {
          if (this.leftlistArr[index].visible) {
            if ((!this.leftlistArr[0].visible && index != 0)) {
              Utils.Notification.warning({
                message: '选择了总计，无法选中其他'
              })
              return
            } else if (index == 0 && this.leftlistArr.filter(data => !data.visible && data.name != this.leftlistArr[0].name).length) {
              Utils.Notification.warning({
                message: '选择了其他，无法选中总计'
              })
              return
            }
            if (series.visible) {
              series.hide();
            } else {
              series.show();
            }
            this.leftlistArr[index].visible = !this.leftlistArr[index].visible
            this.rightListArr[index].visible = !this.rightListArr[index].visible
          } else {
            if (series.visible) {
              series.hide();
            } else {
              series.show();
            }
            this.leftlistArr[index].visible = !this.leftlistArr[index].visible
            this.rightListArr[index].visible = !this.rightListArr[index].visible
          }
        }
      }
    },
    // 筛选条件初始化
    dataInit() {
      this.$store.state.o_r_delivery.tableIsVisible = true;
      localStorage.setItem("lineValue", 0)
      this.title_init()
      this.viewName = 'table';
      for (let i = 0; i < 22; i++) {
        var item = { label: true };
        this.show.push(item);
      }
    },
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
    // 标题全选
    titleSelectAll(val) {
      let allValues = []
      //保留所有值
      for (let item of this.titleOptions) {
        allValues.push(item.name)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.titleOldOptions.length === 1 ? [] : this.titleOldOptions[1]

      // 若是全部选择
      if (val.includes('全部')) {
        if (this.titleOptionsCopy.length != allValues.length) {
          allValues.shift()
        }
        this.titleValue = allValues
      }

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('全部') && !val.includes('全部')) this.titleValue = []

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
      // 新老数据都有全部选中 
      if (oldVal.includes('全部') && val.includes('全部')) {
        const index = val.indexOf('全部')
        val.splice(index, 1) // 排除全选选项
        this.titleValue = val
      }
      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('全部') && !val.includes('全部')) {
        if (val.length === allValues.length - 1) this.titleValue = ['全部'].concat(val)
      }
      //储存当前最后的结果 作为下次的老数据 
      for (let msg = 0; msg < this._state.filterTitleData.length; msg++) {
        if (this.titleValue.includes(this._state.filterTitleData[msg].name)) {
          if (this._state.filterTitleData[msg].index != -1) {
            this.show[this._state.filterTitleData[msg].index].label = true;
          }
        } else {
          if (this._state.filterTitleData[msg].index != -1) {
            this.show[this._state.filterTitleData[msg].index].label = false;
          }
        }

      }
      this.titleOldOptions[1] = this.titleValue
    },
    // 标题初始化
    title_init() {
      this.titleOptions = this._state.filterTitleData;
      this.titleOptionsCopy = this._state.filterTitleData;
      this.titleValue = this._state.filterTitleDataValue;
    }
  }
}; 
</script>

<style lang="scss">
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.row {
  display: flex;
  flex-direction: row;
  margin: 2px 13px;
  width: 100%;
  .channels {
    width: 94%;
  }
}
.has-gutter {
  font-weight: bold;
}
.reports-market {
  .el-table__row {
    td.channel {
      padding: 0;
    }
  }
}

.centerBox {
  width: 100%;
  min-height: 700px;
  .btns {
    display: flex;
    justify-content: flex-end;
    .view {
      margin: 0 15px;
    }
  }
  .legendBox {
    .os {
      min-width: 150px;
    }
    .left {
      width: 15%;
      min-height: 450px;
      float: left;
      .leftList {
        width: 100%;
        max-height: 450px;
        overflow: auto;
        .list_ {
          width: 90%;
          min-height: 45px;
          margin: 5px 5%;
          background: #e7e1ea;
          span {
            width: 70%;
            min-height: 45px;
            text-align: center;
            display: inline-block;
            line-height: 45px;
            cursor: pointer;
          }
          i {
            font-size: 30px;
            color: gray;
            position: relative;
            top: 6px;
          }
        }
      }
    }
    .right {
      width: 85%;
      min-height: 300px;
      float: right;
      .chartBox {
        width: 98.2%;
        border: 15px solid rgba(208, 196, 214, 0.5);
        margin-top: 12px;
        margin-left: 12px;
        .list_ {
          width: 210px;
          min-height: 45px;
          margin: 10px;
          background: #e7e1ea;
          display: inline-block;
          span {
            width: 70%;
            min-height: 45px;
            text-align: center;
            display: inline-block;
            line-height: 45px;
            cursor: pointer;
          }
          i {
            font-size: 30px;
            color: gray;
            position: relative;
            top: 6px;
          }
        }
      }
    }
  }
}
</style>




