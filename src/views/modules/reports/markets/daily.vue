<template>
  <div v-if="$$data">
    <div class="table-item">
      <el-table :default-sort="{prop: _config.keys[_config.index.dateIndex], order: $data.$_order}" :data="$$data.list" :cell-style="addStyle">
        <el-table-column v-for="(item, i) in _config.tableKey" :key="i"  :fixed="i<=2?true:false"  :prop="item.key" :label="item.key" :sortable="item.sortable" :width="item.width" :formatter="formatter" v-if="!item.hide"></el-table-column>
        <div slot="append">
          <total-float :_config="{
                                  _config: _config,
                                  $$data: $$data,
                                  key: _config.keys[_config.index.dateIndex],
                                }" 
          :lineData="$$data.total"
          :_chart="$data.$_chartIsReady" />
        </div>
      </el-table>
    </div>
  </div>
</template>

<script>
import totalFloat from './total-float'
export default {
  components: {
    totalFloat
  },
  props: ['_config'],
  data() {
    return {
      $_order: 'ascending',
      $_chartIsReady: 0
    }
  },
  computed: {
    $$data() {
      return this.$store.getters['o_r_delivery/getDaily']
    }
  },
  methods: {
    formatter(row, column, value) {
      var {
        index, keys
      } = this._config
      var {
        label
      } = column
      if (
        label === keys[index.registerRateIndex]
        || label === keys[index.createRateIndex]
        || label === keys[index.roiIndex]
        || label === keys[index.minuteIndex]   
        || label === keys[index.keep1Index]
        || label === keys[index.keep2Index]
        || label === keys[index.keep3Index]     
      ) {
        value += '%'
      }
      return value
    },
    addStyle({ row, column, rowIndex, columnIndex }) {
      function r2g(value, avg) {
        var percent = value;
        if (percent < 30)
          return '#f9686a'
        else if (percent <= 50)
          return '#ffc0cb'
        else if (percent <= 70)
          return '#ffeb85'
        else if (percent <= 90)
          return '#98fb98'
        else
          return '#228b22'
      }
      function g2r(value, avg) {
        var middle = avg / 0.5;
        var percent = value / middle;
        if (percent <= 0.2)
          return '#228b22'
        else if (percent <= 0.4)
          return '#98fb98'
        else if (percent <= 0.6)
          return '#ffeb85'
        else if (percent <= 0.8)
          return '#ffc0cb'
        else
          return '#f9686a'
      }
      function retColor(mmaObj, data) {
        var avg = mmaObj.avg;
        var isReversal = mmaObj.isReversal;
        var style = {
          fontWeight: 700,
          color: '#000'
        }
        // if (avg === 0) return;
        if (isReversal == true) {
          style['background'] = g2r(data, avg);
        } else {
          style['background'] = r2g(data, avg);
        }
        return style
      }
      var { keys, index } = this._config
      var { label } = column
      var mmaObj = this.$$data.mmas[label]
      switch (label) {
        case keys[index.registerRateIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.createRateIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.activeCostIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.registerCostIndex]:
          return retColor(mmaObj, row[label])
          break;
        case keys[index.createCostIndex]:
          return retColor(mmaObj, row[label])
          break;
      }
    }
  }
}
</script>


