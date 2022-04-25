import axios from 'axios';
//请求的服务器链接
let url = "http://120.78.153.60:3000/"

//超时时间
let timeout = 3000

//创建axios实例
//基本的get请求
const getMusic = axios.create({
    baseURL: url,
    method: 'GET',
    timeout: timeout,
})

//基本的post请求
const postMusic = axios.create({
    baseURL: url,
    method: 'POST',
    timeout: timeout,
})

/*
    获取音乐的url
    参数说明:需传入一个音乐的id
*/
const getMusicUrl = axios.create({
    baseURL: `${url}song/url?`,
    method: 'GET',
    timeout: timeout,
})


/*
    获取歌单的详细
    参数说明:需传入一个歌单的id[s:歌单最近的s个收藏者，默认为8](后面这个参数可选)
*/
const getMusicList = axios.create({
    baseURL: `${url}playlist/detail?`,
    method: 'GET',
    timeout: timeout
})
var request = {
    getMusic,
    postMusic,
    getMusicUrl,
    getMusicList,
}

export default request;