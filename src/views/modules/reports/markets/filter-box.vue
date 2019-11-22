<template>
  <!-- 筛选框 -->
  <section class="filterBox">
    <!-- 视图 -->
    <div class="filter_">
      <span>视图</span>
      <el-select class="os" v-model="viewValue" size="medium">
        <el-option
          v-for="item in viewOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 系统 -->
    <div class="filter_">
      <span>系统</span>
      <el-select
        class="os"
        v-model="systemValue"
        multiple
        filterable
        size="medium"
        @change="((val)=>{elementSelectAll(val, 'systemValue','systemOptionsCopy','systemOldOptions','systemOptions','0')})"
      >
        <el-option
          v-for="item in systemOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 包名 -->
    <div class="filter_">
      <span>包名</span>
      <el-select
        class="os"
        filterable
        multiple
        collapse-tags
        v-model="packageNameValue"
        size="medium"
        @change="((val)=>{elementSelectAll(val, 'packageNameValue','packageNameOptionsCopy','packageNameOldOptions','packageNameOptions','1')})"
      >
        <el-option
          v-for="item in packageNameOptions"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 渠道 -->
    <div class="filter_">
      <span>渠道</span>
      <el-select
        class="os"
        filterable
        multiple
        collapse-tags
        v-model="channelValue"
        size="medium"
        @change="((val)=>{elementSelectAll(val, 'channelValue','channelOptionsCopy','channelOldOptions','channelOptions','2')})"
      >
        <el-option
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 地区 -->
    <div class="filter_">
      <span>地区</span>
      <el-select
        class="os"
        filterable
        collapse-tags
        multiple
        @change="((val)=>{elementSelectAll(val, 'areaValue','areaOptionsCopy','areaOldOptions','areaOptions','3')})"
        v-model="areaValue"
        size="medium"
      >
        <el-option
          v-for="item in areaOptions"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="filter_">
      <el-button type="danger" plain @click="resetSearchData()">重置</el-button>
      <el-button type="success" plain @click="getSearchData()">应用</el-button>
    </div>
  </section>
</template>
<script>
import http from 'src/services/http';
export default {
  props:["sendParams"],
  data() {
    return {
      viewValue: '1',     //视图下标
      viewOptions: [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' }],
      // 系统
      systemValue: ["all", "0", "1"],   
      systemOptions: [{ value: 'all', label: '全部' }, { value: '0', label: 'IOS' }, { value: '1', label: 'android' }],
      systemOptionsCopy: [{ value: 'all', label: '全部' }, { value: '0', label: 'IOS' }, { value: '1', label: 'android' }],
      systemOldOptions: [[]],
      // 包名
      packageNameValue: [],
      packageNameOptions: [],
      packageNameOptionsCopy: [],
      packageNameOldOptions: [[]],
      // 渠道
      channelValue: [],
      channelOptions: [],
      channelOptionsCopy: [],
      channelOldOptions: [[]],
      // 地区
      areaValue: [],
      areaOptions: [],
      areaOptionsCopy: [],
      areaOldOptions: [[]],
    }
  },
  created() {
    // 初始化
    this.init_selectData(this._state.channelSelectDataInfo)
  },
  computed: {
    _state() {console.log(89,this.$store.state.o_r_delivery);
    
      return this.$store.state.o_r_delivery;
    },
    _key() {
      return this.$store.getters["o_r_delivery/getIdStr"];
    },
    channelSelectData() {
      return this.$store.state.o_r_delivery.channelSelectData
    },

    viewType() {
      return this.$store.state.o_r_delivery.tableIsVisible
    },
  },
  watch: {
    channelSelectData(newValue, oldValue) {
      this.init_selectData(newValue)
    },
    viewType(newValue, oldValue) {
      if (newValue) {
        this.viewOptions = [{ value: '1', label: '渠道' }, { value: '2', label: '时间' }, { value: '3', label: '地区' }];
      } else {
        this.viewOptions = [{ value: '1', label: '渠道' }, { value: '3', label: '地区' }];
      }

    }
  },
  methods: {
    init_selectData(newValue) {
      if (newValue) {
        this.viewValue = newValue.viewValue?newValue.viewValue:"1";
        this.systemValue = newValue.systemValue?newValue.systemValue:["all", "0", "1"];
        this.packageNameValue = newValue.packageNameValue;
        this.packageNameOptions = newValue.packageNameData;
        this.packageNameOptionsCopy = newValue.packageNameValue;
        this.channelValue = newValue.channelDataValue;
        this.channelOptions = newValue.channelData;
        this.channelOptionsCopy = newValue.channelDataValue;
        this.areaValue = newValue.areaDataValue;
        this.areaOptions = newValue.areaData;
        this.areaOptionsCopy = newValue.areaDataValue;
      }
    },
    elementSelectAll(val, valueName, optionsCopy, oldOptions, optionsName, changeNameIndex) {
      let allValues = []
      //保留所有值
      for (let item of this.$data[optionsName]) {
        allValues.push(item.value)
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.$data[oldOptions].length === 1 ? [] : this.$data[oldOptions][1]
      // 若是全部选择
      if (val.includes('all')) {
        if (this.$data[optionsCopy].length != allValues.length) {
          allValues.shift()
        }
        this.$data[valueName] = allValues
      }
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('all') && !val.includes('all')) this.$data[valueName] = []
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
      // 新老数据都有全部选中 
      if (oldVal.includes('all') && val.includes('all')) {
        const index = val.indexOf('all')
        val.splice(index, 1) // 排除全选选项
        this.$data[valueName] = val
      }
      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('all') && !val.includes('all')) {
        if (val.length === allValues.length - 1) this.$data[valueName] = ['all'].concat(val)
      }
      //储存当前最后的结果 作为下次的老数据 
      this.$data[oldOptions][1] = this.$data[valueName]

      //change逻辑*************************************************************************************/ 
      let allData = this.channelSelectData.allData;
      switch (changeNameIndex) {
        case "1":
          // 修改包名
          this.$data[valueName];
          if (this.$data[valueName].includes("all")) {
            // 如果选择的是全部包名,则选中全部渠道和全部地区
            this.channelValue = ['all'].concat([...new Set(allData.map(item => item.media_source))])
            this.channelOptions = (this.channelValue.map(item => { return { lable: item === 'all' ? '全部' : item, value: item } }))
            this.channelOptionsCopy = this.channelOptions;

            this.areaValue = ['all'].concat([...new Set(allData.map(item => item['国家']))])
            this.areaOptions = (this.areaValue.map((item, i) => { return { lable: item === 'all' ? '全部' : [...new Set(allData.map(item => item.country_name))][i - 1], value: item } }))
            this.areaOptionsCopy = this.areaOptions;
          } else if (!this.$data[valueName].length) {
            // 如果选择的包名为空,则渠道和地区都为空
            this.channelValue = [];
            this.channelOptions = [];
            this.channelOptionsCopy = [];

            this.areaValue = [];
            this.areaOptions = [];
            this.areaOptionsCopy = [];
          } else {
            // 如果未选中全部包名,则要选中对用渠道和地区
            let filter_area_data = [];
            let filter_channel_data = [];
            this.$data[valueName].map((item) => { return filter_channel_data.push(allData.filter((todo) => todo.package_name === item)) })
            this.channelValue = ["all"].concat([...new Set(Array.prototype.concat.apply([], filter_channel_data).map((item) => item.media_source))])
            this.channelOptions = (this.channelValue.map(item => { return { lable: item === 'all' ? '全部' : item, value: item } }))
            this.channelOptionsCopy = this.channelOptions;

            filter_channel_data = Array.prototype.concat.apply([], filter_channel_data);
            this.areaValue = ['all'].concat([...new Set(filter_channel_data.map(item => item['国家']))])
            this.areaOptions = (this.areaValue.map((item, i) => { return { lable: item === 'all' ? '全部' : [...new Set(filter_channel_data.map(item => item.country_name))][i - 1], value: item } }))
            this.areaOptionsCopy = this.areaOptions;
          }

          break;
        case "2":
          // 修改渠道
          if (this.$data[valueName].includes("all")) {
            // 如果选择的是全部渠道,则选中全部地区
            this.areaValue = ['all'].concat([...new Set(allData.map(item => item['国家']))])
            this.areaOptions = (this.areaValue.map((item, i) => { return { lable: item === 'all' ? '全部' : [...new Set(allData.map(item => item.country_name))][i - 1], value: item } }))
            this.areaOptionsCopy = this.areaOptions;
          } else if (!this.$data[valueName].length) {
            // 如果选择的渠道为空,则地区为空
            this.areaValue = [];
            this.areaOptions = [];
            this.areaOptionsCopy = [];
          } else {
            // 如果未选中全部渠道,则要选中对应地区
            let filter_area_data = [];
            this.$data[valueName].map((item) => { return filter_area_data.push(allData.filter((todo) => todo.media_source === item)) })
            this.areaValue = ["all"].concat([...new Set(Array.prototype.concat.apply([], filter_area_data).map((item) => item['国家']))])
            filter_area_data = Array.prototype.concat.apply([], filter_area_data);
            this.areaOptions = (this.areaValue.map((item, i) => { return { lable: item === 'all' ? '全部' : [...new Set(filter_area_data.map(item => item.country_name))][i - 1], value: item } }))
            this.areaOptionsCopy = this.areaOptions;
          }
          break;
        case "3":
          // 修改地区
          break;

        default:
          break;
      }
    },
    getSearchData() {
      var params = {
        in_install_date1: this._state.reportQueryParams.activationTime[0],          //激活开始日期
        in_install_date2: this._state.reportQueryParams.activationTime[1],          //激活结束日期
        in_pay_date1: this._state.reportQueryParams.rechargeTime[0],            //充值开始时间
        in_pay_date2: this._state.reportQueryParams.rechargeTime[1],            //充值结束时间
        in_os: this.systemValue.length == 3 ? '0,1' : this.systemValue.join(","), //系统                  
        in_area_app_ids: this._key,                          //游戏层级 
        in_rpt_type: 4,                                 //报表类型 1 查询游戏层级  2 综合报表  3 每日报表  4 渠道(媒体)报表   5 系统对比
        in_chart_type: 0,                               //数据展现图表类型 ：0 查询渠道地区信息 1 表格 2 图例
        in_view_type: this.viewValue,             //视图类型：1 渠道 2 时间 3 地区
        in_package_name: this.packageNameValue.includes("all") ? '' : this.packageNameValue.join(','),             //包名
        in_media_source: this.channelValue.includes("all") ? '' : this.channelValue.join(','),        //渠道
        in_country: this.areaValue.includes("all") ? '' : this.areaValue.join(','),                     //国家
      };
      // 第一步:先判断当前视图为表格(true)还是图例(false)
      if (this.$store.state.o_r_delivery.tableIsVisible) {
        params.in_chart_type = 1
      } else {
        params.in_chart_type = 2
      }
      var newSelectData = {    
        'viewValue':this.viewValue,
        "systemValue":this.systemValue,
        'packageNameData': this.packageNameOptions,
        "packageNameValue": this.packageNameValue,
        'channelData': this.channelOptions,
        "channelDataValue": this.channelValue,
        "areaData": this.areaOptions,
        "areaDataValue": this.areaValue,
        "allData": this._state.channelSelectDataBak.allData,
      };
      this.$store.dispatch("o_r_delivery/getReportInfo", { params, tag: this.$store.state.o_r_delivery.tableIsVisible ? 'channel' : 'legend' }).then(() => {
        this.$store.commit("o_r_delivery/set_channelSelectDataInfo", newSelectData);
        this.$emit('sendParams',this.viewValue)
      });


    },
    resetSearchData() {
      this.init_selectData(this._state.channelSelectDataBak)
    }


  },
}
</script>
<style lang="scss" scoped>
.filterBox {
  width: 300px;
  height: auto;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 9;
  border: 1px solid #c0c4cc;
  background: white;
  button {
    width: 75px;
  }
  button:nth-child(2) {
    left: 160px;
    top: 20px;
  }
  .filter_ {
    width: 100%;
    min-height: auto;
    padding-bottom: 12px;
    padding-top: 12px;
    text-align: center;
    border-bottom: 1px solid #c0c4cc;
    position: relative;
    span {
      min-width: 35px;
      color: rgb(92, 91, 91);
      text-align: center;
      display: inline-block;
    }
    .os {
      width: 200px;
    }
  }
  .filter_:nth-child(5) {
    min-height: 80px;
    // border-bottom: 1px solid red;
  }
}
</style>
