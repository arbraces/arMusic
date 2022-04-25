<template>
  <div>
      <p>404</p>
      <p>Not found</p>
  </div>
</template>

<script>
export default {
 
}
</script>

<style lang="less" scoped>
    div{
      width: 100vw;
      height: 100vh;
      z-index: 10000000;
      position: fixed;
      background-color: white;
      top: 0px;
      right: 0px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: default;
    }
    p:nth-child(1){
      font-size: 80px;
    }
    p:nth-child(2){
      font-size: 50px;
    }
</style>