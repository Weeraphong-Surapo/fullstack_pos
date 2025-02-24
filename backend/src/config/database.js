// database.js (with CommonJS)
const mysql = require('mysql2/promise');

const connect = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', 
            database: 'pos_db',
        });
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

module.exports.query = async (sql, params = []) => {
    const connection = await connect();
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Query failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
};
