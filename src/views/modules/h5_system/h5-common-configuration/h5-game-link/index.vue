<template>
  <div>
    <my-row style="padding-left:20px;">
      <!-- 输入渠道 -->
      <el-button type="info" @click="addDataDialogBtn">
        <i class="el-icon-plus"/>新增
      </el-button>
      <el-button type="info" @click="filterDataDialogBtn" style="margin:0 15px">
        <i class="el-icon-plus"/>筛选
      </el-button>
    </my-row>
    <hr style="width:100%;margin-bottom: 0;">
    <!-- 新增对话框 -->
    <el-dialog
        title="新增游戏link"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="addDataHandleClose">
        <!-- 选择游戏 -->
        <section class="addDialogContent">
            <el-select v-model="games_value" filterable placeholder="请选择游戏">
                <el-option
                v-for="item in _state.games"
                :key="item.app_id"
                :label="item.app_name"
                :value="item.app_id"
                ></el-option>
            </el-select>
            <!-- 选择URL -->
            <el-select v-model="url_value" filterable placeholder="请选择url"  @visible-change="selsetUrl($event)"  style="margin:0 20px">
                <el-option
                v-for="item in _state.urlData"
                :key="item.url"
                :label="item.url"
                :value="item.url"
                ></el-option>
            </el-select>
            <!-- 选择渠道 -->
            <el-select v-model="channel_value" filterable placeholder="请选择渠道">
                <el-option
                v-for="(item) in _state.channelData"
                :key="item.id"
                :label="item.media_source"
                :value="item.media_source"
                ></el-option>
            </el-select>
        </section>
        <!-- url输入框 -->
        <el-input placeholder="请输入内容" v-model="input_tag" >
        <template slot="prepend">标签</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDataHandleClose">取 消</el-button>
            <el-button type="primary" @click="addGameLink">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 筛选对话框 -->
    <el-dialog
        title="筛选游戏link"
        :visible.sync="filterDialogVisible"
        width="30%"
        :before-close="filterHandleClose">
        <!-- 选择游戏 -->
        <section class="addDialogContent">
            <el-select v-model="games_value" filterable placeholder="请选择游戏">
                <el-option
                v-for="item in _state.games"
                :key="item.app_id"
                :label="item.app_name"
                :value="item.app_id"
                ></el-option>
            </el-select>
            <!-- 选择URL -->
            <el-select v-model="url_value" filterable placeholder="请选择url" style="margin:0 20px">
                <el-option
                v-for="item in _state.urlData"
                :key="item.url"
                :label="item.url"
                :value="item.url"
                ></el-option>
            </el-select>
            <!-- 选择渠道 -->
            <el-select v-model="channel_value" filterable placeholder="请选择渠道">
                <el-option
                v-for="item in _state.channelData"
                 :key="item.id"
                :label="item.media_source"
                :value="item.media_source"
                ></el-option>
            </el-select>
        </section>
        <!-- url输入框 -->
        <el-input placeholder="请输入内容" v-model="input_tag" >
        <template slot="prepend">筛选标签</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="filterHandleClose">取 消</el-button>
            <el-button type="primary" @click="filterGameLink">确 定</el-button>
        </span>
    </el-dialog>   
    <!-- 移除对话框 -->
    <el-dialog
        title="移除数据提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        :before-close="Undelete"
        center>
        <span>该操作具有一定风险,你确认继续吗?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Undelete">取 消</el-button>
            <el-button type="danger" @click="confirmDeletion">确 定</el-button>
        </span>
    </el-dialog>
    <!-- <p>{{_state.tableData}}</p> -->
    <!-- 表格 -->
    <div class="table-item">
      <el-table
        border
        max-height="760"
        :header-cell-style="{background:'#f2f2f2'}"
        :data="_state.tableData"
      >
        <el-table-column
          v-for="(item, i) in (Object.keys((_state.tableData && _state.tableData.length)?_state.tableData[0]:[]))"
          :key="i"
          v-if="i!=1"
          :prop="item"
          :label="item"
          :width="getWidth(i)"
        ></el-table-column> -->
       <el-table-column label="操作" width="160" v-if="(_state.tableData && _state.tableData.length)">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="copyRow(scope.$index,$event)"
              type="primary"
              size="small"
            >复制</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index,)"
              type="danger"
              size="small"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { log } from 'util';
import md5 from 'js-md5'
import clip from '../../../../../utils/clipboard' // use clipboard directly
export default {
  data() {
    return {
        addDialogVisible:false,//新增对话框是否可见
        filterDialogVisible:false,//筛选对话框是否可见
        centerDialogVisible:false,//移除数据是否可见
        input_tag:'',
        games_value:'',
        url_value:'',
        channel_value:'',
        in_app_id:0,
        in_app_name:'',
        in_app_url:'',
        in_media_source:'',
        in_app_tag:'',
        in_app_tag_desc:'',
        in_id:0,
        activityIndex: -1,
    }
  },
  created() {
    //查询游戏列表和表格数据   
    this.getData('tableData',2)
  },
  watch:{
      games_value(newValue,oldValue){
        this.$store.commit("h5_link_config/set_urlData",this._state.filterData[0].filter((todo)=>todo.app_id === newValue));


      }

  },
  computed: {
    _state() {
      return this.$store.state.h5_link_config
    },
  },
  methods: {
    //url修改   
    blurInput(index) {
      this.activityIndex = -1
    },
    // 双击修改url
    handleCellClick(row, column, cell, event) {
      var { label } = column;
      if (label == '渠道') {
        this.activityIndex = row.index;
      }
    },
    selsetUrl($event){
        if (!this.games_value && $event) {
          return Utils.Notification.warning({ message: "请先选择游戏再选择url" })
        }
    },
    // 关闭之前回调
    addDataHandleClose(){
        this.games_value = '';
        this.url_value = '';
        this.channel_value = '';
        this.input_tag = "";
        this.$store.commit("h5_link_config/set_urlData",[]);
        this.addDialogVisible = false;
    },
    filterHandleClose(){
        this.games_value = '';
        this.url_value = '';
        this.channel_value = '';
        this.input_tag = "";
        this.$store.commit("h5_link_config/set_urlData",[]);
        this.addDialogVisible = false;
        this.filterDialogVisible = false
    },
    // 打开新增对话框事件
    addDataDialogBtn(){
        this.addDialogVisible = true;
        this.in_app_id =0;
        this.in_app_name = '';
        this.in_app_url = '';
        this.in_media_source = '';
        this.in_app_tag = '';
        this.in_app_tag_desc = '';
        this.in_id = 0;
        this.getData('games',1)
    },
    filterDataDialogBtn(){
        this.filterDialogVisible = true;
        this.in_app_id =0;
        this.in_app_name = '';
        this.in_app_url = '';
        this.in_media_source = '';
        this.in_app_tag = '';
        this.in_app_tag_desc = '';
        this.in_id = 0;
        this.getData('games',1)
    },
    // 新增游戏link
    addGameLink() {
      //输入框是否填写完整
      if (!this.games_value || !this.url_value || !this.channel_value || !this.input_tag) {
        return Utils.Notification.warning({ message: "请将新增游戏Link信息填写完整" })          
      }
      var app_name = this._state.games.filter((todo) => todo.app_id == this.games_value)[0].app_name;
      this.in_app_id = this.games_value;
      this.in_app_name = app_name;
      this.in_app_url = this.url_value;
      this.in_media_source = this.channel_value;
      this.in_app_tag = md5(this.input_tag);
      this.in_app_tag_desc = this.input_tag;
      this.in_id = 0;
      this.getData('tableData',3)
      this.addDialogVisible = false;
    },
    // 筛选游戏Link
    filterGameLink(){
     //输入框是否填写完整
      if (!this.games_value || !this.url_value || !this.channel_value || !this.input_tag) {
        return Utils.Notification.warning({ message: "请将筛选游戏Link信息填写完整" })          
      }
      var app_name = this._state.games.filter((todo) => todo.app_id == this.games_value)[0].app_name;
      this.in_app_id = this.games_value;
      this.in_app_name = app_name;
      this.in_app_url = this.url_value;
      this.in_media_source = this.channel_value;
      this.in_app_tag = md5(this.input_tag);
      this.in_app_tag_desc = this.input_tag;
      this.in_id = 0;
      this.getData('tableData',2)
      this.filterDialogVisible = false;
        
    },
    //删除数据
    deleteRow(index) {
        this.centerDialogVisible = true;
        this.in_app_name = this._state.tableData[index]["游戏"];
        this.in_app_id = this._state.tableData[index]["app_id"];
        this.in_app_url =  this._state.tableData[index]["最终链接"];
        this.in_media_source = this._state.tableData[index]["渠道"];
        this.in_app_tag = md5(this._state.tableData[index]["标签"]);
        this.in_app_tag_desc = this._state.tableData[index]["标签"];
        this.in_id = this._state.tableData[index]["序号"];
    },
    // 确认删除
    confirmDeletion(){
        this.getData('tableData',4);
        this.centerDialogVisible = false;
    },
    // 取消删除
    Undelete(){
        this.centerDialogVisible = false;
        this.in_app_id =0;
        this.in_app_name = '';
        this.in_app_url = '';
        this.in_media_source = '';
        this.in_app_tag = '';
        this.in_app_tag_desc = '';
        this.in_id = 0;
    },
    // 复制数据
    copyRow(index,event) {
         clip(this._state.tableData[index]["最终链接"], event)

      
    },
    getData(name,index) {
      var params = {
        in_app_id:this.in_app_id,
        in_app_name:this.in_app_name,
        in_app_url:this.in_app_url,
        in_media_source:this.in_media_source,
        in_app_tag:this.in_app_tag,
        in_app_tag_desc:this.in_app_tag_desc.trim(),
        in_id:this.in_id,
        in_operator_type:index,
      }
      this.$store.dispatch("h5_link_config/getMOduleData", { params, tag: name, }).then(()=>{
          if (name == "tableData") {
            this.games_value = '';
            this.url_value = '';
            this.channel_value = '';
            this.input_tag = "";
            this.$store.commit("h5_link_config/set_urlData",[]);
          }
      })
    },
    getWidth(index) {
        switch (index) {
            case 0:
                return 80
                break;
            case 2:
                return 150
                break;
            case 3:
                return 150
                break;
            case 4:
                return 150
                break;
            default:
                break;
        }
    },
  },
}
</script>
<style lang="scss" scoped>
.table-item {
  border: 15px solid #e7e1ea;
  width: auto;
  height: auto;
  margin: 20px;
}
.el-table__header {
  background: #f2f2f2;
}
.addDialogContent{
    display: flex;
    margin-bottom: 20px
}
</style>
