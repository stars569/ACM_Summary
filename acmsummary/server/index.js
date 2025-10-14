const express = require('express')
const cors = require('cors')
const { router, auth } = require('./router')
const { initDB, db } = require('./database')

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

//添加题目信息
app.post('/api/add', auth, async (req, res) => {
    try{
        const data = req.body.data
        const checkName = await db.checkQuestionExistByTitle(data.title)
        if(checkName)return res.status(401).json({ message: '该题目与已有题目重名' })
        const result = await db.addSolvedQuestion(data)
        res.status(201).json({ message: '上传题目成功', info: result })
    }
    catch(error){
        res.status(500).json({ message: '数据库未响应' })
    }
})

//获取题目信息
app.get('/api/question', auth, async (req, res) => {
    try{
        const result = await db.getQuestionData()
        res.status(201).json({ message:'获取历史上传记录成功', data:result })
    }
    catch(error){
        res.status(500).json({ message:'数据库未响应' })
    }
})

//启动服务器
app.listen(8080, ()=>{
    console.log("server is running on port 8080")
})