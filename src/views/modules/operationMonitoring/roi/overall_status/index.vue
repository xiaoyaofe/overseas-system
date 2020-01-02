<template>
  <div>
    <!-- 日期 -->
    <my-row>
      <section class="timeBox">
        <div class="title">选择时间:</div>
        <div class="date-box-item">
          <el-date-picker
            size="medium"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            top="100"
          ></el-date-picker>
        </div>
        <el-button-group style="margin-left:20px">
          <el-button icon="el-icon-search" @click="watchData(1)">日看盘</el-button>
          <el-button icon="el-icon-search" @click="watchData(2)">周看盘</el-button>
          <el-button icon="el-icon-search" @click="watchData(3)">月看盘</el-button>
        </el-button-group>
        <el-button class="el-icon-refresh" @click="getData()" style="margin-left:15px">查询</el-button>
        <el-button class="el-icon-download" @click="exportData()">导出</el-button>
      </section>
    </my-row>
    <p style="color:red;text-indent: 120px;">1、假期期间的ROI数据可在假期后的第二个工作日正常查看 2、选择时间为北京时间（东八区）</p>
    <!-- 折线图 -->
    <section :class="['chart',isZoom ? 'zoomClass':'']">
      <!-- 表头 -->
      <section class="thead">
        <strong>{{$$overall.title}}</strong>
        <section>
          <el-button class="visibleBtn" @click="visibleChart()">
            <i :class="hide?'el-icon-minus':'el-icon-plus'"></i>
          </el-button>
          <el-button class="zoomBtn" @click="zoomChart()">
            <i class="el-icon-zoom-in"></i>
          </el-button>
        </section>
      </section>
      <!-- 表体 -->
      <div class="chart-area" ref="chart" id="container" style="height: 300px"></div>
    </section>
    <!-- 表格 -->
    <div class="table-item">
      <el-table
        border
        :header-cell-style="{background:'#f2f2f2'}"
        :data="$store.getters['o_r_overall/getOverall'].allData"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_overall/getOverall'].allData.length?$store.getters['o_r_overall/getOverall'].allData[0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data() {
    return {
      date: null,
      isZoom: false,
      hide: false,
      in_date_type: 1,
      in_query_type: 3,
    }
  },
  computed: {
    _state() {
      return this.$store.state.o_r_overall;
    },
    $$overall() {
      var data = this.$store.getters["o_r_overall/getOverall"];
      if (data.xList.length) {
        this.$nextTick(() => {
          this.createChart();
        });
      }
      return data
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  watch: {
    date(data) {
      var date = data.map(item => moment(item).format("YYYY-MM-DD"));
      this.$store.commit("o_r_overall/setDate", date);
    },
    isQueryData(v,ov){
      if (v != ov) {
        this.getData()
      }
    },
  },
  created() {
    this.dataInit()
    this.getData();
  },
  methods: {
    // 导出
    exportData() {
      var timestamp = Date.now()
      var thead = document.querySelector('.el-table__header thead').innerHTML
      var tbody = document.querySelector('.el-table__body tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        timestamp + '.xls'
      )
    },
    // 初始化
    dataInit() {
      this.date = this._state.date;
    },
    // 看盘
    watchData(index) {
      console.log('index', index)
      const time = new Date();
      const weekOne = time.setDate(time.getDate() - time.getDay() + 1)
      this.in_date_type = index;
      if (index == 1) {
        this.date = [moment().add(-7, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")];
      } else if (index == 2) {
        this.date = [moment(weekOne).add(-7, "week").format("YYYY-MM-DD"), moment(weekOne).add(-1, "week").format("YYYY-MM-DD")];
      } else if (index == 3) {
        this.date = [moment(time).add(-7, "month").format("YYYY-MM") + "-01", moment(time).add(-1, "month").format("YYYY-MM") + "-01"];
      }
      var params = {
        in_begin_date: this.date[0],   //开始日期
        in_end_date: this.date[1],    //结束日期
        in_app_id: this.$store.state['common'].nowgame,       //游戏ID                  
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],   //区服ID 
        in_date_type: this.in_date_type,      //日期类型
        in_query_type: this.in_query_type,    //查询类型              
      }
      this.$store.dispatch("o_r_overall/getReportInfo", { params, tag: 'overall' })

    },
    //查询数据
    getData() {
      var params = {
        in_begin_date: this._state.date[0],   //开始日期
        in_end_date: this._state.date[1],    //结束日期
        in_app_id:this.$store.state['common'].nowgame,            //游戏ID
        in_gamezone_id:this.$store.getters['Agent/selectedIdList'],       //区服ID        
        in_date_type: this.in_date_type,      //日期类型
        in_query_type: this.in_query_type,    //查询类型      
      }
      this.$store.dispatch("o_r_overall/getReportInfo", { params, tag: 'overall' })
    },
    //缩放图表
    zoomChart() {
      this.isZoom = !this.isZoom
    },
    //收缩图表
    visibleChart() {
      if (this.isZoom) {
        Utils.Notification.warning({
          message: '当前图表为放大状态,无法收缩'
        })
        return
      }
      this.hide = !this.hide;
      if (parseInt($("#container").css('height'))) {
        $("#container").animate({ height: "0px" })

      } else {
        $("#container").animate({ height: "300px" })
      }
    },
    //创建图表
    createChart() {
      var chart = Highcharts.chart('container', {
        chart: {
          type: 'spline',
        },
        colors: ['#7cb5ec', '#C106EB', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'], 
        legend: {
          align: 'center', //水平方向位置
          // layout: 'vertical',
          verticalAlign: 'top', //垂直方向位置
          x: 0, //距离x轴的距离
          y: 20 //距离Y轴的距离
        },
        title: {
          text: '',
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: this.$$overall.xList,
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
            format: '{value:.0f}'//设置y轴显示格式
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
            // 隐藏拐点
            marker: {
              enabled: false
            },
            events: {
              // legendItemClick: function () {
              //   // return false 即可禁止图例点击响应
              //   return false;
              // }
            }
          }
        },
        credits: {
          enabled: false　　　　　　//去除highcharts的链接
        },
        series: this.$$overall.lineData,
        navigation: {
          buttonOptions: {
            enabled: true
          }
        }

      });
    },
  }

}
</script>
<style lang="scss" scoped>
.timeBox {
  height: 40px;
  margin: 12px 0px;
  margin-left: 20px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  .title {
    height: 40px;
    line-height: 40px;
    min-width: 100px;
    display: inline-block;
  }
}
.table-item {
  margin: 20px 10px;
  border: 15px solid #e7e1ea;
}
.activeWatch {
  background: #5b5691;
  color: #ffffff;
}
// 激活表
.chart {
  margin: 20px 10px;
  border: 15px solid #e7e1ea;
  .thead {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    -webkit-box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    strong {
      height: 35px;
      display: inline-block;
      line-height: 35px;
      padding: 0;
      margin: 0;
      text-align: left;
      font-weight: 400 !important;
      font-size: 13px;
      color: gray;
      padding-left: 15px;
    }
    section {
      .zoomBtn,
      .visibleBtn {
        height: 30px;
        font-size: 12px;
        padding: 0 10px;
        margin-top: 5px;
      }
      .zoomBtn {
        margin-right: 15px;
      }
    }
  }
}
// 缩放样式
.zoomClass {
  width: 100%;
  height: 100%;
  margin: 0px 0px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  background: white;
}
</style>

