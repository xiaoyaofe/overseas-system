<template>
  <section id="new-server-monitor">
    <div class="content-header">
      <moduleHeader :header="header" :isShowReg="true" v-on:datetypeChange='selsectView' :dateList="dateList"></moduleHeader>
    </div>
    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">{{date1}} 数据</div>
        </div>
        <div  class="dataBox" slot="body">
            <section class="dataBox-data" v-for="(item,index) in dataBoxArr" :key="index">
                <p>{{item.name}}</p>
                <p>
                    <span>{{item.data}}</span>
                    <span v-if="item.scale" :class="parseInt(item.scale.replace('%','')*100)>=0?'upData':'downData'">{{item.scale}}
                        <i v-if="parseInt(item.scale.replace('%','')*100)>=0" class="el-icon-arrow-up" />
                        <i v-if="parseInt(item.scale.replace('%','')*100)<0" class="el-icon-arrow-down" />
                    </span>
                </p>
            </section>
            <div :class="['dataBox-line',`dataBox-line${item}`]" v-for="(item,index) in 9" :key="index+'.'"></div>
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
  </section>
</template>

<script>
import moduleHeader from 'src/views/modules/module-header'
import card from 'src/components/card.vue'
import api from 'src/services/api'
import normalTable from 'src/components/table/element-table.vue'
import { log } from 'util';
export default {
  name: 'new-server-monitor',
  components: {
    card, moduleHeader, normalTable
  },
  data() {
    return {
      header: {
        title: '新服监测',
        definedContent: '',
        isShowIndex: false,
      },
      date1: moment().add(-1, 'day').format('YYYY-MM-DD'),
      in_date_type:'day',
      tableData: [],
      dataBoxArr:[{name:"日注册用户数",flag:"注册人数", data:0,scale:'0%'},
                  {name:"登录用户数",flag:'登录人数',data:0,scale:'0%'},
                  {name:"新用户活跃数",flag:'新用户活跃人数',data:0,scale:'0%'},
                  {name:"老用户活跃数",flag:'老用户活跃人数',data:0,scale:'0%'},
                  {name:"活跃用户数",flag:'活跃人数',data:0,scale:'0%'},
                  {name:"付费人数",flag:"付费人数",data:0,scale:'0%'},
                  {name:"活跃付费率",flag:"活跃付费率",data:0,scale:'0%'},
                  {name:"付费金额",flag:"付费金额",data:0,scale:'0%'},
                  {name:"付费ARPU",flag:"付费ARPU",data:0,scale:'0%'},]
    }
  },
  computed: {
    dateList() {
      return [
        {
        single: true,
          uid: 'date1',
          isShowDatetype:1,
          label: this.$t('common.BaseTime'), //'基准时间',
          startDate: this.date1,
          endDate: '',
          change: newDate => {
            this.date1 = newDate.startDate
            this.query()
          }
        }]
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  watch: {
    //切换游戏
    isQueryData(v,ov){
      if (v != ov) {
        this.query()
      }
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    selsectView(newValue){
        switch (newValue) {
            case 1:
                this.in_date_type = 'day';
                this.date1 = moment().add(-1, "day").format("YYYY-MM-DD");
                break;
            case 2:
                this.in_date_type = 'week';
                this.date1 = moment().subtract(1, 'isoWeek').startOf('isoWeek').format("YYYY-MM-DD");
                break;
            case 3:
                this.in_date_type = 'month';
                this.date1 = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                break;	
            default:
                break;
        }
        this.query()
    },
    query() {
      var params = {
        in_count_date: this.date1,
        in_app_id: this.$store.state['common'].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
        in_date_type:this.in_date_type,
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          this.tableData = data.state[0]
          var dataKey = null;
          // 获取data
          Object.keys(this.tableData[0]).forEach((key, index) => {
              if (index == Object.keys(this.tableData[0]).length-2) {
                dataKey = key
              }
          })
          // 获取当前日期数据
          for (let index = 0; index < this.tableData.length; index++) {
            Object.keys(this.tableData[index]).forEach((key, msg) => {
                if (dataKey == key) {
                    // console.log(key,this.tableData[index][key],this.tableData[index]['指标']);
                    for (let flag = 0; flag < this.dataBoxArr.length; flag++) {
                        if (this.tableData[index]['指标'] === this.dataBoxArr[flag].flag) {
                            this.dataBoxArr[flag].data = this.tableData[index][dataKey];
                            this.dataBoxArr[flag].scale = this.tableData[index]['趋势'];
                            // console.log(this.dataBoxArr[flag]);
                        }
                    }
                }
            })
          }
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    exportData() {
     var params = {
        in_count_date: this.date1,
        in_app_id: this.$store.state['common'].nowgame,
        dataview: this.$store.state.common.nowmenu.dataView[0],
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
        in_date_type:this.in_date_type,
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
.dataBox{
    width: 90%;
    min-width: 1024px;
    height: 450px;
    margin: auto;
    position: relative;
    .dataBox-line{
        width: 15%;
        height: 10px;
        background: -webkit-gradient(linear, 0 0, 100% 0, from(#e1f0f9), to(#2ab664));
        position: absolute;
    }
    .dataBox-line:after{
        content: '';
        font-size: 0px;
        line-height: 0%;
        width: 0px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #2ab664;
        border-right: none;
        position: absolute;
        top: -5px;
        left: 100%;
    }
    .dataBox-line1{
        width: 10%;
        top: 7.5%;
        left: 17%;
    }
    .dataBox-line2{
        width: 10%;
        top: 24.5%;
        left: 17%;
    }
    .dataBox-line3{
        width: 10%;
        top: 12%;
        left: 43%
    }
    .dataBox-line4{
        width: 10%;
        top: 20%;
        left: 43%;
    }
    .dataBox-line5{
        width: 20%;
        top: 15%;
        left: 69%;
        background: #d5ebf4;
    }
    .dataBox-line5:after{
        content: none;
    }
    .dataBox-line6{
        width: 10px;
        height: 32%;
        top: 15%;
        left: 89%;
        border-top-right-radius: 15px;
        background: -webkit-gradient(linear, 0 0, 100% 100%, from(#e1f0f9), to(#2ab664));
    }
    .dataBox-line6:after{
        content: '.';
        font-size: 0px;
        line-height: 0%;
        width: 0px;
        border-top: 10px solid #2ab664;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        position: absolute;
        top: 100%;
        left: -5px;
    }
    .dataBox-line7{
        width: 10px;
        height: 5%;
        top: 67%;
        left: 89%;
        background: -webkit-gradient(linear, 0 0, 100% 100%, from(#e1f0f9), to(#f79646));
    }
    .dataBox-line7:after{
        content: '.';
        font-size: 0px;
        line-height: 0%;
        width: 0px;
        border-top: 10px solid #f79646;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        position: absolute;
        top: 100%;
        left: -5px;
    }
    .dataBox-line8{
        width: 64%;
        top: 56%;
        left: 17%;
    }
    .dataBox-line9{
        width: 64%;
        top: 82%;
        left: 17%;
        background: -webkit-gradient(linear, 0 0, 100% 100%, from(#e1f0f9), to(#f79646));
    }
    .dataBox-line9:after{
        content: '';
        font-size: 0px;
        line-height: 0%;
        width: 0px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #f79646;
        border-right: none;
        position: absolute;
        top: -5px;
        left: 100%;

    }
    
    .dataBox-data{
        width: 15%;
        height: 76px;
        padding: 10px;
        border: 1px solid #71b5d9;
        border-radius: 15px;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#e2f9f6), to(#bcdcff));
        text-align: center;
        position: absolute;
        top:  0%;
        left:  2%;
        p{
            width: 100%;
            span{
              padding: 0 5%;
                // width: 48%;
                // display: inline-block;
            }
        }
        p:nth-child(2){
            margin: 0;
        }
    }
    .dataBox-data:nth-child(2){
        top: 18%;
        left: 2%;
    }
    .dataBox-data:nth-child(3){
        top:  0%;
        left: 28%;
        border: 1px solid #16b09c;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#e2f9f6), to(#bfe3df));
    }
    .dataBox-data:nth-child(4){
        top: 18%;
        left: 28%;
        border: 1px solid #16b09c;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#e2f9f6), to(#bfe3df));
    }
    .dataBox-data:nth-child(5){
        top: 8.5%;
        left: 54%;
        border: 1px solid #16b09c;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#e2f9f6), to(#bfe3df));
    }
    .dataBox-data:nth-child(6){
        top: 50%;
        left: 82%;
        border: 1px solid #16b09c;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#e2f9f6), to(#bfe3df));
    }
    .dataBox-data:nth-child(7){
        top: 50%;
        left:  2%;;
    }
    .dataBox-data:nth-child(8){
        top: 75%;
        left:  2%;;
    }
    .dataBox-data:nth-child(9){
        top: 75%;
        left: 82%;
        border: 1px solid #f8a460;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#ffe6d2), to(#ffbf8a));
    }
}
  .upData{
    color: #67C23A;
  }
  .downData{
    color: #E6A23C;
  }
</style>