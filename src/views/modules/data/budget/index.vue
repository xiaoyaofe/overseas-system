<template>
  <div>
    <!-- 分成补充查询条件 -->
    <my-row class="selection-box">
      <div class="banner">
        <!-- 日期 -->
        <section style="margin-left:20px">
          <el-date-picker size="medium" v-model="date"  type="month"  placeholder="选择月"> </el-date-picker>
        </section>
        <!-- 添加 -->
        <el-button size="medium" class="search" @click="addData()" style="margin-left:20px">查询</el-button>
      </div>
    </my-row>
    <!-- 表格 -->
      <div v-show="$store.state.o_r_delivery.tableIsVisible" class="table-item">
        <el-table
          class="tb-edit"
          border
          :header-cell-style="{background:'#f2f2f2'}"
          :data="$store.getters['o_c_budget/getTableData'].filter(data => !search || data.app_name.toLowerCase().includes(search.toLowerCase()) || (data.app_id+'').includes(search))"
          @cell-dblclick='handleCellClick'
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_c_budget/getTableData'].length?$store.getters['o_c_budget/getTableData'][0]:[]))"
            :key="i"
            :sortable="i>3"
            :prop="item"
            :label="item"
            :width="i==1 ? 280:''"
            v-if="(i<=2)"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, i) in (Object.keys($store.getters['o_c_budget/getTableData'].length?$store.getters['o_c_budget/getTableData'][0]:[]))"
            :key="i"
            :prop="item"
            :label="item"
            :width="i==3 ? 280:''"
            v-if="i==3"
          >
            <template slot-scope="scope">
                <el-input v-show="activityIndex == scope.$index" size="small" autofocus type="text" placeholder="请输入预算"
                v-model="scope.row.cost" 
                @blur="blurInput(scope.$index,scope)"
                ></el-input> 
                <span v-show="activityIndex != scope.$index">{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="230">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder=" 请输入游戏ID或游戏名搜索"/>
            </template>
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="changeRow(scope)"
                type="primary"
                size="small">
                修改
                </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date: '',         //日期
      delIndex:0,      //del下标
      activityIndex:-1,
      search:'',

    }
  },
  computed:{
    $$getTableData(){
      return this.$store.getters["o_c_budget/getTableData"];
    },
    _state() {
      return this.$store.state.o_c_budget;
    },
  },
  created() {
    this.dataInit();
    // 获取渠道列表,
    if (!this._state.gameList.length) this.getData('dividedInto',1);
  },
  watch: {
      date(newValue,oldValue){
          this.$store.commit("o_c_budget/setDate",  moment(newValue).add().format("YYYY-MM-DD"));
      },
  },
  methods:{
      //分成比例修改   
      blurInput(index,scope){
        this.activityIndex = -1
      },
      //添加行的索引值   
      tableRowClassName({row, rowIndex}) {
        row.index = rowIndex;
        return '';
      },
     // 双击修改分成比例  
      handleCellClick(row, column, cell, event){
          var {label} = column;
          if (label == 'cost') {
              this.activityIndex = row.index
          }
      },
    // 修改数据
    changeRow(scope){
      // 预算是否为空
        if (!scope.row.cost) {
           return Utils.Notification.warning({message: '请将预算填写完整'})
        }
        if (confirm("确认修改？")) {
          var params = {
            in_count_date: scope.row['统计时间'],  //开始日期
            in_app_id: scope.row.app_id,                     //游戏id
            in_app_name:scope.row.app_name,             //游戏名称
            in_buget_cost:scope.row.cost.format(2),               //预算(保留两位小数)
            in_operator_type:2,                //查询类型(1:预算信息,2:修改预算)
          };
          console.log(params);
          
          // this.$store.dispatch("o_c_budget/getReportInfo", { params, tag: 'dividedInto' })
        }
    },
    //添加数据
    addData(){
         if (!this.date) {
          Utils.Notification.warning({
              message: '请选择查询日期'
          })
          return
        }
        this.getData('dividedInto',1)
    },
    // 更新数据
    getData(tag,index) {
        // 获取渠道
        var params = {
          in_count_date: this.date?moment(this.date).add().format("YYYY-MM-DD"):moment().startOf('month'),       //开始日期
          in_app_id: 0,                     //游戏id
          in_app_name:'',             //游戏名称
          in_buget_cost:0.00,               //预算(保留两位小数)
          in_operator_type:index,                //查询类型(1:预算信息,2:修改预算)
        };
      this.$store.dispatch("o_c_budget/getReportInfo", { params, tag: tag })
    },
    // 初始化
    dataInit() {
      // 日期初始化
      if (this._state.date) {
        this.date = this._state.date;
      } else {
        this.date = moment().startOf('month')
      }
    },
  }
}
</script>
<style lang="scss" scoped>

input[type=number] {
    -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.banner {
  width: 100%;
  display: flex;
  justify-content: start;
  // border: 1px solid;
  .mail{
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    margin: 0px 10px 0 0;
  }
  .number{
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    color: #606266;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    width: 100px;
  }
}

.table-item{
  border: 15px solid #e7e1ea;
  width: 1200px;
  height: auto;
  margin: 20px;
}
</style>

