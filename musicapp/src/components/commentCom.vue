<template>
  <div class="comment">
      <div class="comContent">
          <img class="comImg" :src="commentData.img" alt="">
          <div class="comRight">
                <div class="text">
                    <span class="username">{{commentData.name}}:&nbsp;&nbsp;</span>
                    <span class="text">{{commentData.text}}</span>
                </div>
                <div class="reply" v-if="commentData.isbeReplied">
                    <span class="replyUsername">{{commentData.beReplied.replyName}}:&nbsp;&nbsp;</span>
                    <span class="replyText">{{commentData.beReplied.replyText}}</span>
                </div>
                <div>
                    <p class="time">{{commentData.time}}</p>
                </div>
          </div>
      </div>
  </div>
</template>

<script>
import img from '../assets/image/音乐.png'
export default {
    props: {
        commentData:{
            default(){
                return {
                    /*
                        传入参数说明
                        id: 用户的id,
                        img: 用户的头像,
                        name: 用户的名称,
                        text: 用户的评论内容,
                        isbeReplied: 是否是回复内容,
                        beredlied: 用户回复的内容
                    */
                    id: 163,
                    img: img,
                    name: '163braces',
                    text: '评论的默认值',
                    time: '2021/8/7',
                    // isbeReplied: false,
                    beReplied: {
                        replyName: '爱喝柳枝',
                        replyText: '柠檬树上柠檬果',
                    },
                }
            },
        }
    },
    data() {
        return {
            
        }
    },
}
</script>

<style lang="less" scoped>
    //整体内容
    .comContent{
        display: flex;
        cursor: default;
    }
    //右边的区域
    .comRight{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 20px;
        width: 100%;
        border-bottom: 1px solid #cecece;
    }
    //用户头像
    .comImg{
        width: 50px;
        height: 50px;
        border-radius: 50px;
        margin-right: 10px;
    }
    //用户名
    .username{
        color: #517EAF;
    }
    //回复的内容
    .reply{
        width: 100%;
        text-align: left;
        background-color: #e6e5e6;
        padding: 10px;
        border-radius: 5px;
        margin: 5px 0px;
        font-size: 15px;
        box-sizing: border-box;
        .replyUsername{
            color: #517EAF;
        }
    }
    //时间
    .time{
        color: grey;
        font-size: 13px;
        margin-top: 5px;
    }
</style>