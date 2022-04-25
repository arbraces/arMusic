<template>
    <div class="musicplayer">
        <aplayer :audio="audio" :lrcType="0" :volume="0.3" />
    </div>
</template>

<style lang="less" scoped>
    .musicplayer{
        width: 100vw;
        bottom: 0px;
        left: 0px;
        position: fixed;
        z-index: 1000;
    }
    .aplayer{
        margin: 0px;
        padding: 0px;
    }
    .aplayer, .aplayer-withlrc,  .aplayer-info{
        padding: 10px 30px 0 7px!important;
    }
    .aplayer-list li{
        padding: 0px 25px!important;
    }
</style>

<script>
import axios from "../api/axios.js";


export default({
    data(){
        return {
            audio: [{
                name: '海阔天空',   //歌名
                artist: '黄家驹',  //歌手名
                url: 'https://music.bookbook.cc/mp3/海阔天空.mp3',   //音乐播放组件音乐的地址 
                cover: '', //图片的地址
            },],
            se: false
        }
    },
    props: ['musicdata'],
    watch: {
        musicdata:{
            handler(newVal){
                if(newVal.data){
                    axios.getMusic({
                        url: `/song/detail`,
                        params: {
                            ids: newVal.data.data[0].id,
                        }
                    }).then((res) => {
                        this.audio.forEach(item => {
                            if(item.id == newVal.data.data[0].id){
                                this.se = true
                            }
                        });
                        if(this.se == true){
                            this.Alertwarn('添加失败','此歌曲已存在列表')
                        }else{
                            this.audio.push({
                                id: newVal.data.data[0].id,
                                name: res.data.songs[0].name,
                                artist: res.data.songs[0].ar[0].name,
                                url: newVal.data.data[0].url,
                                cover: res.data.songs[0].al.picUrl,
                            })
                            this.Alertright('添加成功','歌曲已添加在列表')
                        }
                        this.se = false
                    })
                }else {
                    newVal.forEach(val => {
                        axios.getMusic({
                        url: `/song/detail`,
                        params: {
                            ids: val.id,
                        }
                    }).then((res) => {
                        this.audio.forEach(item => {
                            if(item.id == val.id){
                                this.se = true
                            }
                        });
                        if(this.se == true){
                        
                        }else{
                            this.audio.push({
                                id: val.id,
                                name: res.data.songs[0].name,
                                artist: res.data.songs[0].ar[0].name,
                                url: val.url,
                                cover: res.data.songs[0].al.picUrl,
                            })
                        }
                            this.se = false
                        })
                    })
                }
            }
        },
    },
    computed: {

    },
    methods:{
        Alertwarn(val, text) {
            const h = this.$createElement;
                this.$notify({
                title: val,
                type: 'warning',
                message: h('p', { style: 'color: balck'}, text)
            });
        },  
        Alertright(val, text){
            this.$notify({
                title: val,
                message: text,
                type: 'success'
            });
        }
    },
})
</script>
