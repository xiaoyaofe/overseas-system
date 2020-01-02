<template>
  <section id="new-server-monitor">
    <div class="content-header">
      <moduleHeader v-if="isShowSelect==1" :header="header"  :isShowSelect=isShowSelect :changeMoney="changeMoney" :dateList="dateList1"></moduleHeader>
      <moduleHeader v-if="isShowSelect==2" :header="header"  :isShowSelect=isShowSelect :changeMoney="changeMoney" :dateList="dateList2"></moduleHeader>
    </div>
    <div class="content-body">
      <el-radio-group v-model="radioData" @change="changeRadioData">
        <el-radio-button label="区间新增大R"></el-radio-button>
        <el-radio-button label="充值大R"></el-radio-button>
      </el-radio-group>
      <card>
        <div slot="header">
          <div class="card-header-title">{{$t('common.DataDetails')}}</div>
          <div class="export-link">
            <a href="javascript:void(0)" @click="exportData"><i class="icon-download"></i>导出数据</a>
          </div>
        </div>
        <div slot="body">
          <!-- <div class="table-content"> -->
            <!-- <normalTable :tableData="tableData"></normalTable> -->
          <!-- </div> -->
          <!-- 表格 -->
          <div class="table-item ">
            <el-table
              border
              max-height="850"
              :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
              :data="tableData"
            >
              <el-table-column
                v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
                :key="i"
                :sortable="i==5||i==6"
                :prop="item"
                :label="item"
                :width="i==0 ? 300:(i==4?320:'')"
              ></el-table-column>
            </el-table>
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
      radioData:'区间新增大R',
      isShowSelect:1,//1:区间新增   2:充值大R
      date1: [moment().add(-7, 'day').format('YYYY-MM-DD'), moment().add(-1, 'day').format('YYYY-MM-DD')],
      date2: moment().add(-1, 'day').format('YYYY-MM-DD'),
      tableData: [],
      startValue:100,
      value:'',

    }
  },
  computed: {
    dateList1() {
      return [
        {
          single: false,
          uid: 'date1',
          label: this.$t('common.Date'),
          startDate: this.date1[0],
          endDate: this.date1[1],
          change: (newDate) => { 
            this.date1 = [newDate.startDate,newDate.endDate]; 
            this.query() }
        }]
    },
    dateList2() {
      return [
        {
        single: true,
          uid: 'date2',
          label: this.$t('common.Date'),
          startDate: this.date2,
          endDate: '',
          change: newDate => {
            this.date2 = newDate.startDate
            this.query()
          }
        }]
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }

  },
  watch: {
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
    query() {
      var params = {
        in_app_id: this.$store.state['common'].nowgame,
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_pay_money:this.value?this.value:this.startValue,
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      if (this.isShowSelect==2) {
        params.in_begin_date = this.date2;
        params.in_end_date = this.date2;
        params.in_type_id=2;
      }else{
        params.in_begin_date = this.date1[0];
        params.in_end_date = this.date1[1];
        params.in_type_id=1;
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          for (let index = 0; index < data.state[0].length; index++) {
           Object.keys(data.state[0][index]).forEach((key, flag) => {
             if (flag==5 || flag==6) {
                data.state[0][index][key] = +data.state[0][index][key];
             }
           })
          }
          this.tableData = data.state[0]
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    exportData() {
      var params = {
        in_begin_date: this.isShowSelect==2?this.date1[1]:this.date1[0],
        in_end_date: this.date1[1],
        in_app_id: this.$store.state['common'].nowgame,
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_pay_money:this.value?this.value:this.startValue,
        in_type_id:this.isShowSelect==2?2:1,
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.exportData(params)
    },
    changeMoney(data){
      this.value = data;
      this.query();
    },
    changeRadioData(data){
      this.value = null;
      if(data==='区间新增大R'){
          this.startValue = 100;
          this.isShowSelect = 1;
      }else{
          this.startValue = 2000;
          this.isShowSelect = 2;
      }
      this.query();        
    }
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