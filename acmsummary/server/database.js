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
            userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
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

    async deleteUserById(userId){
        const res = await pool.query(`
            DELETE FROM users WHERE id = $1
        `, [userId])
        return res
    },

    async getPasswordById(userId){
        const res = await pool.query(`
            SELECT password FROM users WHERE id = $1
        `, [userId])
        return res.rows[0]
    },

    async changePassword(userId, password){
        const res = await pool.query(`
            UPDATE users SET password = $1 WHERE id = $2
        `, [password, userId])
        return res
    },

    async addSolvedQuestion(data){
        const res = await pool.query(`
            INSERT INTO history (type, title, difficulty, solveTime, userid) VALUES ($1, $2, $3, $4, $5)
        `, [data.type, data.title, data.difficulty, data.solveTime, data.userId])
        return res.rows[0]
    },

    async checkQuestionExistById(id, userId){
        const res = await pool.query(`
            SELECT * FROM history WHERE title = $1 AND userid = $2
        `, [id, userId])
        return res.rows[0]
    },

    async getQuestionData(userId){
        const res = await pool.query(`
            SELECT * FROM history WHERE userid = $1
        `, [userId])
        return res
    },

    async deleteQuestionDataById(id, userId){
        const res = await pool.query(`
            DELETE FROM history WHERE id = $1 AND userid = $2
        `, [id, userId])
        return res
    }
}

module.exports = {
    initDB,
    db
}