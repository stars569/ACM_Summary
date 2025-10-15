const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { db } = require('./database')
const config = require('./config')

const router = express.Router()

//登录功能
router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body

        const checkUser = await db.getUserByUsername(username)
        if(!checkUser)return res.status(401).json({ message: '用户名未注册' })
        
        const passwordComp = await bcrypt.compare(password, checkUser.password)
        if(!passwordComp)return res.status(401).json({ message: '密码错误' })

        const token = jwt.sign(
            { id: checkUser.id, username: checkUser.username },
            config.jwtToken,
            { expiresIn: '10h' }
        )

        const response = {
            username: username
        }

        res.status(200).json({ message:'登录成功', user:response, token:token})
    }
    catch(error){
        console.log('登录失败:', error)
        res.status(500).json({ message: '登录失败' })
    }
})

//注册功能
router.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body

        const result = await db.getUserByUsername(username)
        if(result)return res.status(401).json({ message: '用户名已经被注册' })

        const newpassword = await bcrypt.hash(password, 10)
        const newUser = await db.createUser(username, newpassword)
        console.log('新用户:', newUser)

        const response = {
            username: newUser.username,
        }

        res.status(200).json({ message:'注册成功', user:response })
    }
    catch(error){
        console.log('注册失败:', error)
        res.status(500).json({ message: '注册失败' })
    }
})

//认证中间件
function auth(req, res, next){
    const header = req.headers['authorization']
    const jwtToken = header && header.split(' ')[1]
    if(!jwtToken)return res.status(401).json({ message: '未提供令牌' })
    jwt.verify(jwtToken, config.jwtToken, (err, user) => {
        if(err){
            return res.status(401).json({ message: 'jwt失效' })
        }
        req.user = user
        next()
    })
}

module.exports = {
    router,
    auth
}