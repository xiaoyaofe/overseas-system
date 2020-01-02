<template>
  <div>
     <!-- 日期 -->
    <my-row>
      <section class="timeBox">
        <div class="title">选择时间:</div>
        <section >
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <el-button class="el-icon-refresh" @click="getData()" style="margin-left:15px">查询</el-button>
        <el-button class="el-icon-download" @click="exportData()">导出</el-button>
      </section>
    </my-row>
    <p style="color:red;text-indent: 120px;">1、假期期间的ROI数据可在假期后的第二个工作日正常查看 2、选择时间为北京时间（东八区）</p>
    <!-- 表格 -->
    <div class="table-item ">
      <el-table
        border
        max-height="850"
        :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
        :data="$store.getters['o_r_channel_status/getChannel']"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_channel_status/getChannel'][0]?$store.getters['o_r_channel_status/getChannel'][0]:{}))"
          :key="i"
          :sortable="i==5"
          :prop="item"
          :label="item"
          :formatter="formatter"
          :width="i==0 ? 400:(i==9?130:'')"
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
      in_query_type:3,
    }
  },
  watch: {
    date(data) {
      this.$store.commit("o_r_channel_status/setDate", moment(data).add(0, "day").format("YYYY-MM-DD"));
    },
    isQueryData(v,ov){
      if (v != ov) {
        this.getData()
      }
    }
  },
  created() {
    this.dataInit()
    this.getData();
  },
  computed: {
    _state() {
      return this.$store.state.o_r_channel_status;
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  methods: {
    formatter(row, column, value) {
      var { label } = column
      if (label == "日收入" || label == "总收入") {
        value = +value ? value.format(2) : value.format(0);
      }
      return value
    },
    // 初始化
    dataInit() {
      this.date = this._state.date;
    },
    //查询数据
    getData() {
      var params = {
        in_count_date:this._state.date,          //查询时间
        in_app_id:this.$store.state['common'].nowgame,            //游戏ID
        in_gamezone_id:this.$store.getters['Agent/selectedIdList'],       //区服ID
        in_query_type:this.in_query_type,
      }
      this.$store.dispatch("o_r_channel_status/getReportInfo", { params, tag: 'channel' })
    },
    // 导出表格
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
</style>

