<template>
    <div>
        <!-- <section class="inputBox">
            <el-input width=600 placeholder="请输入你要查询的问题描述内容" v-model="inputTxt" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </section> -->
        <div class="content">
            <section v-for="(item,i) in feepBackData" :key="i">
                <h5 class="cDescription">{{i+1}}&nbsp;问题描述:&nbsp;{{item.description}}</h5>
                <div>
                    <h5 class="cSolve"  v-if="item.cSolve">解决方法:&nbsp;{{item.solve}}</h5>
                    <el-button type="success" v-if="item.isButton" @click="dialogVisible = true">重数数据</el-button>
                    <p class="tipTxt" v-if="item.isButton">( 提示:不建议频繁调用重数数据,只允许重算日数据 )</p>
                </div>
                <img :src="item.imageUrl" alt="图片异常">
            </section>
        </div>
        <el-dialog
            title="重算数据"
            :visible.sync="dialogVisible"
            width="35%"
            :before-close="handleClose">
            <div class="block">
                <span class="demonstration">日期</span>
                <el-date-picker
                v-model="searchTime"
                type="date"
                placeholder="选择需要重算的日期">
                </el-date-picker>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleClick">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
import Vue from 'vue'
import api from 'src/services/api'
export default {
    data () {
        return {
            activeName: 'first',
            dialogVisible:false,
            searchTime:'',
            inputTxt:'',
            feepBackData:[
                {
                    description:'指针转盘趋势：注册人数不正常，偏少',
                    solve:'',
                    imageUrl:require('../images/hy_1.png') ,
                    isButton:false,
                },{
                    description:'SDK后台区服核对：新服是否添加（运营添加）',
                    solve:'',
                    imageUrl:require('../images/hy_2.png'), 
                    isButton:false,
                },{
                    description:'新渠道包是否有添加（技术添加）',
                    solve:'',
                    imageUrl:require('../images/hy_3.png'),
                    isButton:false,
                }
            ]
        }
    },
    methods: {
        handleClose(done) {
            this.dialogVisible = false;
            this.searchTime = '';
           
        },
        handleClick(done) {           
            if (this.searchTime.length==0) {
                this.$notify({type: "warning", message: "请选择日期"});
            }else{
                let in_begin_date = moment(this.searchTime).format("YYYY-MM-DD");
                let in_end_date = moment(this.searchTime).format("YYYY-MM-DD");
                console.log(in_begin_date,in_end_date);
                api.user.getQuery({
                    in_begin_date,
                    in_end_date,
                    dataview:'fn_dataprt_proc',
                    }).then((data) => {
                        if (data.code === 401) {
                            this.$notify({type: "success", message: "数据重数成功"});
                            this.dialogVisible = false;
                        } else {
                            this.$notify({type: "warning", message: data.message});
                        }
                        console.log(data)
                    })

            }
        },
    },
    
}
</script>
<style lang="scss" scoped>
.inputBox{
    max-width:600px;
    margin-bottom:20px;
}
.content{

    .cDescription,
    .cSolve{
        font-weight: 400;
        font-size:22px;
        padding: 8px 0;
        margin:0;
        margin-right:15px;
    }
    .cDescription{
        color:red;

    }
    .cSolve{
        color:green;
        margin-left:15px;
        display: inline-block;
    }
    .tipTxt{
        font-size: 14px;
        color: #5e6d82;
        margin: 0;
        text-indent:15px;
        line-height: 1.5em;
    }
    img{
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            border-radius: 5px;
            margin: 15px 0;
        }

}
.demonstration{
    display:in
}

</style>