<template>
  <div>
    <!-- 日期 -->
    <my-row>
      <section class="timeBox">
        <div class="title">选择时间:</div>
        <!-- 日期 -->
        <section>
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
        </section>
        <el-button class="el-icon-refresh" @click="getData()" style="margin-left:15px">查询</el-button>
        <el-button class="el-icon-download" @click="exportData()">导出</el-button>
      </section>
    </my-row>
    <p style="color:red;text-indent: 120px;">1、假期期间的ROI数据可在假期后的第二个工作日正常查看 2、选择时间为北京时间（东八区）</p>
    <!-- 表格 -->
    <div class="table-item money">
      <el-table
        border
        id="money"
        align="left"
        :header-cell-style="{background:'#f2f2f2'}"
        :data="$store.getters['o_r_service_status/getService'].data"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_service_status/getService'].data?$store.getters['o_r_service_status/getService'].data[0]:[]))"
          :key="i"
          :prop="item"
          :label="item"
          :formatter="formatter"
        ></el-table-column>
      </el-table>
    </div>
    <!--  -->
    <div class="table-item testcss">
      <el-table
        border
        max-height="550"
        :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
        :data="$store.getters['o_r_service_status/getService'].table"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys($store.getters['o_r_service_status/getService'].table?$store.getters['o_r_service_status/getService'].table[0]:[]))"
          :key="i"
          :sortable="i==1"
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
export default {
  data() {
    return {
      date: null,
      in_query_type: 2,
    }
  },
  watch: {
    date(data) {
      this.$store.commit("o_r_service_status/setDate", moment(data).add(0, "day").format("YYYY-MM-DD"));
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
  computed: {
    _state() {
      return this.$store.state.o_r_service_status;
    },
    isQueryData(){
      return this.$store.state.common.isQueryData
    }
  },
  methods: {
    formatter(row, column, value) {
      var { label } = column
      if (label == "总ROI") {
        value = +value ? value.format(2) + '%' : value.format(0) + '%';
      } else if (label == "总收益") {
        value = +value ? value.format(2) : value.format(0);
      } 
      return value
    },
    // 导出
    exportData() {
      console.log(Utils)
      Utils.tableExport('#money')
      var thead = document.querySelector('.testcss thead').innerHTML
      var tbody = document.querySelector('.testcss tbody').innerHTML
      var table = document.createElement('table')
      table.innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`
      Utils.tableToExcel(
        table,
        false,
        Date.now() + '.xls'
      )
    },
    // 初始化
    dataInit() {
        this.date = this._state.date;
    },
    //查询数据
    getData() {
      var params = {
        in_count_date: this._state.date,   //开始日期
        in_app_id:this.$store.state['common'].nowgame,            //游戏ID
        in_gamezone_id:this.$store.getters['Agent/selectedIdList'],       //区服ID        
        in_query_type: this.in_query_type,    //查询类型              
      }
      this.$store.dispatch("o_r_service_status/getReportInfo", { params, tag: 'service' })
    },
  },
}
</script>
<style lang="scss" scoped>
.gameBox {
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
  .gameList {
    height: 180px;
    overflow: auto;
    button {
      height: 35px;
      padding-top: 10px;
      padding-bottom: 10px;
      min-width: 170px;
      margin: 5px;
    }
  }
  .active {
    color: white;
    background: #5b5691;
  }
  .zoneName {
    min-width: 170px;
    color: white;
    background: #5b5691;
  }
}
.timeBox {
  height: 40px;
  margin: 12px 0px;
  margin-left: 20px;
  width: 90%;
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
