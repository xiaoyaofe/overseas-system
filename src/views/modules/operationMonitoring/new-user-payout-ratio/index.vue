<template>
  <section id="new-server-monitor">
    <div class="content-header">
      <moduleHeader :header="header" :isShowReg="true" :dateList="dateList"></moduleHeader>
    </div>
    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">图表数据</div>
        </div>
        <div slot="body">
          <div id="hourChart"></div>
        </div>
      </card>
      <card>
        <div slot="header">
          <div class="card-header-title">{{$t('common.DataDetails')}}</div>
          <div class="export-link">
            <a href="javascript:void(0)" @click="exportData"><i class="icon-download"></i>导出数据</a>
          </div>
        </div>
        <div slot="body">
          <div class="table-content">
            <normalTable :tableData="detailData"></normalTable>
          </div>
        </div>
      </card>
    </div>
  </section>
</template>

<script>
import moduleHeader from 'src/views/modules/module-header'
import card from 'src/components/card.vue'
import api from 'src/services/api'
import normalTable from 'src/components/table/element-table.vue'
export default {
  name: 'new-server-monitor',
  components: {
    card, moduleHeader, normalTable
  },
  computed: {
    dateList() {
      return [
        {
          single: false,
          uid: 'date1',
          label: this.$t('common.Date'),
          startDate: this.date1[0],
          endDate: this.date1[1],
          change: (newDate) => { this.date1[0] = newDate.startDate; this.date1[1] = newDate.endDate; this.query() }
        }]
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  data() {
    return {
      header: {
        title: '新服监测',
        definedContent: '',
        isShowIndex: false,
      },
      date1: [moment().add(-7, 'day').format('YYYY-MM-DD'), moment().add(-1, 'day').format('YYYY-MM-DD')],
      tableData: [],
			detailData: [],

    }
  },
  mounted() {
    this.query();
  },
  watch: {
		isQueryData(v,ov){
      if (v != ov) {
        this.query()
      }
    },
	},
  methods: {
    query() {
      var params = {
        in_begin_date: this.date1[0],
        in_end_date: this.date1[1],
        in_app_id: this.$store.state['common'].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          this.detailData = data.state[0]
					this.tableData = [...data.state[0]].reverse()
          var xAxis = [];
          var chartData = [];
          // 获取data
          Object.keys(this.tableData[0]).forEach((key, index) => {
            switch (index) {
              case 1:
                chartData.push({ name: '1日注收比', data: [] })
                break;
              case 4:
                chartData.push({ name: '7日注收比', data: [] })
                break;
              case 6:
                chartData.push({ name: '30日注收比', data: [] })
                break;
              default:
                break;
            }
          })
          // 获取x轴横坐标
          for (let index = 0; index < this.tableData.length; index++) {
            Object.keys(this.tableData[index]).forEach((key, msg) => {
              switch (msg) {
                case 0:
                  xAxis.push(this.tableData[index][key])
                  break;
                case 1:
                  chartData[0].data.push(+this.tableData[index][key])
                  break;
                case 4:
                  chartData[1].data.push(+this.tableData[index][key])
                  break;
                case 6:
                  chartData[2].data.push(+this.tableData[index][key])
                  break;
                default:
                  break;
              }
            })
          }
          this.drawChart(xAxis, chartData)
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    drawChart(xAxis, data) {
      var chart = Highcharts.chart('hourChart', {
        chart: {
          type: 'spline',
        },
				colors:"#f7a35c,#7cb5ec,#f15c80,#90ed7d,#8085e9,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
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
          categories: xAxis,
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
            // 
            formatter: function (index) {
              // if (+localStorage.getItem("percent")>=3) {
              //   return this.value + '%';//y轴加上%
              // }else{
              return this.value
              // }
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
        series: data,
        navigation: {
          buttonOptions: {
            enabled: true
          }
        }
      });
    },
    exportData() {
      var params = {
        in_begin_date: this.date1[0],
        in_end_date: this.date1[1],
        in_app_id: this.$store.state['common'].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
      }
      api.user.exportData(params)
    },
  }
}

</script>

<style lang="scss" scoped>
.table-content {
  overflow: auto;
  width: 100%;
  max-height: 500px;
  white-space: nowrap;
}
</style>