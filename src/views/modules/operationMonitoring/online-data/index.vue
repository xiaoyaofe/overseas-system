<template>
	<section id="ss-data">
		<div class="content-header">
			<moduleHeader :isShowReg="true" v-on:datetypeChange='selsectView'  :dateList="dateList"></moduleHeader>
		</div>
		<div class="content-body">
			<card v-if="0">
				<div slot="header">{{$t('common.IndexKey')}}</div>
			</card>
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
						<normalTable :tableData="tableData"></normalTable>
					</div>
				</div>

			</card>
		</div>
		<div class="online-time">
			<i class="icon-time"></i>
			<span class="time-text">当前时间:{{nowTime}}</span>
		</div>
	</section>
</template>

<script>
import moduleHeader from 'modules/module-header.vue'
import trigger from 'modules/channel/register/components/trigger'
import card from 'src/components/card.vue'
import api from 'src/services/api'
import normalTable from 'src/components/table/element-table.vue'
export default {
	name: 'online-data',
	components: {
		card, moduleHeader, trigger, normalTable
	},
	data() {
		return {
			date1: [moment().add(-7, 'day').format('YYYY-MM-DD'),moment().add(-1, 'day').format('YYYY-MM-DD')],
			nowTime: '',
			type: 1,
			in_date_type:'day',
			payMoneyData: [],
			payCountData: [],
			regCountData: [],
			roleCountData: [],
			payARPUData: [],
			detailData: [],
			tableData:[],
			columnData: [],//表格列名数组
		}
	},
	computed: {
		isQueryData(){
			return this.$store.state.common.isQueryData
		},
		dateList() {
			return [
				{
					single: false,
					uid: 'date1',
					label: this.$t('common.Date'),
					startDate: this.date1[0],
					isShowDatetype:1,
					endDate: this.date1[1],
					change: (newDate) => { this.date1[0] = newDate.startDate;this.date1[1] = newDate.endDate;this.query() }
				}]
		}
	},
	mounted() {
		window.timeInterval = setInterval(() => { this.getDateTime() }, 1000)
		this.getDateTime()
		this.query();
	},
	beforeDestroy() {
		clearInterval(window.timeInterval);
	},
	methods: {
		selsectView(newValue){
			switch (newValue) {
				case 1:
					this.in_date_type = 'day';
					this.date1 = [moment().add(-7, "day").format("YYYY-MM-DD"), moment().add(-1, "day").format("YYYY-MM-DD")];
					break;
				case 2:
					this.in_date_type = 'week';
					this.date1 = [moment().subtract(7, 'isoWeek').startOf('isoWeek').format("YYYY-MM-DD"), moment().subtract(0, 'isoWeek').startOf('isoWeek').format("YYYY-MM-DD")];
					break;
				case 3:
					this.in_date_type = 'month';
					this.date1 = [moment().subtract(7, 'months').startOf('month').format('YYYY-MM-DD'), moment().subtract(0, 'months').startOf('month').format('YYYY-MM-DD')];

					break;	
				default:
					break;
			}
			this.query()
		},
		getDateTime() {
			this.nowTime = moment().format("HH:mm:ss")
		},
		query() {
			var params = {
				in_begin_date: this.date1[0],
				in_end_date: this.date1[1],
				in_app_id:this.$store.state['common'].nowgame,
				dataview: this.$store.state.common.nowmenu.dataView[0],
				in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
				in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
				in_date_type: this.in_date_type
			}
			api.user.getQuery(params).then((data)=>{
				if (data.code == 401) {
					this.tableData = data.state[0]
					this.detailData = [...data.state[0]].reverse()
					var xAxis = [];
					var chartData = [];
					// 获取data
					Object.keys(this.detailData[0]).forEach((key,index)=>{
						if (index > 0) {
							chartData.push({name:key,data:[]})
						}
					})
					// 获取x轴横坐标
					for (let index = 0; index < this.detailData.length; index++) {
						Object.keys(this.detailData[index]).forEach((key,msg)=>{
						switch (msg) {
							case 0:
							xAxis.push(this.detailData[index][key])
							break;
							case 1:
							chartData[0].data.push(+this.detailData[index][key])
							break;
							case 2:
							chartData[1].data.push(+this.detailData[index][key])
							break;
							case 3:
							chartData[2].data.push(+this.detailData[index][key])
							break;
							case 4:
							chartData[3].data.push(+this.detailData[index][key])
							break;
							case 5:
							chartData[4].data.push(+this.detailData[index][key])
							break;
							case 6:
							chartData[5].data.push(+this.detailData[index][key])
							break;
							case 7:
							chartData[6].data.push(+this.detailData[index][key])
							break;
							case 8:
							chartData[7].data.push(+this.detailData[index][key])
							break;
							default:
							break;
						}
						})
					}  
					this.drawChart(xAxis,chartData)
				}
				else {
					Utils.Notification.error({ message: data.message });
					console.error(data.message);
				}

			})

		},
		exportData() {
      var params = {
				in_begin_date: this.date1[0],
				in_end_date: this.date1[1],
				in_app_id:this.$store.state['common'].nowgame,
				dataview: this.$store.state.common.nowmenu.dataView[0],
				in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
				in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
				in_date_type: this.in_date_type,
			}
      api.user.exportData(params)
    },
		drawChart(xAxis,data) {
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
			}
	},
	watch: {
		isQueryData(v,ov){
		if (v != ov) {
			this.query()
		}
		},
		type(v, ov) {
			if (v != ov) {
				if (v == 1) {
					this.getPayMoney()//获取付费金额
				}
				else if (v == 2) {
					this.getPayCount()//获取付费用户数
				}
				else if (v == 3) {
					this.getRegCount()//获取注册用户数
				}
				else if (v == 4) {
					this.getRoleCount()//获取创角用户数
				}
				else if (v == 5) {
					this.getPayARPU()//获取付费ARPU
				}
			}
		}
	}
}
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