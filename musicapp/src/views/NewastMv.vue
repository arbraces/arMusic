<template>
    <div class="newmv">
        <div class="newmvNav">
            <div>
            <p class="newNavText">地区:</p>
            <span @click="areaNavClick('全部',$event)" class="areaNewNavContent">全部</span>|
            <span @click="areaNavClick('内地',$event)" id="navOn" class="areaNewNavContent">内地</span>|
            <span @click="areaNavClick('港台',$event)" class="areaNewNavContent">港台</span>|
            <span @click="areaNavClick('欧美',$event)" class="areaNewNavContent">欧美</span>|
            <span @click="areaNavClick('日本',$event)" class="areaNewNavContent">日本</span>|
            <span @click="areaNavClick('韩国',$event)" class="areaNewNavContent">韩国</span>
            </div>
            <div>
            <p class="newNavText">类型:</p>
            <span @click="typeNavClick('全部',$event)" class="typeNewNavContent">全部</span>|
            <span @click="typeNavClick('官方版',$event)" class="typeNewNavContent">官方版</span>|
            <span @click="typeNavClick('原声',$event)" class="typeNewNavContent">原声</span>|
            <span @click="typeNavClick('现场版',$event)" class="typeNewNavContent">现场版</span>|
            <span @click="typeNavClick('网易出品',$event)" id="navOn" class="typeNewNavContent">网易出品</span>
            </div>
            <div>
            <p class="newNavText">排序:</p>
            <span @click="orderNavClick('上升最快',$event)" class="orderNewNavContent">上升最快</span>|
            <span @click="orderNavClick('最热',$event)" id="navOn" class="orderNewNavContent">最热</span>|
            <span @click="orderNavClick('最新',$event)" class="orderNewNavContent">最新</span>
            </div>
        </div>
        <div class="newContent">
            <recommendedmvcom style="margin-bottom:30px" v-for="(item,index) in ptionMvData" :recmvdata="ptionMvData" :key="index" :index="index"></recommendedmvcom>
        </div>

        <!-- 分页组件 -->
        <div class="block">
        <el-pagination
            layout="prev, pager, next"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="chu">
        </el-pagination>
        </div>

        <!-- 给播放组件留位置 -->
        <div style="height: 100px"></div>
    </div>
</template>

<style lang="less" scoped>
    .newmvNav{
        width: 100%;
        text-align: left;
        color: rgb(235, 235, 235);
        font-size: 14px;
        div{
            margin-bottom: 30px;
        }
    }
    .newNavText{
        display: inline-block;
        cursor: default;
        color: black;
    }
    .areaNewNavContent, .typeNewNavContent, .orderNewNavContent{
        cursor: pointer;
        color: grey;
        padding: 5px 20px;
        border-radius: 20px;
        margin: 0px 20px;
        transition: .3s;
    }
    .newContent{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    #navOn{
        color: #EE0000; background-color:#fcf6f5;
    }
</style>

<script>
import axios from '../api/axios.js'
import recommendedmvcom from '../components/recommendedMvCom.vue'
export default({
    components: {
        recommendedmvcom,
    },
    data(){
        return{
            //最新mv的数据
            mvData: [{
                id: "",
                picUrl: "",
                playCount: "",
                name: "",
                artistName: "",
            }],
            //用于分页的mv数据
            ptionMvData: [{
                id: "",
                picUrl: "",
                playCount: "",
                name: "",
                artistName: "",
            }],
            //分页的初始页
            currentPage: 1,
            //默认的数据
            defaultMvdata: {
                area: "内地",
                type: "网易出品",
                order: "最热",
                limit: 40,
            }
        }
    },
    methods:{
        //请求mv数据
        newResMv(obj){
            axios.getMusic({
                url: `/mv/all`,
                params: obj
            }).then((res) => {
                this.mvData.splice(0, this.mvData.length)
                res.data.data.forEach((item) => {
                    this.mvData.push({
                        id: item.id,
                        picUrl: item.cover,
                        playCount: this.formatPlayCount(item.playCount),
                        name: item.name,
                        artistName: item.artistName,
                    })
                })
                this.processingMV(1)
            })
        },
        //格式化播放量
        formatPlayCount(num){
            if(num <= 9999){
                return num
            }else if(num <= 99999){
                let str = num/10000+""
                return `${str.match(/\d.\d/)}万`
            }else if(num <= 9999999){
                return `${Math.floor(num/10000)}万`
            }
        },
        //当分页的页发生改变时执行下面的函数
        handleCurrentChange(val){
            this.processingMV(val);
        },
        //处理mv数据
        processingMV(val){
            if(this.mvData){
                this.ptionMvData = this.mvData.slice((val-1)*8, val*8)
            }
        },
        //导航栏的处理函数
        areaNavClick(val,el){
            this.defaultMvdata.area = val
            this.newResMv(this.defaultMvdata)
            document.querySelectorAll('.areaNewNavContent').forEach(item => {
                item.id = ""
            })
            el.target.id = "navOn"
        },
        typeNavClick(val,el){
            this.defaultMvdata.type = val
            this.newResMv(this.defaultMvdata)
            document.querySelectorAll('.typeNewNavContent').forEach(item => {
                item.id = ""
            })
            el.target.id = "navOn"
        },
        orderNavClick(val,el){
            this.defaultMvdata.order = val
            this.newResMv(this.defaultMvdata)
            document.querySelectorAll('.orderNewNavContent').forEach(item => {
                item.id = ""
            })
            el.target.id = "navOn"
        }

    },
    computed: {
        //分页数据的总数
        chu(){
            return Math.floor((this.mvData.length / 8)) * 10
        }
    },
    mounted(){
        //调用方法获取mv请求
        this.newResMv(this.defaultMvdata)
    }
})
</script>
