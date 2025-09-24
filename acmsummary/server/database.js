const { Pool } = require('pg')
const config = require('./config')

//登录数据库
const pool = new Pool({
    user: config.DBusername,
    host: 'localhost',
    database: 'ACM',
    password: config.DBpassword,
    port: 5432,
});

//初始化数据库
async function initDB(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
}

//数据库操作函数
const db = {
    async getUserByUsername(username){
        const res = await pool.query(`
            SELECT * FROM users WHERE username = $1
        `, [username])
        return res.rows[0]
    },

    async createUser(username, password, role = 'user'){
        const res = await pool.query(`
            INSERT INTO users (username, password, role) VALUES ($1, $2, $3)
        `, [username, password, role])
        return res.rows[0]
    }
}

module.exports = {
    initDB,
    db
}