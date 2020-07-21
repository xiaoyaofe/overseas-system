<template>
  <section id="ss-data">
    <div class="content-header">
      <moduleHeader v-on:datetypeChange="selsectView" :dateList="dateList"></moduleHeader>
    </div>
    <div class="content-body">
      <card v-if="0">
        <div slot="header">{{$t('common.IndexKey')}}</div>
      </card>
      <card>
        <div slot="header">
          <div class="card-header-title">图表数据</div>
          <div class="export-link">
            <!-- <div style="margin-top: 20px"> -->

            <!-- </div> -->
          </div>
        </div>
        <div slot="body" v-show="detailData.length">
          <el-radio-group v-model="isVisible_all_index" size="medium">
            <el-radio-button label="显示"></el-radio-button>
            <el-radio-button label="隐藏"></el-radio-button>
          </el-radio-group>
          <div id="hourChart" style="height:510px"></div>
          <el-radio-group v-model="isVisible_all_index2" size="medium">
            <el-radio-button label="显示"></el-radio-button>
            <el-radio-button label="隐藏"></el-radio-button>
          </el-radio-group>
          <div id="hourChart2" style="height:510px"></div>
        </div>
        <div slot="body" v-show="!detailData.length">数据为空</div>
      </card>
      <card>
        <div slot="header">
          <div class="card-header-title">{{$t('common.DataDetails')}}</div>
          <div class="export-link">
            <a href="javascript:void(0)" @click="exportData">
              <i class="icon-download"></i>导出数据
            </a>
          </div>
        </div>
        <div slot="body">
          <div class="table-content">
            <normalTable :tableData="tableData"></normalTable>
          </div>
        </div>
      </card>
    </div>
    <!-- <div class="online-time">
      <i class="icon-time"></i>
      <span class="time-text">当前时间:{{nowTime}}</span>
    </div>-->
  </section>
</template>

<script>
import moduleHeader from "modules/module-header.vue";
import trigger from "modules/channel/register/components/trigger";
import card from "src/components/card.vue";
import api from "src/services/api";
import normalTable from "src/components/table/element-table.vue";
export default {
  name: "online-data",
  components: {
    card,
    moduleHeader,
    trigger,
    normalTable
  },
  data() {
    return {
      date1: [
        moment()
          .add(-7, "day")
          .format("YYYY-MM-DD"),
        moment()
          .add(-1, "day")
          .format("YYYY-MM-DD")
      ],
      isLoading: false,
      nowTime: "",
      type: 1,
      in_date_type: "day",
      isVisible_all_index: "显示",
      isVisible_all_index2: "显示",
      detailData: [],
      tableData: [],
      pillar_diagram_xAxis: [],
      pay_pillar_diagram_hide: [],
      pay_pillar_diagram_show: []
    };
  },
  computed: {
    isQueryData() {
      return this.$store.state.common.isQueryData;
    },
    dateList() {
      return [
        {
          single: false,
          uid: "date1",
          label: this.$t("common.Date"),
          startDate: this.date1[0],
          isShowDatetype: 1,
          endDate: this.date1[1],
          change: newDate => {
            this.date1[0] = newDate.startDate;
            this.date1[1] = newDate.endDate;
            this.query();
          }
        }
      ];
    }
  },
  mounted() {
    window.timeInterval = setInterval(() => {
      this.getDateTime();
    }, 1000);
    this.getDateTime();
    this.query();
  },
  beforeDestroy() {
    clearInterval(window.timeInterval);
  },
  methods: {
    selsectView(newValue) {
      switch (newValue) {
        case 1:
          this.in_date_type = "day";
          this.date1 = [
            moment()
              .add(-7, "day")
              .format("YYYY-MM-DD"),
            moment()
              .add(-1, "day")
              .format("YYYY-MM-DD")
          ];
          break;
        case 2:
          this.in_date_type = "week";
          this.date1 = [
            moment()
              .subtract(7, "isoWeek")
              .startOf("isoWeek")
              .format("YYYY-MM-DD"),
            moment()
              .subtract(0, "isoWeek")
              .startOf("isoWeek")
              .format("YYYY-MM-DD")
          ];
          break;
        case 3:
          this.in_date_type = "month";
          this.date1 = [
            moment()
              .subtract(7, "months")
              .startOf("month")
              .format("YYYY-MM-DD"),
            moment()
              .subtract(0, "months")
              .startOf("month")
              .format("YYYY-MM-DD")
          ];

          break;
        default:
          break;
      }
      this.query();
    },
    getDateTime() {
      this.nowTime = moment().format("HH:mm:ss");
    },
    query() {
      var params = {
        in_begin_date: this.date1[0],
        in_end_date: this.date1[1],
        in_app_id: this.$store.state["common"].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_date_type: this.in_date_type
      };
      api.user.getQuery(params).then(data => {
        if (data.code == 401) {
          this.detailData = [...data.state[0]].reverse();
          var xAxis = [];
          var pay_chartData_show_All = [];
          var pay_chartData_hide_All = [];
          var channel_chartData = [];
          var payment_method = [];
          var channel_name = [];
          var channel_name_bak = [];
          var table_data = [];
          // 获取x轴横坐标
          for (let index = 0; index < this.detailData.length; index++) {
            Object.keys(this.detailData[index]).forEach((key, msg) => {
              switch (msg) {
                case 0: //日期
                  xAxis.push(this.detailData[index][key]);
                  break;
                case 2: //渠道名
                  channel_name.push(this.detailData[index][key]);
                  channel_name_bak.push(
                    this.detailData[index][key].toLowerCase()
                  );
                  break;
                case 3: //支付方式
                  payment_method.push(this.detailData[index][key]);
                  break;
                default:
                  break;
              }
            });
          }
          var filter_xAxis = [...new Set(xAxis)];
          // 渠道名chartData格式化
          var filter_channel_name = [channel_name[0]];
          for (let i = 1; i < channel_name.length; i++) {
            let flag = true;
            for (let j = 0; j < filter_channel_name.length; j++) {
              if (
                channel_name[i].toLowerCase() ===
                filter_channel_name[j].toLowerCase()
              ) {
                flag = false;
                break;
              }
            }
            if (flag) {
              filter_channel_name.push(channel_name[i]);
            }
          }
          filter_channel_name.map((todo, index) => {
            channel_chartData.push({ name: todo, data: [] });
          });
          var filter_payment_method = [...new Set(payment_method)];
          filter_payment_method.map((todo, index) => {
            pay_chartData_show_All.push({
              name: todo,
              data: [],
              visible: true
            });
            pay_chartData_hide_All.push({
              name: todo,
              data: [],
              visible: false
            });
          });
          filter_xAxis.map((todo, index) => {
            let filter_date = this.detailData.filter(
              msg => msg["日期"] === todo
            );
            // 充值方式chartData格式化
            filter_payment_method.map((flag, i) => {
              let filter_date_pay = filter_date.filter(
                item => item["支付方式"] == flag
              );
              var pay_number_sum = filter_date_pay.reduce(
                (accumulator, currentValue) => {
                  return accumulator + currentValue["充值笔数"];
                },
                0
              );
              var pay_money_sum = filter_date_pay.reduce(
                (accumulator, currentValue) => {
                  return accumulator + +currentValue["充值金额"];
                },
                0
              );
              pay_chartData_show_All[i].data.push({
                money: pay_money_sum.toFixed(2),
                y: pay_number_sum,
                dataLabels: {
                  style: {
                    opacity: +pay_money_sum.toFixed(2) ? 1 : 0
                  }
                }
              });
              pay_chartData_hide_All[i].data.push({
                money: pay_money_sum.toFixed(2),
                y: pay_number_sum
              });
            });
            // 充值渠道chartData格式化
            filter_channel_name.map((flag, i) => {
              let filter_date_pay = filter_date.filter(
                item => item["渠道名"].toLowerCase() == flag.toLowerCase()
              );
              var pay_number_sum = filter_date_pay.reduce(
                (accumulator, currentValue) => {
                  return accumulator + currentValue["充值笔数"];
                },
                0
              );
              var pay_money_sum = filter_date_pay.reduce(
                (accumulator, currentValue) => {
                  return accumulator + +currentValue["充值金额"];
                },
                0
              );
              channel_chartData[i].data.push({
                money: pay_money_sum.toFixed(2),
                y: pay_number_sum
              });
            });
          });
          this.pillar_diagram_xAxis = [...new Set(xAxis)];
          this.pay_pillar_diagram_show = pay_chartData_show_All;
          this.pay_pillar_diagram_hide = pay_chartData_hide_All;
          this.drawChart(
            "hourChart",
            [...new Set(xAxis)],
            pay_chartData_show_All,
            "支付方式堆叠柱状图",
            "充值笔数"
          );
          this.drawChart(
            "hourChart2",
            [...new Set(xAxis)],
            channel_chartData,
            "充值渠道堆叠柱状图",
            "充值笔数"
          );
          // 表格数据格式化
          filter_channel_name.map((todo, index) => {
            let filter_channel_table = data.state[0].filter(
              flag => flag["渠道名"].toLowerCase() == todo.toLowerCase()
            );
            filter_xAxis.map((flag, i) => {
              let filter_date_pay = filter_channel_table.filter(
                item => item["日期"] == flag
              );
              if (filter_date_pay.length) {
                var pay_number_sum = filter_date_pay.reduce(
                  (accumulator, currentValue) => {
                    return accumulator + currentValue["充值笔数"];
                  },
                  0
                );
                var pay_money_sum = filter_date_pay.reduce(
                  (accumulator, currentValue) => {
                    return accumulator + +currentValue["充值金额"];
                  },
                  0
                );
                table_data.push({
                  日期: flag,
                  渠道名: todo,
                  充值笔数: pay_number_sum,
                  充值金额: pay_money_sum.toFixed(2)
                });
              }
            });
          });
          // table 按日期排序
          this.tableData = table_data.sort(function(a, b) {
            return (
              Date.parse(b["日期"].replace(/-/g, "/")) -
              Date.parse(a["日期"].replace(/-/g, "/"))
            );
          });
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      });
    },
    // 导出数据
    exportData() {
      var params = {
        in_begin_date: this.date1[0],
        in_end_date: this.date1[1],
        in_app_id: this.$store.state["common"].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_gamezone_id: this.$store.getters["Agent/selectedIdList"],
        in_channel_id: this.$store.getters["RegChannel/selected3IdList"],
        in_date_type: this.in_date_type
      };
      api.user.exportData(params);
    },
    // 绘制图表
    drawChart(id, xAxis, data, title, yTitle) {
      window[id] = Highcharts.chart(id, {
        chart: {
          type: "column"
        },
        title: {
          text: title,
          floating: true
        },
        // 图标色块数组
        colors: [
          "#CB4335",
          "#E74C3C",
          "#EC7063",
          "#F1948A",
          "#F5B7B1",
          "#884EA0",
          "#9B59B6",
          "#AF7AC5",
          "#C39BD3",
          "#D7BDE2",
          "#0D41E1",
          "#0C63E7",
          "#0A85ED",
          "#09A6F3",
          "#07C8F9",
          "#D68910",
          "#F39C12",
          "#F5B041",
          "#F8C471",
          "#FAD7A0",
          "#17A589",
          "#1ABC9C",
          "#48C9B0",
          "#76D7C4",
          "#A3E4D7",
          "#839192",
          "#95A5A6",
          "#AAB7B8",
          "#BFC9CA",
          "#D5DBDB",
          "#F90A0A",
          "#F83838",
          "#F66666",
          "#F59594",
          "#F3C3C2",
          "#215600",
          "#4F7734",
          "#7D9867",
          "#ABB99B",
          "#D9DACE"
        ],
        legend: {
          align: "center",
          x: 0,
          verticalAlign: "top",
          y: 25,
          floating: false,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false
        },
        xAxis: {
          categories: xAxis,
          crosshair: {
            width: 1,
            color: "#747474"
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: yTitle
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color:
                // theme
                (Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color) ||
                "gray"
            }
          }
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat:
            "{series.name}: {point.y}<br/>money: {point.money}<br/>Total: {point.stackTotal}"
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
              color:
                (Highcharts.theme && Highcharts.theme.dataLabelsColor) ||
                "white",
              style: {
                // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
                textOutline: "1px 1px black"
              }
            }
          }
        },
        credits: {
          enabled: false //去除highcharts的链接
        },
        series: data,
        navigation: {
          buttonOptions: {
            enabled: true
          }
        }
      });
    }
  },
  watch: {
    isVisible_all_index(v, ov) {
      if (v === "隐藏") {
        this.drawChart(
          "hourChart",
          this.pillar_diagram_xAxis,
          this.pay_pillar_diagram_hide,
          "支付方式堆叠柱状图",
          "充值笔数"
        )
      } else {
        this.drawChart(
          "hourChart",
          this.pillar_diagram_xAxis,
          this.pay_pillar_diagram_show,
          "支付方式堆叠柱状图",
          "充值笔数"
        );
      }
    },
    isVisible_all_index2(v, ov) {
      if (v === "隐藏") {
        window.hourChart2.series.map((item, index, data) => {
          var series = window.hourChart2.series[index];
          series.hide();
        });
      } else {
        window.hourChart2.series.map((item, index, data) => {
          var series = window.hourChart2.series[index];
          series.show();
        });
      }
    },
    isQueryData(v, ov) {
      if (v != ov) {
        this.query();
      }
    },
    type(v, ov) {
      if (v != ov) {
        if (v == 1) {
          this.getPayMoney(); //获取付费金额
        } else if (v == 2) {
          this.getPayCount(); //获取付费用户数
        } else if (v == 3) {
          this.getRegCount(); //获取注册用户数
        } else if (v == 4) {
          this.getRoleCount(); //获取创角用户数
        } else if (v == 5) {
          this.getPayARPU(); //获取付费ARPU
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.key-index-group {
  display: -webkit-box;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  line-height: 40px;
  .key-index-item {
    -webkit-box-flex: 1;
    border-right: 1px solid #bbb;
    text-align: center;
    .item-top {
    }
    .item-middle {
      font-weight: bold;
      vertical-align: middle;
      .item-add-rate {
        font-size: 12px;
        font-weight: 200;
        color: red;
        vertical-align: super;
      }
    }
    .item-bottom {
    }
  }
  .key-index-item:last-child {
    border: 0;
  }
}
.online-time {
  position: fixed;
  right: 0;
  top: 30%;
  padding: 5px 10px;
  line-height: 30px;
  background-color: #00a65a;
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
  .time-text {
    display: none;
  }
  &:hover {
    .time-text {
      display: inline-block;
    }
  }
}
.table-content {
  overflow: auto;
  width: 100%;
  max-height: 500px;
  white-space: nowrap;
}
</style>