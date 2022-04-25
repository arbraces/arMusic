<template>
  <div class="Home">
    <!-- 轮播图组件 -->
    <el-carousel :interval="4000" type="card" height="230px">
      <el-carousel-item v-for="(item,index) in this.homeLbtData.length" :key="item">
        <h3 class="medium"><img id="LbtImg" @click="lbtClick(homeLbtData[index])" :src="homeLbtData[index].pic" alt=""></h3>
      </el-carousel-item>
    </el-carousel>

    <div class="RecommendedSongList">
      <p class="Hometitle">推荐歌单</p>
      <div class="song">
        <!-- 推荐歌单组件 -->
        <song-sheet-com :marding="margin" :recData="recommendsongSheetData" :index="index" v-for="(item, index) in recommendsongSheetData" :key="index"></song-sheet-com>
      </div>
    </div>

    <div class="newestMusic">
      <p class="Hometitle">最新音乐</p>
      <!-- 最新音乐组件 -->
      <div class="newestMusicContent">
          <newest-music-com :newestMusicData="newestMusicData" :index="index" v-for="(item, index) in newestMusicData" :key="index"></newest-music-com>
      </div>
    </div>

    <div class="recommendMv">
      <p class="Hometitle">推荐MV</p>
        <div class="recommendMvContent">
          <recommendMvCom :recmvdata="recommendedmvdata" v-for="(item, index) in recommendedmvdata" :index="index" :key="index"></recommendMvCom>
        </div>
    </div>

    <!-- 给播放组件留位置 -->
    <div class="musicPlayerCom"></div>
  </div>
</template>

<style lang="less" scoped>
  .Home{
    text-align: left;
    .Hometitle{
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 1%;
      margin-top: 3%;
    }
  }
  .RecommendedSongList{
    .song{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0px;
    }
  }
  .medium{
    width: 100%;
    height: 100%;
    #LbtImg{
      width: 100%;
      height: 100%;
    }
  }
  .newestMusicContent{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    .newestMusicleft{
      width: 50%;
    }
    .newestMusicright{
      width: 50%;
    }
  }
  .recommendMvContent{
    display: flex;
    justify-content: space-between;
  }
  .musicPlayerCom{
    height: 100px;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 230px;
    margin: 0;
  }
  .el-carousel__item{
    border-radius: 10px;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>

<script>
import axios from "../api/axios.js"
import songSheetCom from '../components/songSheetCom.vue'
import newestMusicCom from '../components/newestMusicCom.vue'
import recommendMvCom from '../components/recommendedMvCom.vue'

export default ({
  components:{
    songSheetCom,
    newestMusicCom,
    recommendMvCom,
  },
  data(){
    return {
      //用于存放首页轮播图的数据
      homeLbtData: '',
      //轮播图调用这个对象来初始化
      // homeLbtNew: []

      //推荐歌单数据
      recommendsongSheetData: '',

      //最新音乐数据
      newestMusicData: '',

      //推荐mv数据
      recommendedmvdata: '',

      //边距数据
      margin: 'margin-bottom: 20px;'
    }
  },
  beforeMount(){
    //获取首页轮播图的数据并调用相关函数对数据进行处理
    axios.postMusic({
      url: 'homepage/block/page',
    }).then((res)=>{
      this.homeLbtData = res.data.data.blocks[0].extInfo.banners
    })
    //获取最新歌单数据
    axios.getMusic({
      url: '/personalized?limit=10'
    }).then((res) => {
      this.recommendsongSheetData = res.data.result
    })
    //获取最新歌曲数据
    axios.getMusic({
      url: '/personalized/newsong',
    }).then((res) => {
      this.newestMusicData = res.data.result
    })
    //获取推荐mv数据
    axios.getMusic({
      url: '/personalized/mv',
    }).then((res)=>{
        this.recommendedmvdata = res.data.result
    })
    this.$alert('本站仅供学习使用，且不以盈利为目的，如有侵权，联系删除','提示')
  },
  methods: {
    lbtClick(data){
      if(data.typeTitle == "新歌首发"){
        //获取歌的url
        axios.getMusicUrl({
          params: {
            id: data.targetId
          }
        }).then(res => {
            this.$root.$children[0].addMusic(res)
        })
      }else if(data.typeTitle == "数字专辑" || data.typeTitle == "活动"){
        window.open(data.url)
      }else if(data.typeTitle == "新碟首发"){
        //还没想好怎么处理
      }else if(data.typeTitle == "直播"){
        //还没想好怎么处理
      }else if(data.typeTitle == "专区"){
        window.open(data.url)
      }else if(data.typeTitle == "MV首发"){
        this.$router.push({path: '/Mv?id='+data.targetId})
      }else if(data.typeTitle == "点播"){
        this.$router.push({path: '/Mv?id='+data.targetId})
      }
    }
    //对首页轮播图的数据进行处理的函数
    // setHomePageBanner(obj){
    //   obj.forEach(val => {
    //     if(obj[val].typeTitle == "歌单"){
    //       //歌单(targetId对象)
          
    //     }else if(obj[val].typeTitle == "新歌首发"){
    //       //新歌首发(song对象)

    //     }else if(obj[val].typeTitle == "活动"){
    //       //活动(url对象)

    //     }else if(obj[val].typeTitle == "专区"){
    //       //专区(url对象)

    //     }else if(obj[val].typeTitle == "新碟首发"){
    //       //新碟首发(targetId对象)

    //     }
    //   });
    },
})
</script>
