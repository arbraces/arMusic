<template>
    <div class="newestMusic">
        <div class="nesHeader">
            <span class="item" @click="newMusicRes(0,$event)">全部</span>
            <span class="item" @click="newMusicRes(7,$event)">华语</span>
            <span class="item" @click="newMusicRes(8,$event)">日本</span>
            <span class="item" @click="newMusicRes(16,$event)">韩国</span>
        </div>

        <div class="nesContent">
            <template>
                <el-table
                    :data="tableData"
                    stripe
                    @row-click="tableClick"
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="imgUrl"
                    heigth="94"
                    width="130">
                        <img class="Nesimgurl" style="width: 70px; height: 70px" src=""  alt="">
                    </el-table-column>
                    <el-table-column
                    prop="data" 
                    label="音乐标题"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="歌手"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="album"
                    label="专辑">
                    </el-table-column>
                    <el-table-column
                    prop="musicTime"
                    label="时长">
                    </el-table-column>
                </el-table>
            </template>
        </div>

        <!-- 给播放组件留位置 -->
        <div style="height: 100px"></div>
    </div>
</template>

<style lang="less" scoped>
    .newestMusic{
        width: 100%;
    }
    .nesHeader{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin: 20px 0px;
    }
    .item{
        margin-right: 20px;
        color: #808080;
        cursor: pointer;
    }
</style>

<script>
import axios from '../api/axios.js'


export default ({
    data(){
        return{
            tableData: [],
            num: 0,
        }
    },
    methods: {
        //格式化时间函数
        formatTime(time){
            if(Math.floor(time/1000%60) < 10){
                return `${Math.floor(time/1000/60)}:0${Math.floor(time/1000%60)}`
            }else{
                return `${Math.floor(time/1000/60)}:${Math.floor(time/1000%60)}`
            }
        },
        //请求最新音乐数据函数
        newMusicRes(num,el){
            if(num === 0){
                axios.getMusic({
                    url: "/personalized/newsong"
                }).then((res) => {
                   this.tableData.splice(0, this.tableData.length)
                    res.data.result.forEach((item) => {
                        //格式化时间
                        item.song.mMusic.playTime = this.formatTime(item.song.mMusic.playTime)
                        this.tableData.push({
                            'imgUrl': item.picUrl,
                            'data': item.name,
                            'name': item.song.album.artists[0].name,
                            'album': `《${item.song.album.name}》`,
                            'musicTime': item.song.mMusic.playTime,
                        })
                    })
                })
            }else{
                axios.getMusic({
                    url: `/top/song?type=${num}&limit=10`
                }).then((res) => {
                    this.tableData.splice(0, this.tableData.length)
                    for(let i = 0; i < 10; i++){
                        this.tableData.push({
                            'id': res.data.data[i].id,
                            'imgUrl': res.data.data[i].album.picUrl,
                            'data': res.data.data[i].name,
                            'name': res.data.data[i].artists[0].name,
                            'album': `《${res.data.data[i].album.name}》`,
                            'musicTime': this.formatTime(res.data.data[i].bMusic.playTime),
                        })
                    }
                })
                
            }
            document.querySelectorAll('.item').forEach((val,index) => {
                val.style.color = "#808080"
            })
            // el.style.color = "#EE0000"
            el.target.style.color = "#EE0000"
        },
        //当表格被点击
        tableClick(row){
            axios.getMusicUrl({
                params: {
                    id: row.id
                }
            }).then(res => {
                this.$root.$children[0].addMusic(res)
            })
        }
    },
    mounted(){
        //获取最新音乐
        axios.getMusic({
            url: '/personalized/newsong'
        }).then((res) => {
            this.tableData.splice(0, this.tableData.length)
            res.data.result.forEach((item) => {
                //格式化时间
                item.song.mMusic.playTime = this.formatTime(item.song.mMusic.playTime)
                this.tableData.push({
                    'id': item.id,
                    'imgUrl': item.picUrl,
                    'data': item.name,
                    'name': item.song.album.artists[0].name,
                    'album': `《${item.song.album.name}》`,
                    'musicTime': item.song.mMusic.playTime,
                })
            })
            document.querySelectorAll('.item')[0].style.color = "#EE0000"
        })
    },
    updated(){
        document.querySelectorAll('.Nesimgurl').forEach((item,index) => {
            item.src = this.tableData[this.num].imgUrl
            //需要让第0个index和第一个index值是一样的
            if(index == 0){
                item.src = this.tableData[this.num].imgUrl
            }else{
                item.src = this.tableData[this.num].imgUrl
                this.num++
            }
        })
        this.num = 0
    },
})
</script>


