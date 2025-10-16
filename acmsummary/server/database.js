const { Pool } = require('pg')
const config = require('./config')

//登录数据库
const pool = new Pool({
    user: config.DBusername,
    host: 'localhost',
    database: config.DBName,
    password: config.DBpassword,
    port: 5432,
});

//初始化数据库
async function initDB(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            difficulty INTEGER,
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
            comment VARCHAR(255),
            lastDone TIMESTAMP,
            resource VARCHAR(255),
            memoryRound INTEGER,
            type VARCHAR(50) NOT NULL,
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
            INSERT INTO users (username, password, role, difficulty) VALUES ($1, $2, $3, $4)
        `, [username, password, role, 800])
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
            INSERT INTO history (type, difficulty, solveTime, userid, resource, lastDone, memoryRound, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [data.type, data.difficulty, data.solveTime, data.userId, data.resource, data.solveTime, 0, ''])
        return res.rows[0]
    },

    async checkQuestionExistById(id, userId){
        const res = await pool.query(`
            SELECT * FROM history WHERE id = $1 AND userid = $2
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
    },

    async changeUserDifficulty(userId, newDiff){
        const res = await pool.query(`
            UPDATE users SET difficulty = $1 WHERE id = $2
        `, [newDiff, userId])
        return res
    },

    async getQuestionById(id, userId){
        const res = await pool.query(`
            SELECT * FROM history WHERE userid = $1 AND id = $2
        `, [userId, id])
        return res
    },

    async changeQuestionById(id, userId, newDoneDate, newMemoryRound){
        const res = await pool.query(`
            UPDATE history SET memoryRound = $1, lastDone = $2 WHERE id = $3 AND userid = $4
        `, [newMemoryRound, newDoneDate, id, userId])
        return res
    },

    async changeCommentById(id, userId, newComment){
        const res = await pool.query(`
            UPDATE history SET comment = $1 WHERE id = $2 AND userId = $3
        `, [newComment, id, userId])
        return res
    }
}

module.exports = {
    initDB,
    db
}