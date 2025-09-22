const express = require('express')

const router = express.Router()

//登录功能
router.post('/login', (req, res)=>{
    const request = req.body
    console.log(request.username)
    console.log(request.password)
    res.send('ok')
})

module.exports = router