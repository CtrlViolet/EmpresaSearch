const db = require('./db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('Conexión exitosa:', rows);
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

testConnection();
