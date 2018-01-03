/* 需要请求后台时的代码
var baseUrl = 'http://test.jcyapi.easybao.com/api/XXX' // 测试
if (env === 'PRE') {
  baseUrl = 'http://pre.jcyapi.easybao.com/api/XXX' // 预发
} else if (env === 'PROD') {
  baseUrl = 'https://jcyapi.easybao.com/api/XXX' // 生产
}
console.log('** running env:', env)

const main = document.getElementById('main')
axios.post(baseUrl, {})
  .then((res)=> {
    console.log(res)
  }).catch((error) =>{
    console.log('网络错误,请稍后重试！', error)
    main.className = 'main err'
    main.innerHTML = '<div class="err-box"><img src="images/404.png" /><p>没有找到您要的页面</p></div>'
  })
*/