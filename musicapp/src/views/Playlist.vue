<template>
  <div class="palylist">
      <!-- 表头 -->
      <div class="pltTitle" v-if="playlistData">
          <!-- 图片 -->
          <img class="platTitleLeftImg" :src="playlistData.playlist.coverImgUrl" alt="">
          <div class="pltTitleRight">
              <div>
                  <!-- 歌单的名字 -->
                  <p class="rightTitle">{{playlistData.playlist.name}}</p>
              </div>
              <div class="createUser">
                <!-- 创建歌单者的信息(头像id创建时间等) -->
                <img :src="playlistData.playlist.creator.avatarUrl" alt="">
                <span style="margin-right: 10px">{{playlistData.playlist.creator.nickname}}</span>
                <span style="color: grey">{{formatTime(playlistData.playlist.createTime)+' 创建'}}</span>
              </div>
              <div class="btn">
                  <!-- 两个按钮 -->
                  <button id="repAll" @click="addAll" title="替换播放列表">播放全部</button>
                  <button id="addAll" @click="addAll" title="添加到播放列表">+</button>
              </div>
              <div class="lable">
                  <span>标签：</span>
                  <p v-for="item,index in playlistData.playlist.tags" :key="index">{{item}}&nbsp;</p>
              </div>
              <div class="songPlay">
                  <span style="margin-right: 30px">歌曲：<span style="color: grey">{{playlistData.playlist.trackCount}}</span></span>
                  <span>播放：<span style="color: grey">{{playlistData.playlist.playCount}}</span></span>
              </div>
              <div class="introduction">
                  <p>简介：</p>
                  <span>{{playlistData.playlist.description}}</span>
              </div>
          </div>
      </div>

      <!-- 导航栏区域 -->
      <div class="pltNav">
        <div style="margin-top:30px" class="seaNav">
            <el-menu active-text-color="#EE0000" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">歌曲列表</el-menu-item>
                <el-menu-item index="2">评论({{totalComment+hotComment.length}})</el-menu-item>
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
      </div>

      <!-- 评论区 -->
      <div class="content" v-if="activeIndex === '2'">
        <p class="wonderfulCom" v-if="isshow">精彩评论({{hotComment.length}})</p>
        <div class="comc" v-if="isshow">
            <comment class="com" :commentData="pdefCommentData[index]" v-for="(item,index) in pdefCommentData.length" :key="pdefCommentData[index].id"></comment>
        </div>
        <p id="newComm" class="wonderfulCom">最新评论({{totalComment}})</p>
        <div class="comc">
            <comment class="com" :commentData="propsCommentData[index]" v-for="(item,index) in propsCommentData.length" :key="propsCommentData[index].id"></comment>
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
      </div>


      <!-- 给播放组件留位置 -->
    <div style="height: 100px"></div>
  </div>
</template>

<script>
import axios from '../api/axios.js'
import comment from '../components/commentCom.vue'
export default {
    components: {
        comment,
    },
    data(){
        return {
            //歌单id
            sid: '',
            //歌单数据
            playlistData:"",
            //默认选中的导航栏
            activeIndex: '1',
            /*
                表格数据参数说明:
                id: 歌曲的id,
                data: 歌曲的名称,
                name: 歌手的名称,
                address: 专辑的名称,
                time: 歌曲的时间
            */
            tableData: [],

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
        }
    },
    computed: {
        //分页数据的总数
        chu(){
            return Math.floor((this.totalComment / 10)) * 10
        }
    },
    methods: {
        //获取歌单的详细
        getplayListData(id){
            axios.getMusicList({
                params: {
                    id: id,
                }
            }).then(res => {
                this.playlistData = res.data
                //调用函数获取歌的列表
                this.getpltList(res.data.playlist.trackIds)
            })
        },
        // 获取评论的(需要传入一个歌单id,还有偏移量)
        getComment(comid, limit=10, offset=0){
            axios.getMusic({
                url: 'comment/playlist',
                params: {
                    /* 
                        参数说明
                        id:歌单id
                        limit: 取出评论的数量
                        offset:偏移量,用于分页
                    */
                    id: comid,
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
                    this.isshow = false
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
        //格式化歌曲时间(传入一个时间戳)
        formatMusicTime(time){
            if(Math.floor(time/1000%60) < 10){
                return `${Math.floor(time/1000/60)}:0${Math.floor(time/1000%60)}`
            }else{
                return `${Math.floor(time/1000/60)}:${Math.floor(time/1000%60)}`
            }
        },
        //导航栏被点击
        handleSelect(val){
            this.activeIndex = val
        },
        // 请求歌曲的详细数据(传入一个trackIds对象)
        getpltList(trackids){
            let arr = []
            trackids.forEach(item => {
                item.id
                arr.push(item.id)
            })
            axios.getMusic({
                url: 'song/detail',
                params: {
                    ids: arr.join(),
                },
            }).then(res => {
                res.data.songs.forEach(val => {
                    this.tableData.push({
                        id: val.id,
                        date: val.name,
                        name: val.ar[0].name,
                        address: val.al.name,
                        time: this.formatMusicTime(val.dt)
                    })
                })
            })
        },
        //当表格被点击的时候执行下面的函数
        Tableclick(val){
            axios.getMusicUrl({
                params: {
                    id: val.id
                }
            }).then(res => {
                this.$root.$children[0].addMusic(res)
            })
        },
        //表格的索引
        indexMethod(index) {
            return index+1;
        },
        //当分页的页发生改变时执行下面的函数
        handleCurrentChange(val){
            window.scrollTo(0, document.querySelector('#newComm').offsetTop-70)
            this.getComment(this.sid, 10, val)
        },
        //添加全部按钮被点击
        addAll(){
            let arr = []
            if(this.tableData.length){
                this.tableData.forEach(item => {
                    arr.push(item.id)
                })
                axios.getMusicUrl({
                    params: {
                        id: arr.join()
                    }
                }).then(res => {
                    this.$root.$children[0].addMusic(res.data.data)
                    this.Alertright('添加成功','已添加到列表')
                })
            }else{
                this.Alertwarn('添加失败','错误代码0001 请联系管理员进行维护')
            }
        },
        //警告弹框需要传入两个参数(一个是标题，还有一个是内容)
        Alertwarn(val, text) {
            const h = this.$createElement;
                this.$notify({
                title: val,
                type: 'warning',
                message: h('p', { style: 'color: balck'}, text)
            });
        }, 
        //正确弹窗需要传入两个参数(一个是标题，还有一个是内容)
        Alertright(val, text){
            this.$notify({
                title: val,
                message: text,
                type: 'success'
            });
        }
    },
    mounted(){
        //通过路由获取id并且调用axios请求获取歌单的详细数据
        this.sid = this.$route.query.q
        this.getplayListData(this.sid)
        this.getComment(this.sid)
    },
    watch: {
        '$route':{
            handler(newVal){
                if(newVal.name == "Playlist"){
                    this.sid = newVal.query.q
                    this.getplayListData(this.sid)
                    this.getComment(this.sid)
                }
            }
        }
    },
}
</script>

<style lang="less">
    //头部的高度
    @hei: 230px;
    //头部右边的统一高度
    @rightMari: 15px 0;
    .platTitleLeftImg{
        width: @hei;
        height: @hei;
        margin-right: 50px;
    }
    .pltTitle{
        display: flex;
        .pltTitleRight{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            height: @hei;
            overflow: hidden;
            justify-content: center;
            button{
                background-color: #e85e4d;
                border: none;
                color: white;
                height: 30px;
                margin-right: 3px;
                padding: 0px 15px;
                cursor: pointer;
            }
            #repAll{
                border-radius: 10px 0px 0px 10px;
            }
            #addAll{
                border-radius: 0px 10px 10px 0px;
            }
            .rightTitle{
                font-weight: 600;
                font-size: 20px;
            }
        }
    }
    //头部标题
    .rightTitle{
        font-size: 17px;
    }
    //用户信息
    .createUser{
        display: flex;
        align-items: center;
        margin: @rightMari;
        img{
            width: 35px;
            height: 35px;
            border-radius: 50px;
            margin-right: 4px;
        }
    }
    //按钮
    .btn{
        // margin: @rightMari;
        margin-bottom: 10px;
    }
    //标签
    .lable{
        display: flex;
        margin: 2px 0px;
    }
    //歌曲和播放
    .songPlay{
        margin: 3px 0px;
    }
    //简介
    .introduction{
        margin: 3px 0px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        p{
            display: inline;
        }
        span{
            color: grey;
        }
    }
    //精彩评论标题
    .wonderfulCom{
        text-align: left;
        font-size: 18px;
        margin: 15px 0px;
    }
    //最新评论
    .wonderfulCom:nth-of-type(2){
        margin-top: 50px;
    }
    //评论组件
    .com{
        margin-top: 30px;
    }
    .bfulcom:last-child .comRight{
        border: none;
    }
    .com:last-child .comRight{
        border: none;
    }
</style>