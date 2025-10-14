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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            title VARCHAR(255) UNIQUE NOT NULL,
            difficulty INTEGER,
            solveTime TIMESTAMP,
            uploadTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    },

    async addSolvedQuestion(data){
        const res = await pool.query(`
            INSERT INTO history (type, title, difficulty, solveTime) VALUES ($1, $2, $3, $4)
        `, [data.type, data.title, data.difficulty, data.solveTime])
        console.log(data)
        return res.rows[0]
    },

    async checkQuestionExistByTitle(title){
        const res = await pool.query(`
            SELECT * FROM history WHERE title = $1
        `, [title])
        return res.rows[0]
    },

    async getQuestionData(){
        const res = pool.query(`
            SELECT * FROM history
        `)
        return res
    }
}

module.exports = {
    initDB,
    db
}