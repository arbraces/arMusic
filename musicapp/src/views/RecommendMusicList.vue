<template>
    <div class="recommendMusiclist">
        <div class="relistheader">
            <div class="reslistHeaderleft">
                <span class="reslistHeaderleftspan">
                    <span class="reslistHeaderleftspan-image">
                        <el-image
                        style="width: 160px; height: 160px; border-radius: 10px;"
                        :src="reslistHeaderData.coverImgUrl"
                        :fit="fits[fits.length]"></el-image>
                    </span>
                </span>
            </div>
            <div class="reslistHeaderright">
                <span class="reslistHeaderrightSpan">
                    精品歌单
                </span>
                <p>{{reslistHeaderData.name}}</p>
                <p>{{reslistHeaderData.description}}</p>
            </div>
        </div>

        <div class="reslistTab">
            <span class="item" id="all" @click="classSongSheet('全部',$event)">全部</span>
            <span class="item" id="hy" @click="classSongSheet('华语',$event)">华语</span>
            <span class="item" id="om" @click="classSongSheet('欧美',$event)">欧美</span>
            <span class="item" id="lx" @click="classSongSheet('流行',$event)">流行</span>
            <span class="item" id="sc" @click="classSongSheet('说唱',$event)">说唱</span>
            <span class="item" id="yg" @click="classSongSheet('摇滚',$event)">摇滚</span>
            <span class="item" id="my" @click="classSongSheet('民谣',$event)">民谣</span>
            <span class="item" id="dz" @click="classSongSheet('电子',$event)">电子</span>
            <span class="item" id="qyy" @click="classSongSheet('轻音乐',$event)">轻音乐</span>
            <span class="item" id="ysys" @click="classSongSheet('影视原声',$event)">影视原声</span>
            <span class="item" id="acg" @click="classSongSheet('ACG',$event)">ACG</span>
            <span class="item" id="hj" @click="classSongSheet('怀旧',$event)">怀旧</span>
        </div>

        <div class="reslistContent">
            <song-sheet style="margin-top:30px" :recData="ptionSongComData" :index="index" v-for="(item,index) in ptionSongComData" :key="index"></song-sheet>
        </div>
        
        <!-- 分页组件 -->
        <div class="pagination">
            <el-pagination
                layout="prev, pager, next"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
                :total="chu">
            </el-pagination>
        </div>
        <!-- 给播放组件留位置 -->
        <div class="musicPlayerCom"></div>
    </div>
</template>

<style lang="less" scoped>
    .relistheader{
        overflow: hidden;
        height: 200px;
        background-color: rgba(0, 0, 0, .4);
        border-radius: 10px;
        display: flex;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    }
    // .reslistHeaderleft{

    // }
    .reslistHeaderright{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 20px;
        cursor: default;
        .reslistHeaderrightSpan{
            color: #dfac67;
            border: 1px solid #dfac67;
            padding: 3px;
            border-radius: 2px;
        }
        p:nth-of-type(2n-1){
            color: white;
        }
        p:nth-of-type(2n){
            font-size: 14px;
            color: rgb(61, 61, 61);
            text-align: left;
            height: 76px;
            overflow: hidden;
        }
    }
    .reslistTab{
        width: 100%;
        padding: 10px 0px;
        display: flex;
        justify-content: right;
        .item{
            cursor: pointer;
            margin-right: 20px;
            color: #808080;
        }
        .item:nth-of-type(1){
            color: #EE0000;
        }
    }
    .reslistContent{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 30px;
    }
    .pagination{
        margin-top: 30px;
        margin-bottom: 0px;
    }
    .musicPlayerCom{
        height: 100px;
    }
</style>

<script>

import axios from "../api/axios.js"
import songSheet from "../components/songSheetCom.vue"


export default ({
    components: {
        songSheet,
    },
    data(){
        return {
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            reslistHeaderData: '',
            //歌单数据
            songComData: [],
            //用于分页的歌单数据
            ptionSongComData: [],
            //分页的初始页
            currentPage: 1,
        }
    },
    computed: {
        chu(){
            return Math.floor((this.songComData.length / 10))*10
        }
    },
    methods: {
        //当分页的页时发生改变时执行下面的函数
        handleCurrentChange(val){
            this.handleSongComData(val);
        },
        //处理歌单数据
        handleSongComData(val){
            if(this.songComData){
                if(this.songComData.slice((val-1)*10, val*10).length == 10){
                    this.ptionSongComData = this.songComData.slice((val-1)*10, val*10)
                }
            }else{
                console.warn('歌单数据为空');
            }
        },
        //请求分类歌单的数据如(华语，流行，说唱等分类歌单)
        classSongSheet(val,event){
            //当分类标签被点击时，自己的颜色变红，循环把其他分类标签变色
            document.querySelectorAll('.item').forEach(item => {
                if(item.id !== event.srcElement.id){
                    document.querySelector(`#${item.id}`).style.color = '#808080'
                }else{
                    document.querySelector(`#${item.id}`).style.color = '#EE0000'
                }
            });
            //获取头部信息
            axios.getMusic({
                url: `/top/playlist/highquality?limit=1&cat=${val}`
            }).then((res) => {
                this.reslistHeaderData = res.data.playlists[0]
            })
            //获取歌单并对数据进行处理
            axios.getMusic({
                url: `/top/playlist/highquality?cat=${val}&imit=100`
            }).then((res) => {
                this.songComData.splice(0,this.songComData.length)
                res.data.playlists.forEach(val => {
                    this.songComData.push({
                        picUrl: `${val.coverImgUrl}`,
                        name: `${val.name}`,
                        id: `${val.id}`    
                    })
                });
                //获取歌单的时候调用这个函数，对歌单数据进行一个初始化处理
                this.handleSongComData(this.currentPage);
                this.currentPage = 1
            })
        }
    },
    beforeMount(){
        //获取头部信息(图片和文本相关的内容)
        axios.getMusic({
            url: '/top/playlist/highquality?limit=1'
        }).then((res) => {
            this.reslistHeaderData = res.data.playlists[0]
        })
        //获取歌单
        axios.getMusic({
            url: '/top/playlist?limit=100'
        }).then(res => {
            res.data.playlists.forEach(val => {
                this.songComData.push({
                    picUrl: `${val.coverImgUrl}`,
                    name: `${val.name}`,
                    id: `${val.id}`
                })
            });
            //获取歌单的时候调用这个函数，对歌单数据进行一个初始化处理
            this.handleSongComData(this.currentPage);
        })
    }
})
</script>
