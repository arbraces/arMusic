<template>
  <div id="app">
    <!-- 导航栏组件 -->
    <div class="headerAfter"></div>
    <div class="header">
      <header-com></header-com>
    </div>

    <main class="main">
      <!-- 侧边栏组件 -->
      <div class="articleAfter"></div>
      <div class="article">
        <article-com></article-com>
      </div>

      <!-- 主要显示区 -->
      <aside class="aside">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </aside>

      <!-- 播放器组件 -->
      <music-player-com ref="aplayer" v-if="true" :musicdata="musicData"></music-player-com>
    </main>
  </div>
</template>


<style lang="less">
  @themeColor: #EE0000;
  html, body{
    width: 100%;
    height: 100%;
  }
  *{
    font-family: "microsoft yahei";
    margin: 0px;
    padding: 0px;
  }
  .headerAfter{
    width: 100%;
    height: 8%;
  }
  .header{
    position: fixed;
    top: 0px;
    z-index: 100;
  }
  #app{
    height: 100%;
  }
  .main{
    display: flex;
    height: 92%;
    .articleAfter{
      width: 15vw;
      transition: .3s;

    }
    .article{
      position: fixed;
      z-index: 100;
    }
  }
  .aside{
    width: 100%;
    text-align: center;
    height: 100%;
    padding: 1% 0%;
    box-sizing: border-box;
    max-width: 1100px;
    margin: 0px auto;
    box-sizing: content-box;
  }
  .el-icon-caret-right{
      font-size: 20px;
      color: @themeColor;
  }
</style>

<script>
//导航栏组件
import headerCom from './components/headerCom.vue';
//侧边栏组件
import articleCom from './components/articleCom.vue'
//音乐播放器组件
import musicPlayerCom from './components/musicPlayerCom.vue';

export default {
  components:{
    headerCom,
    articleCom,
    musicPlayerCom,
  },
  data(){
    return {
      musicData: ""
    }
  },
  methods:{
    //添加音乐
    addMusic(obj){
      if(obj){
        this.musicData = obj
      }
    },
    //弹窗提示
    AlertRight(text,titel) {
        this.$notify({
          title: titel,
          message: text,
          type: 'success'
        });
      },
  },
  watch: {
    $route(to, from){
      this.$children[1].articleAOn()
      if(to.name == "Search"){
        //搜索框的路由
        
      }
    }
  },
  beforeMount() {

  },
  mounted() {
    let athis = this
    //ctrl+空格实现
    window.addEventListener("keyup", function(e){
      if(e.ctrlKey && e.code == "Space"){
        try{
          athis.$refs.aplayer.$children[0].toggle();
        }catch(e){
          
        }
      }
    })
    this.AlertRight("","CTRL + 空格 可暂停播放音乐")
  }, 
}
</script>
