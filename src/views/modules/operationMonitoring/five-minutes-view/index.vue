<template>
  <section id="five-minutes-view">
    <!-- 基准时间 -->
    <div class="content-header">
      <moduleHeader :isShowReg="config[systemId].isShowRegChannel" :isShowPay="config[systemId].isShowPayChannel" :dateList="dateList"></moduleHeader>
    </div>
    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">{{type?type.name:''}}({{$t('fiveMin.delay10min')}})</div>
          <div class="tabs">
            <div class="tab-item" v-for="(item,index) in config[systemId].list" :key="index" :class="{'active':type&&item.id==type.id}" @click="type=item">{{item.name}}</div>
          </div>
        </div>
        <!-- 折线图 -->
        <div slot="body">
          <div id="fiveMinChart" class="charts"></div>
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
          <!-- table -->
          <div class="table-content">
            <normalTable :tableData="tableData"></normalTable>
          </div>
        </div>
      </card>
    </div>
  </section>
</template>

<script>
import moduleHeader from 'src/views/modules/module-header'
import card from 'src/components/card.vue'
import normalTable from 'src/components/table/element-table.vue'
import api from 'src/services/api'
import { log } from 'util';
export default {
  name: 'five-minutes-view',
  components: {
    moduleHeader,
    normalTable,
    card
  },
  data() {
    return {
      date1: moment().format('YYYY-MM-DD'),
      date2: moment()
        .add(-1, 'day')
        .format('YYYY-MM-DD'),
      date3: moment()
        .add(-7, 'day')
        .format('YYYY-MM-DD'),
      type: null,
      tableData: [],
      config: {
        1: {
          isShowRegChannel: true,
          isShowPayChannel: true,
          list: [
            {
              id: 1,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Online')
            }, //'五分钟在线',
            {
              id: 2,
              name:
                this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Charge') + '(USD)'
            }, //'五分钟充值'
            {
              id: 3,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Register')
            }, //'五分钟注册'
            {
              id: 4,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Active')
            }, //'五分钟活跃'
            {
              id: 5,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.CreateRole')
            }, //'五分钟活跃'
            {
              id: 6,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.PayCount')
            }
          ] //'五分钟付费人数'
        },
        2: {
          isShowRegChannel: true,
          isShowPayChannel: false,
          list: [
            {
              id: 1,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Register')
            }, //'五分钟注册'
            {
              id: 2,
              name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Charge')
            }, //'五分钟充值'
            // {
            //   id: 1,
            //   name: this.$t('fiveMin.fiveMin') + this.$t('fiveMin.Online')
            // } //'五分钟在线',
          ]
        },
        3: {
          isShowRegChannel: true,
          isShowPayChannel: true
        },
        4: {
          isShowRegChannel: true,
          isShowPayChannel: true
        },
         5: {
          isShowRegChannel: true,
          isShowPayChannel: true
        }
      }
    }
  },
  computed: {
    dateList() {
      return [
        {
          single: true,
          uid: 'date1',
          label: this.$t('common.BaseTime'), //'基准时间',
          startDate: this.date1,
          endDate: '',
          change: newDate => {
            this.date1 = newDate.startDate
            this.query()
          }
        },
        {
          single: true,
          uid: 'date2',
          label: this.$t('common.CompareTime'), //'对比时间',
          startDate: this.date2,
          endDate: '',
          change: newDate => {
            this.date2 = newDate.startDate
            this.query()
          }
        },
        {
          single: true,
          uid: 'date3',
          label: this.$t('common.CompareTime'), //'对比时间',
          startDate: this.date3,
          endDate: '',
          change: newDate => {
            this.date3 = newDate.startDate
            this.query()
          }
        }
      ]
    },
    isCompact() {
      return this.$store.state.layout.isCompact
    },
    systemId() {
      return this.$store.state.common.systems.systemId
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  mounted() {
    this.type = this.config[this.systemId].list[0]
    window.fiveMinInterval = setInterval(() => {
      this.query()
    }, 300000)
    this.query()
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });
  },
  beforeDestroy() {
    clearInterval(window.fiveMinInterval)
  },
  methods: {
    getParams() {
      if (this.systemId == 1) {
        return {
          isCache: 1,
          in_date1: this.date1,
          in_date2: this.date2,
          in_date3: this.date3,
          dataview: this.$store.state.common.nowmenu.dataView,
          in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
          in_reg_channel: this.$store.getters['RegChannel/selectedIdList'],
          in_pay_channel: this.$store.getters['PayChannel/selectedIdList'],
          in_os: this.$store.getters['OS/nowOS'],
          in_type_id: this.type.id
        }
      } else if (this.systemId == 2) {

        return {          
          in_date1: this.date1,
          in_date2: this.date2,
          in_date3: this.date3,
          in_app_id:this.$store.state['common'].nowgame,
          dataview: this.$store.state.common.nowmenu.dataView[0],
          in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
          in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
          in_data_type: this.type.id,
        }
        
      }
    },
    query() {
      this.tableData = []
      var params = this.getParams()
      api.user.getQuery(params).then(data => {
        if (data.code == 401) {
          this.tableData = data.state[0]
          var xAxis = [];
          var chartData = [];
          // 获取data
          Object.keys(this.tableData[0]).forEach((key,index)=>{
            if (index > 0) {
                chartData.push({name:key,data:[]})
            }
          })
          // 获取x轴横坐标
          for (let index = 0; index < this.tableData.length; index++) {
            Object.keys(this.tableData[index]).forEach((key,msg)=>{
              switch (msg) {
                case 0:
                  xAxis.push(this.tableData[index][key])
                  break;
                case 1:
                  chartData[0].data.push(+this.tableData[index][key])
                  break;
                case 2:
                  chartData[1].data.push(+this.tableData[index][key])
                  break;
                case 3:
                  chartData[2].data.push(+this.tableData[index][key])
                  break;
                default:
                  break;
              }
            })
          }
          var arr = chartData.reverse()
          this.drawChart(xAxis,arr)
        } else {
          Utils.Notification.error({
            message: data.message
          })
        }
      })
    },
    exportData() {
      var params = this.getParams()
      api.user.exportData(params)
    },
    drawChart(xAxis,data) {
      var chart = Highcharts.chart('fiveMinChart', {
          chart: {
            type: 'spline',
          },
          colors:"#f7a35c,#7cb5ec,#f15c80,#90ed7d,#8085e9,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
  				// colors: [ '#f15c80', '#7cb5ec', '#90ed7d', '#C106EB', '#f7a35c', '#8085e9', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'], 
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
      // let count_date = utils.getColumnByIndex(0, this.tableData)
      // var dateList = [this.date3, this.date2, this.date1]
      // var categories = []
      // var seriesData = []
      // this.tableData.map(item => {
      //   categories.push(item[count_date])
      // })
      // dateList.forEach(date => {
      //   seriesData.push({
      //     name: date,
      //     data: (() => {
      //       let array = []
      //       this.tableData.map(item => {
      //         array.push(item[date] ? Number(item[date].replace(/,/g, '')) : '')
      //       })
      //       return array
      //     })(),
      //     max: (() => {
      //       let max = '0'
      //       this.tableData.map(item => {
      //         // if(this.type.id==4){
      //         //   max += Number(item[date].replace(/,/g,'')*1)
      //         // }
      //         // else{
      //         if (
      //           Number(max.replace(/,/g, '')) <
      //           Number(item[date].replace(/,/g, ''))
      //         ) {
      //           max = item[date]
      //         }
      //         // }
      //       })
      //       return max
      //     })()
      //   })
      // })
      // window._1 = categories
      // window._2 = seriesData
      // highchartUtil.drawFiveMinLine('fiveMinChart', categories, seriesData)
    }
  },
  watch: {
    isQueryData(v,ov){
      if (v != ov) {
        this.query()
      }
    },
    isCompact(v, ov) {
      if (v != ov) {
        this.query()
      }
    },
    type: {
      deep: true,
      handler(v, ov) {
        if (v != ov && ov) {
          this.query()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-content {
  overflow: auto;
  width: 100%;
}
</style>