<template>
  <div class="singleGameBox">
    <!-- <button @click="cli">888888888888</button> -->
    <!-- 筛选行 -->
    <section class="btns">
      <el-select class="os" v-model="value" size="medium">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button size="medium"  @click="slide(200)">筛选</el-button>
    </section>
    <!-- 图例 -->
    <section class="legendBox">
      <div class="chart-area" ref="chart"></div>
    </section>
    <!-- 表格 -->
    <section class="fromBox"></section>
    <!-- 筛选框 -->
    <section class="filterBox" :style="{right:`${width}px`}">
        <div class="filter_" v-for="(msg,index) in filterTitle" :key="index">
            <span>{{msg.name}}</span>
            <el-select class="os" v-model="msg.value" size="medium">
                <el-option
                v-for="item in msg.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                ></el-option>
            </el-select>
        </div>
        <el-button size="medium" @click="filterData()">应用</el-button>
    </section>

    
  </div>
</template>
<script>
export default {
  name: "singleGame",
  props: ['_config', '_types'],
  data() {
    return {
      width:-200,
      value: "table",
      options: [{ value: "table", label: "表格" }, { value: "legend", label: "图例" },],
      filterTitle:[{name:'视图',value:'qd',options:[{value:'qd',label:'渠道'},{value:'rq',label:'日期'},{value:'dq',label:'地区'},]},
                   {name:"系统",value:'qb',options:[{value:'qb',label:'全部'},{value:'ios',label:'IOS'},{value:'and',label:'android'},]},
                   {name:"渠道",value:'qd',options:[{value:'qb',label:'全部'},{value:'fb',label:'facebook'},{value:'ga',label:'google'},]},
                   {name:"地区",value:'qb',options:[{value:'qb',label:'全部'},{value:'yn',label:'越南'},{value:'mg',label:'美国'},{value:'tw',label:'台湾'},]}],
    }
  },
  computed: {
    $$data() {
      var data
      if (this.$data.$_curChannel) {
        data = this.$store.getters["o_r_delivery/getZone"];
      } else {
        data = this.$store.getters["o_r_delivery/getChannel"];
      }
      if (data) {
        // for (let i = 0; i < data.list.length; i++) {
        //   this.selectList.push(data.list[i])
        // }
        this.$nextTick(() => {
          this.createChart();
        });
      }
      console.log(data)
      return data;
    },
    $$config() {
      var config
      if (this.$data.$_curChannel) {
        this.$data.$_mainTag = 'zone'
        config = this.$store.state.o_r_delivery.configs[this.$data.$_mainTag]
        console.log('channel.vue', config)
        this.$data.$_mainKey = config.keys[config.index.countryIndex]
        this.$data.$_sortKey = config.keys[config.index.activeIndex]
      } else {
        this.$data.$_mainTag = 'channel'
        config = this._config
        this.$data.$_sortKey = this.$data.$_mainKey = config.keys[config.index.channelIndex]

        this.$data.channels = config.channels
      }
      console.log(config)
      return config
    }
  },
  mounted(){
      console.log(this._types)
      console.log(this._config)
  },
  methods: {
    slide(width) {
        if (this.width == 0) {
          let timer = setInterval(() => {
            this.width -= 10;
            if (this.width == -width) {
              clearInterval(timer);
              this.isShow = !this.isShow
            }
          }, 10);
        } else if (this.width == -width) {
          let timer = setInterval(() => {
            this.width += 10;
            if (this.width == 0) {
              clearInterval(timer);
              this.isShow = !this.isShow
            }
          }, 10);
        }
    },
    filterData(){
      console.log(this._types)
      console.log(this._config)
    }
  }
}
</script>
<style lang="scss" scoped>
.singleGameBox {
  width: 100%;
  min-height: 600px;
  border: 1px solid red;
  overflow: hidden;
  position: relative;
  .btns{
    display: flex;
    justify-content: flex-end;
    .os {
        width: 100px;
    }
    button{
    margin: 0 15px;
    }
  }
  .filterBox{
      width: 200px;
      height: 350px;
      position: absolute;
      top: 50px;
      right: 0;
      border: 1px solid #c0c4cc;
      background: rgba(253, 253, 253, 0.8);
      button{
        width: 120px;
        margin-left: 40px;
        margin-top: 50px;
      }
      .filter_{
        width: 100%;
        min-height: 60px;
        padding-top: 12px;
        text-align: center;
        border-bottom: 1px solid #c0c4cc;
        span{
            min-width: 35px;
            color: rgb(92, 91, 91);
            text-align: center;
            display: inline-block;
        }
        .os{
            width: 120px;
        }
      }

  }

}
</style>
