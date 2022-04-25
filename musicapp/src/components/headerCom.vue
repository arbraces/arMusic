<template>
    <div class="header">
        <div class="log">Arbraces.cn</div>

        <div @keyup.enter="searchFun(searchVal)" class="search">
            <el-autocomplete id="searchInput"
                v-model="searchVal"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
                prefix-icon="el-icon-search"
            ></el-autocomplete>
        </div>

        <div class="lrBtn">
           <el-row id="home">
                <el-button @click="back" type="info" size='medium' circle icon="el-icon-arrow-left"></el-button>
                <el-button @click="to" type="info" size='medium' circle icon="el-icon-arrow-right"></el-button>
            </el-row>
        </div>

    </div>
</template>

<style scoped lang="less">
    @font-face {
        font-family: arcovede;
        src: url(../assets/font/Arcoverde.ttf);
    }
    .header{
        display: flex;
        font-size: 17px;
        height: 8%;
        width: 100vw;
        background-color: rgb(255, 255, 255);
        align-items: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

        .log{
            font-family: arcovede;
            font-size: 30px;
            margin-left: 2%;
            display: flex;
            align-items: center;
            justify-content: center;
            #home{
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 2%;
            }
        }
        .search{
            width: 30%;
        }
        .lrBtn{
            margin-right: 2%;
        }
    }
</style>

<style lang="less">
    #searchInput {
        border-radius: 40px;
        width: 30vw;
    }
</style>

<script>
import axios from '../api/axios.js';
export default {
    data(){
        return {
            restaurants: [],
            searchVal: '',
            timeout:  null
        }
    },
    methods: {
        //导航栏的左右路由按钮
        back(){
            window.history.back();
        },
        to(){
            window.history.go(1);
        },
        loadAll(){
            //搜索框的数据
            return [
                { "": ""},    
            ];
        },
        querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            
            //获取搜索框默认值
            let initialSearchdata = []
            axios.getMusic({
                url: `search/hot`
            }).then((res) => {
                res.data.result.hots.forEach((val) => {
                    initialSearchdata.push({"value":`${val.first}`})
                })
                cb(initialSearchdata)
            })

            //搜索框请求数据
            let list = []
            if(queryString !== ""){
                axios.getMusic({
                url: `search?keywords=${queryString}`
                }).then(function(res){
                    list.splice(0, list.length)
                    res.data.result.songs.forEach(val => {
                        list.push([{'value': `${val.name}-${val.artists[0].name}`}][0])
                    });
                    //调用cd方法插入到页面
                    cb(list)
                })
                this.$router.push({path:'/search',query:{q:queryString}})
            }
        },
        //点击搜索框函数
        handleSelect(item) {
            this.$router.push({path:'/search',query:{q:item.value}})
        },
        //回车搜索函数
        searchFun(searchVal){
            if(searchVal.replace(/\s/,"") !== ""){
                this.$router.push({path:'/search',query:{q:searchVal}})
            }else{
                this.tips('输入框内容不能为空')
            }
        },
        //弹框函数,需要传入一个用于弹窗的字符串
        tips(val) {
            this.$notify.error({
            title: '错误',
            message: val
            });
        }
    },
    mounted(){
        this.restaurants = this.loadAll();
    }
}
</script>