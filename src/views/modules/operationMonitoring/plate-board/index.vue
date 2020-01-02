<template>
  <section id="new-server-monitor">
    <div class="content-header">
      <moduleHeader :header="header" :dateList="dateList2"></moduleHeader>
    </div>
    <pagination
    style="padding: 0px 18px;"
      v-if="allData.length"
      :total="allData.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="cahngePage" 
    />
    <div class="content-body">
      <card>
        <div slot="header">
          <div class="card-header-title">{{$t('common.DataDetails')}}</div>
          <div class="export-link">
            <a href="javascript:void(0)" @click="exportData">
              <i class="icon-download"></i>导出数据
            </a>
          </div>
        </div>
        <div slot="body">
          <div class="table-item">
            <el-table
              border
              max-height="850"
              :header-cell-style="{background:'#f2f2f2',textAlign:'left'}"
              :data="tableData"
            >
              <el-table-column
                v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
                :key="i"
                :sortable="i!=1"
                :prop="item"
                :label="item"
                :width="i==2 ? 150:(i==0?100:'')"
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
import Pagination from 'src/components/Pagination/index.vue'
import api from 'src/services/api'
import { log } from 'util';
export default {
  name: 'new-server-monitor',
  components: {
    card, moduleHeader, Pagination
  },
  data() {
    return {
      header: {
        title: '新服监测',
        definedContent: '',
        isShowIndex: false,
      },
      date2: moment().add(-1, 'day').format('YYYY-MM-DD'),
      tableData: [],
      allData:[],
      listQuery: {
        page: 1,
        limit: 10
      },
    }
  },
  computed: {
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
    cahngePage(data){
        this.tableData = this.allData.slice((data.page-1)*this.listQuery.limit,this.listQuery.limit*data.page)
    },
    query() {
      var params = {
        in_count_date: this.date2,
        in_app_id: this.$store.state['common'].nowgame,
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
        dataview: this.$store.state.common.nowmenu.dataView[0],
      }
      api.user.getQuery(params).then((data) => {
        if (data.code == 401) {
          for (let index = 0; index < data.state[0].length; index++) {
           Object.keys(data.state[0][index]).forEach((key, flag) => {
             if (flag!=1) {
                data.state[0][index][key] = +data.state[0][index][key];
             }
           })
          }
          this.allData = data.state[0];
          this.tableData = data.state[0].slice(0,this.listQuery.limit)
        } else {
          Utils.Notification.error({ message: data.message });
          console.error(data.message);
        }
      })
    },
    exportData() {
      var params = {
        in_count_date: this.date2,
        in_app_id: this.$store.state['common'].nowgame,
        in_gamezone_id: this.$store.getters['Agent/selectedIdList'],
        in_channel_id: this.$store.getters['RegChannel/selected3IdList'],
        dataview: this.$store.state.common.nowmenu.dataView[0],
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
</style>