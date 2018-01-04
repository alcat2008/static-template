const BUILD_ENV = process.env.BUILD_ENV
console.log('** running env:', BUILD_ENV)


/* 需要请求后台时的代码
var baseUrl = 'http://XXX/api/XXX' // 测试
if (BUILD_ENV === 'PRE') {
  baseUrl = 'http://XXX/api/XXX' // 预发
} else if (BUILD_ENV === 'PROD') {
  baseUrl = 'https://XXX/api/XXX' // 生产
}
console.log('** running env:', env)

const main = document.getElementById('main')
axios.post(baseUrl, {}) // 或者其他请求方式
  .then((res)=> {
    console.log(res)
  }).catch((error) =>{
    console.log('网络错误,请稍后重试！', error)
  })
*/
