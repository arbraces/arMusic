<template>
    <div id="mv">
        <!-- 左边区域 -->
        <div class="mvdetails">
            <div class="mdTitle">
                <h3>mv详情</h3>
            </div>
            <!-- 视频区域 -->
            <div class="mdContent">
                <video id="video" :src="mvdata.url" controls="controls"></video>
                <div class="author">
                    <img class="authorImg" :src="mvSinger.img">
                    <span class="authorName">{{mvdata.artistName}}</span>
                </div>    
                <!-- 视频简介区域 -->
                <div class="authorTitle">{{mvdata.name}}</div>
                <div class="timeAndCount">
                    <span style="font-size: 15px" class="time">发布：{{mvdata.publishTime}}</span>&nbsp;&nbsp;
                    <span style="font-size: 15px" class="count">播放：{{mvdata.playCount}}</span>
                    <div class="introduce">
                        {{mvdata.desc}}
                    </div>    
                    <hr>
                    <!-- 评论区域 -->
                    <div class="comment" v-if="isshow">
                        <p class="wonderfulCom">精彩评论({{hotComment.length}})</p>
                        <div class="comc">
                            <comment class="com" :commentData="pdefCommentData[index]" v-for="(item,index) in pdefCommentData.length" :key="index"></comment>
                        </div>
                        <p id="newComm" class="wonderfulCom">最新评论({{totalComment}})</p>
                        <div class="comc">
                            <comment class="com" :commentData="propsCommentData[index]" v-for="(item,index) in propsCommentData.length" :key="index"></comment>
                        </div>
                    </div>
                    <div class="comment" v-if="!isshow">
                        <p class=notCombtn>
                            好像没有评论耶~
                        </p>
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
                    <div id="di" style="height: 100px"></div>
                </div>
            </div>
        </div>

        <!-- 右边相关推荐区域 -->
        <div class="recMv">
            <div class="rmTitle">
                <h3>相关推荐</h3>
                <div style="margin-top: 20px" class="rmContent">
                    <recommended-mv style="margin-bottom:30px" :recmvdata="recommendedmvdata" v-for="(item, index) in recommendedmvdata" :index="index" :key="index"></recommended-mv>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../api/axios.js'
import comment from '../components/commentCom.vue'
import recommendedMv from '../components/recommendedMvCom.vue'
export default {
    data(){
        return {
            //mv的id
            mvid: "",

            //mv的数据
            mvdata: {},

            //mv歌手的数据
            mvSinger: {},
            isshow: true,

            //最新评论的总数
            totalComment: 0,
            //精彩评论总数
            hotComment: 0,
            //分页的初始页
            currentPage: 0,
            //评论区数据(用于传给commentCom组件)
            propsCommentData: [],
            //精彩评论数据(用于传给commentCom组件)
            pdefCommentData: [],
            isshow: true,
            //推荐mv数据
            recommendedmvdata: [],
        }
    },
    methods: {
        //获取MV数据(需要传个id进来)
        getMvdata(id){
            axios.getMusic({
                url: "mv/detail",
                params: {
                    mvid: id
                }
            }).then(res => {
                this.getMvUrl(id)
                this.$set(this.mvdata, 'id',  res.data.data.artistId)
                this.$set(this.mvdata, 'name',  res.data.data.name)
                this.$set(this.mvdata, 'artistName',  res.data.data.artistName)
                this.$set(this.mvdata, 'publishTime',  res.data.data.publishTime)
                this.$set(this.mvdata, 'playCount',  res.data.data.playCount)
                this.$set(this.mvdata, 'desc',  res.data.data.desc)
                this.$set(this.mvSinger, 'id',  res.data.data.artistId)
                //获取Mv歌手的图片
                this.getAuthormv(this.mvSinger.id)
            })
        },
        //获取MVurl地址
        getMvUrl(id){
            axios.getMusic({
                url: 'mv/url',
                params: {
                    id: id,
                }
            }).then(url => {
                this.$set(this.mvdata, 'url', url.data.data.url)
            })
        },
        //获取歌手mv
        getAuthormv(id=this.mvSinger.id){
            axios.getMusic({
                url: 'artist/detail',
                params: {
                    id: id,
                }
            }).then(res => {
                this.$set(this.mvSinger, 'img', res.data.data.artist.cover)
            })
        },
        //获取评论
        getMvcomment(id=this.mv, limit=10, offset=0){
            axios.getMusic({
                url: 'comment/mv',
                params: {
                    /* 
                        参数说明
                        id: MV的id
                        limit： 取出评论的数量
                        offset: 偏移量，用于分页
                    */
                   id: id,
                   limit: limit,
                   offset: offset*10,
                }
            }).then(res => {
                //最新评论的总数
                this.propsCommentData.splice(0, this.propsCommentData.length)
                this.totalComment = res.data.total
                //精彩评论的总数
                if(res.data.hotComments){
                    this.hotComment = res.data.hotComments
                    res.data.hotComments.forEach(item => {
                        this.pdefCommentData.push({
                            id: item.commentId,
                            img: item.user.avatarUrl,
                            name: item.user.nickname,
                            text: item.content,
                            time: this.formatTime(item.time),
                            isbeReplied: false,
                            beReplied: "",
                        })
                    })
                    this.isshow = true
                }else{
                    // this.isshow = false
                }
                res.data.comments.forEach(item => {
                    if(item.beReplied.length){
                        this.propsCommentData.push({
                            id: item.commentId,
                            img: item.user.avatarUrl,
                            name: item.user.nickname,
                            text: item.content,
                            time: this.formatTime(item.time),
                            isbeReplied: true,
                            beReplied: {
                                replyName: item.beReplied[0].user.nickname,
                                replyText: item.beReplied[0].content,
                            },
                        })
                    }else{
                        this.propsCommentData.push({
                            id: item.commentId,
                            img: item.user.avatarUrl,
                            name: item.user.nickname,
                            text: item.content,
                            time: this.formatTime(item.time),
                            isbeReplied: false,
                            beReplied: "",
                        })
                    }
                })
            })
        },
        //格式化时间(传入一个时间戳)
        formatTime(time){
            let date = new Date(time)
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        },
        //当分页的页发生改变时执行下面的函数
        handleCurrentChange(val){
            console.log(document.querySelector('#newComm').offsetTop);
            window.scrollTo(0, document.querySelector('#newComm').offsetTop-70)
            this.getMvcomment(this.mvid, 10, val)
        },
        //获取相似Mv
        getSimiMv(id=this.mvid){
            axios.getMusic({
                url: 'simi/mv',
                params: {
                    mvid: id,
                }
            }).then(res => {
                this.recommendedmvdata.splice(0, this.recommendedmvdata.length)
                res.data.mvs.forEach(val => {
                    this.recommendedmvdata.push({
                        id: val.id,
                        picUrl: val.cover,
                        playCount: val.playCount,
                        name: val.name,
                        artistName: val.artistName
                    })     
                });
            })
        },
         addkey(num){
            return num + Math.floor(Math.random()*1000)+Math.floor(Math.random()*1000)
        }
    },
    watch: {
        '$route':{
            handler(newVal){
                if(newVal.name == "Mv"){
                    this.mvid = newVal.query.id
                    //获取mv的数据
                    this.getMvdata(this.mvid)

                    //获取相似Mv
                    this.getSimiMv(this.mvid)

                    //获取Mv评论
                    this.getMvcomment(this.mvid)
                }
            }
        }
    },
    mounted(){
        //挂在的时候获取路由得到mv的id
        this.mvid = this.$route.query.id

        //获取mv的数据
        this.getMvdata(this.mvid)

        //获取相似Mv
        this.getSimiMv(this.mvid)

        //获取Mv评论
        this.getMvcomment(this.mvid)
    },
    computed: {
        //分页数据的总数
        chu(){
            return Math.floor((this.totalComment / 10)) * 10
        },
    },
    components: {
        comment,
        recommendedMv,
    }
}
</script>

<style lang="less" scoped>
    #mv{
        display: flex;
        width: 100%;
    }
    //mv详情
    .mvdetails{
        width: 700px;
        margin-right: 35px;
        text-align: left;
        display: flex;
        flex-direction: column;
        .mdTitle{
            text-align: left;
        }
        .mdContent{
            width: 700px;
            height: 390px;
            margin-top: 20px;
            #video{
                width: 100%;
                height: 100%;
            }
            .authorTitle{
                font-size: 20px;
                margin-top: 20px;
                font-weight: 600;
            }
        }
    }

    //mv作者
    .author{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 10px 0px;
        .authorImg{
            object-fit: cover;
            border-radius: 70px;
            width: 60px;
            height: 60px;
            margin-right: 10px;
        }
    }
    //相关推荐
    .recMv{
        .rmTitle{
            text-align: left;
        }
    }
    .timeAndCount{
        margin: 15px 0px;
        color: grey;
    }
    .introduce{
        margin: 15px 0px;
        color: black;
    }
    //评论区
    //精彩评论标题
    .wonderfulCom{
        text-align: left;
        font-size: 20px;
        margin: 15px 0px;
        color: black;
    }
    //最新评论
    .wonderfulCom:nth-of-type(2){
        margin-top: 50px;
    }
    //评论组件
    .com{
        margin-top: 30px;
    }
    .com:last-child .comRight{
        border: none;
    }
    //没有评论的按钮
    .notCombtn{
        width: 100%;
        margin: 10px;
        color: #909399;
        font-size: 16px;
    }
    /deep/.recommendedmvcom{
        display: flex;
    }
</style>