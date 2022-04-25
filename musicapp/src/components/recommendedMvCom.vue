<template>
    <div class="recommendedmvcom">
         <div class="recommendedmv" @click="mvClick(recmvdata[index].id)">
            <span class=" -el-image">
                <el-image
                style="width: 250px; height: 140px;"
                :src="recmvdata[index].picUrl"
                fit="fill"></el-image>
                <p class="Playbacknum">{{recmvdata[index].playCount}}</p>
                <div class="recommendedmvAfter">
                    <el-row class="recommendedmvAfter-btn">
                        <el-button icon="el-icon-caret-right" size="medium" circle></el-button>
                    </el-row>
                </div>
                <p class="recommendedmvText">{{recmvdata[index].name}}</p>
                <p class="recommendedmvTextBottom">{{recmvdata[index].artistName}}</p>
            </span>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .el-image{
        border-radius: 5px;
        cursor: pointer;
    }
    .recommendedmv{
        position: relative;
        text-align: left;
    }
    .Playbacknum{
        position: absolute;
        top: 3%;
        color: white;
        right: 4%;
    }
    .recommendedmvAfter{
        position: absolute;
        top: 31%;
        left: 44%;
        opacity: .0;
        transition: .5s;
    }
    .recommendedmv:hover .recommendedmvAfter{
        opacity: .8;
    }
    .recommendedmvText{
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
    }
    .recommendedmvTextBottom{
        font-size: 14px;
        margin-top: 5px;
        color: rgb(78, 78, 78);
    }
</style>

<script>
export default ({
    data(){
        return {
            
        }
    },
    methods: {
        mvClick(id){
            this.$router.push({path:'/Mv',query:{id:id}})
        }
    },
    props: ['recmvdata','index']
})
</script>
