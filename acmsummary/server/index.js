const express = require('express')
const cors = require('cors')
const { router } = require('./router')
const { initDB } = require('./database')

const app = express()

//初始化数据库
initDB().catch(error => {
    console.log('数据库初始化失败:', error)
})

//配置全局中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//配置路由组件
app.use('/server', router)

//启动服务器
app.listen(8080, ()=>{
    console.log("server is running on port 8080")
})