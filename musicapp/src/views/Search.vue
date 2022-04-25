<template>
    <div>
        <!-- 标题 -->
        <div class="title">{{keyWord}}
            <span class="titleText" v-if="dataLenght">共找到{{dataLenght}}个结果</span>
        </div>

        <!-- 导航栏 -->
        <div style="margin-top:30px" class="seaNav">
            <el-menu active-text-color="#EE0000" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">歌曲</el-menu-item>
            <el-menu-item index="2">歌单</el-menu-item>
            <el-menu-item index="3">MV</el-menu-item>
            </el-menu>
        </div>

        <!-- 表格 -->
        <div class="content" id="table" v-if="activeIndex === '1'">
            <div class="table" v-if="tableData">
                <el-table
                    :data="tableData"
                    stripe
                    cursor="pointer"
                    title="点击添加到列表"
                    @row-click="Tableclick"
                    style="width: 100%;">
                    <el-table-column
                    type="index"
                    :index="indexMethod">
                    </el-table-column>
                    <el-table-column
                    row-class-name="thStyle"
                    prop="date"
                    label="音乐标题"
                    width="250">
                    </el-table-column>
                    <el-table-column
                    row-class-name="thStyle"
                    prop="name"
                    label="歌手"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    row-class-name="thStyle"
                    prop="address"
                    label="专辑">
                    </el-table-column>
                    <el-table-column
                    row-class-name="thStyle"
                    prop="time"
                    label="时长">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="content" id="song" v-if="activeIndex === '2'">
            <song-sheet style="margin:20px 0px" :recData="tableData" :index="index" v-for="(val, index) in tableData" :key="index"></song-sheet>
        </div>
        <div class="content" id="mv" v-if="activeIndex === '3'">
            <recommendedmvcom :recmvdata="tableData" v-for="(item, index) in tableData" :index="index" :key="index"></recommendedmvcom>
        </div>
        <!-- 分页 -->
        <div class="block">
            <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="dataLenght-10">
            </el-pagination>
        </div>

        <!-- 给播放组件留位置 -->
        <div style="height: 100px"></div>
    </div>
</template>

<script>
import axios from "../api/axios.js";
import songSheet from "../components/songSheetCom.vue"
import recommendedmvcom from "../components/recommendedMvCom.vue"

export default ({
    components:{
        songSheet,
        recommendedmvcom,
    },
    data(){
        return {
            //关键词
            keyWord: "",
            //数据总数
            dataLenght: 0,
            //默认选中的导航栏
            activeIndex: '1',
            //分页的数据类型
            type: "1",
            tableData: [],
            //用于存放音乐url的数据
            musicUrl: "",
        }
    },
    methods: {
        /*
            搜索函数参数说明
            val
        */
        search(val,offset=0,type=1){
            //展示到页面
            this.keyWord = val
            axios.getMusic({ 
                url: '/search',
                params: {
                    /* 
                        ----搜索请求接口说明----
                        keywords => 关键词
                        limit => 返回数量
                        offset => 偏移量(用于分页)
                        type => 搜索类型
                    */
                    keywords: val,
                    limit: 10,
                    type: type,
                    offset: offset*10,
                }
            }).then(res => {
                //获取单曲
                if(type == 1){
                    try{
                        this.dataLenght = res.data.result.songCount
                        this.tableData.splice(0, this.tableData.length)
                        res.data.result.songs.forEach((item) => {
                            this.tableData.push({
                                id: item.id,
                                date: item.name,
                                name: item.artists[0].name,
                                address: item.album.name,
                                time: this.formatTime(item.duration)
                            })
                        });      
                    }catch(e){
                    }
                }else if(type == 1000){
                    this.tableData.splice(0, this.tableData.length)
                    this.dataLenght = res.data.result.playlistCount
                    res.data.result.playlists.forEach(item => {
                        this.tableData.push({
                            id: item.id,
                            name: item.name,
                            picUrl: item.coverImgUrl,
                        })
                    })
                }else if(type == 1004){
                    this.tableData.splice(0, this.tableData.length)
                    this.dataLenght = res.data.result.mvCount
                    res.data.result.mvs.forEach((item,index) => {
                        if(index < 8){
                            this.tableData.push({
                                artistName: item.artistName,
                                name: item.name,
                                picUrl: item.cover,
                                playCount: this.formatPlayCount(item.playCount),
                            })
                        }
                    })
                }
            })
        },
        //表格的索引
        indexMethod(index) {
            return index+1;
        },
        //菜单栏被选中
        handleSelect(key, keyPath) {
            this.activeIndex = key
            if(key == 1){
                this.type = key
                this.search(this.keyWord, "", key)
            }else if(key == 2){
                key = 1000
                this.type = key
                this.search(this.keyWord, "", key)
            }else if (key == 3){
                key = 1004
                this.type = key
                this.search(this.keyWord, "", key)
            }
        },
        //格式化时间
        formatTime(time){
            if(Math.floor(time/1000%60) < 10){
                return `${Math.floor(time/1000/60)}:0${Math.floor(time/1000%60)}`
            }else{
                return `${Math.floor(time/1000/60)}:${Math.floor(time/1000%60)}`
            }
        },
        //当分页触发的时候触发下面的函数
        handleCurrentChange(val){
            this.search(this.keyWord,val,this.type)
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
        //表格被点击
        Tableclick(row){
            axios.getMusicUrl({
                params: {
                    id: row.id
                }
            }).then(res => {
                this.musicUrl = res
                this.$root.$children[0].addMusic(res)
            })
        },
    },
    watch: {
        '$route':{
            handler(newVal){
                this.search(newVal.query.q)
            }
        }
    },
    mounted(){
        this.search(this.$route.query.q)
    }
})
</script>

<style lang="less" scoped>
    .title{
        font-weight: 600;
        text-align: left;
        font-size: 30px;
        .titleText{
            font-size: 15px;
            color: rgb(90, 90, 90);
            font-weight: 400;
        }
    }
    .thStyle{
        border: none;
    }
    #song{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0px;
        padding: 30px 0px;

    }
    #mv{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 30px 0px;
    }
</style>

<style lang="less">
    .is-leaf{
        border: none!important;
    }
    .el-table__row{
        cursor: pointer;
    }
</style>