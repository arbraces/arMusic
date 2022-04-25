<template>
    <span @click="songSheetClick(recData[index].id)" :style="marding" class="songSheet">
        <span class="songSheet-image">
            <el-image
            style="width: 200px; height: 200px; border-radius: 10px;"
            :src="recData[index].picUrl"
            :fit="url[url.length]"></el-image>
            <el-row class="songSheet-btn">
                <el-button icon="el-icon-caret-right" size="medium" circle></el-button>
            </el-row>
        </span>
        <p class="songSheet-p">{{recData[index].name}}</p>
    </span>
</template>


<script>
import axios from 'axios'
  export default {
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    },
    props: ['recData','index','marding'],
    methods: {
        songSheetClick(id){
            this.$router.push({path:'/playlist',query:{q:id}})
        }
    }
  }
</script>

<style lang="less" scoped>
    span{
        display: inline-block;
    }
    .songSheet{
        overflow: hidden;
        width: 200px;
        height: 225px;
        .songSheet-image{
            cursor: pointer;
            display: block;
            border-radius: 10px;
            position: relative;
        }
        .songSheet-image:hover .songSheet-btn{
            opacity: .9;
        }
        .songSheet-btn{
            position: absolute;
            font-size: 20px;
            right: 2.5%;
            bottom: 5%;
            z-index: 100;
            opacity: .0;
            transition: .3s;
        }
    }
</style>