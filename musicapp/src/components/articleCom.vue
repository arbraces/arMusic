<template>
    <div class="article">
        <!-- 侧边栏的显示内容 -->
        <div class="Article-content">
            <router-link class="Article-a" id="Home" @click.native="articleAOn" to="/">发现音乐</router-link>
            <router-link class="Article-a" id="RecommendMusicList" @click.native="articleAOn" to="RecommendMusicList">推荐歌单</router-link>
            <router-link class="Article-a" id="NewestMusic" @click.native="articleAOn" to="NewestMusic">最新音乐</router-link>
            <router-link class="Article-a" id="NewastMv" @click.native="articleAOn" to="NewastMv">最新MV</router-link>
        </div>

        <!-- 侧边栏的按钮 -->
        <div class="Article-button">
            <div @click="aritlceOn()">
                <img id="Article-img" src="../assets/image/左.png">
            </div>
        </div>
    </div>
</template>


<style scoped lang="less">
    .article{
        position: relative;
        height: 100vh;
        display: flex;

        .Article-content{
            width: 15vw;
            box-shadow: 0px 20px 10px rgba(0, 0, 0, 0.445);
            height: 100%;
            transition: .3s;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .Article-a{
                @articlea: 60px;
                height: @articlea;
                line-height: @articlea;
                text-decoration: none;
                color: initial;
                overflow: hidden;
                text-align: center;
                font-size: 18px;
                cursor: pointer;
                transition: .2s;
            }
            .Article-a:hover{
                background-color: rgba(0, 0, 0, .1);
            }
        }
        .Article-button{
            cursor: pointer;
            div{
                display: inline-block;
                width: 40px;
                border-radius: 0px 15px 15px 0px;
                background-color: rgb(#909399);
                img{
                    width: 100%;
                }
            }
            div:hover{
                transition: .2s;
                background-color: rgb(#abaeb6);
            }
        }
    }
</style>

<script>
import leftPng from '../assets/image/左.png'
import rightPng from '../assets/image/右.png'

export default {
    data(){
        return {
            //默认侧边栏是否展开
            ifShow: true,
        }
    },
    mounted(){
        if(document.querySelector(`#${this.$route.name}`)){
            document.querySelector(`#${this.$route.name}`).style.color = "#EE0000"
        }
    },
    methods: {
        //当侧边栏的回收按钮被点击就执行下面的函数
        aritlceOn(){
            this.ifShow = !this.ifShow
            if(this.ifShow){
                document.querySelector('.Article-content').style.width ='15vw'
                document.querySelector('.articleAfter').style.width = '15vw'
                document.querySelector('#Article-img').src = leftPng
            }else{
                document.querySelector('.Article-content').style.width ='0vw'
                document.querySelector('.articleAfter').style.width = '0vw'
                document.querySelector('#Article-img').src = rightPng
            }
        },
        //侧边栏的文字被点击就变色
        articleAOn(){
            if(document.querySelector(`#${this.$route.name}`)){
                document.querySelectorAll('.Article-a').forEach(i => i.style.color = 'initial')
                document.querySelector(`#${this.$route.name}`).style.color = "#EE0000"
            }
        }
    },
}
</script>