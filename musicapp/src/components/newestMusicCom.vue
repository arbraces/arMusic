<template>
    <div class="newestMusic" @mouseover="newestMusicOn" @mouseout="newestMusicOut" @click="newestMusicClick(newestMusicData[index].id)">
        <span class="newestMusic-el-image">
            <el-image
            style="width: 80px; height: 80px;"
            :src="newestMusicData[index].picUrl"
            fit="fill"></el-image>
            <div class="newestMusicAfter">
                <el-row class="newestMusicAfter-btn">
                    <el-button icon="el-icon-caret-right" size="medium" circle></el-button>
                </el-row>
            </div>
        </span>
        <div class="newestMusicText">
            <p class="newestMusicTop">{{newestMusicData[index].name}}</p>
            <p class="newestMusicBottom">{{newestMusicData[index].song.artists[0].name}}</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .newestMusic{
        display: flex;
        cursor: pointer;
        padding: 10px 0px;
        transition: .5s;
        width: 50%;
        .newestMusic-el-image{
            width: 80px;
            height: 80px;
            position: relative;
            .newestMusicAfter{
                position: absolute;
                width: 50%;
                height: 50%;
                top: 30%;
                left: 25%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
            }
            .newestMusicAfter-btn{
                font-size: 10px;
                opacity: 0;
                transition: .5s;
            }
        }
        .newestMusicText{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 10px;
            .newestMusicTop{
                font-size: 17px;
            }
            .newestMusicBottom{
                font-size: 15px;
                color: rgb(75, 75, 75);
            }
        }
    }
    .newestMusic:hover{
        background-color: rgba(0, 0, 0, .05);
    }
</style>

<script>
import axios from '../api/axios.js'
import jay from '../assets/image/以父之名.png'
export default {
    data(){
        return {
            url: jay,
        }
    },
    props: ['newestMusicData','index'],
    methods:{
        // 最新音乐播放按钮离开和经过按钮的触发效果
        newestMusicOn(el){
            this.$children[1].$el.style.opacity = '.9'
        },
        newestMusicOut(){
            this.$children[1].$el.style.opacity = '0'
        },
        //当组件被点击
        newestMusicClick(val){
            axios.getMusicUrl({
                params: {
                    id: val,
                }
            }).then(res => {
                this.$root.$children[0].addMusic(res)
            })
        }
    }
}
</script>